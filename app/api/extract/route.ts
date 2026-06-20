import { NextRequest, NextResponse } from "next/server";
import { chat } from "@/lib/llm";
import { searchWeb, formatSerpResults } from "@/lib/serp";
import { ExtractedInsights, LaunchBriefData } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { briefText, briefData } = (await req.json()) as {
      briefText?: string;
      briefData?: LaunchBriefData;
    };

    const inputText = briefText
      ? briefText
      : `Feature Name: ${briefData!.featureName}
Description: ${briefData!.description}
Target Users: ${briefData!.targetUsers}
Value Proposition: ${briefData!.valueProposition}
Launch Goal: ${briefData!.launchGoal}
Timeline: ${briefData!.timeline}
Competitors: ${briefData!.competitors}
Known Concerns: ${briefData!.concerns}`;

    // Optional web search for competitor & market context
    const featureName = briefData?.featureName ?? briefText?.split("\n")[0] ?? "product";
    const [competitorResults, marketResults] = await Promise.all([
      searchWeb(`${featureName} competitors alternatives market 2024`),
      searchWeb(`${featureName} product launch strategy market trends`),
    ]);
    const serpContext =
      formatSerpResults(competitorResults) + formatSerpResults(marketResults);

    const prompt = `You are a senior product launch intelligence analyst. Analyze the launch brief and extract structured insights.

INPUT BRIEF:
${inputText}
${serpContext}

Return ONLY a valid JSON object — no markdown, no code fences, no explanation:
{
  "featureName": "short feature name",
  "coreBenefit": "one sentence primary user benefit",
  "targetSegments": ["segment1", "segment2", "segment3"],
  "keyDifferentiators": ["differentiator1", "differentiator2", "differentiator3"],
  "potentialConcerns": ["concern1", "concern2", "concern3"],
  "launchComplexity": "low",
  "marketReadiness": "one sentence about market conditions",
  "summary": "2-3 sentence executive summary"
}

launchComplexity must be exactly one of: low, medium, high
Be specific and honest about risks. Use web search data if provided to ground the competitor landscape.`;

    const raw = await chat(prompt);
    const clean = raw.replace(/```json\n?|\n?```/g, "").trim();
    // Extract JSON if wrapped in extra text
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in LLM response");
    const insights: ExtractedInsights = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ insights });
  } catch (err) {
    console.error("Extract error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Failed to extract insights" },
      { status: 500 }
    );
  }
}
