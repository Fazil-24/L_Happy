import { NextRequest, NextResponse } from "next/server";
import { chat } from "@/lib/llm";
import { searchWeb, formatSerpResults } from "@/lib/serp";
import {
  ExtractedInsights,
  PersonaSliders,
  MarketConditions,
  SimulationResult,
  LaunchPlaybook,
} from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { insights, sliders, market, simulation } = (await req.json()) as {
      insights: ExtractedInsights;
      sliders: PersonaSliders;
      market: MarketConditions;
      simulation: SimulationResult;
    };

    const serpResults = await searchWeb(
      `${insights.featureName} launch playbook go-to-market strategy rollout best practices`
    );
    const serpContext = formatSerpResults(serpResults);

    const likelyPersonas = simulation.personas
      .filter((p) => p.scenario === "likely")
      .map((p) => `${p.personaName} (${p.mood}): "${p.quote}"`)
      .join("\n");

    const prompt = `You are a senior product launch strategist. Create a comprehensive, actionable launch playbook.

FEATURE: ${insights.featureName}
CORE BENEFIT: ${insights.coreBenefit}
SUMMARY: ${insights.summary}
TARGET SEGMENTS: ${insights.targetSegments.join(", ")}
DIFFERENTIATORS: ${insights.keyDifferentiators.join(", ")}
LAUNCH COMPLEXITY: ${insights.launchComplexity}
${serpContext}

SIMULATION: Sentiment ${simulation.overallSentiment}% (${simulation.sentimentLabel})
TOP RISKS: ${simulation.topRisks.join(", ")}
TOP OPPORTUNITIES: ${simulation.topOpportunities.join(", ")}

LIKELY PERSONA REACTIONS:
${likelyPersonas}

MARKET: Trust=${sliders.trustLevel}, Urgency=${sliders.urgency}, Competition=${market.competitionIntensity}

Return ONLY valid JSON, no markdown, no code fences:
{
  "recommendedStyle": {
    "name": "Phased Beta with Privacy Proof",
    "description": "2-3 sentences why this fits",
    "fit": "excellent",
    "fitScore": 87,
    "pros": ["pro1", "pro2", "pro3"],
    "cons": ["con1", "con2"],
    "messagingAngle": "one-sentence core message"
  },
  "allStyles": [
    {"name": "Quiet Beta", "description": "desc", "fit": "good", "fitScore": 72, "pros": ["p"], "cons": ["c"], "messagingAngle": "angle"},
    {"name": "Waitlist Hype", "description": "desc", "fit": "neutral", "fitScore": 55, "pros": ["p"], "cons": ["c"], "messagingAngle": "angle"},
    {"name": "Power User First", "description": "desc", "fit": "excellent", "fitScore": 82, "pros": ["p"], "cons": ["c"], "messagingAngle": "angle"},
    {"name": "Pricing-Led", "description": "desc", "fit": "poor", "fitScore": 38, "pros": ["p"], "cons": ["c"], "messagingAngle": "angle"},
    {"name": "Ecosystem Bundle", "description": "desc", "fit": "good", "fitScore": 65, "pros": ["p"], "cons": ["c"], "messagingAngle": "angle"}
  ],
  "phases": [
    {"phase": "Phase 1: Private Beta", "duration": "Week 1-2", "actions": ["action1", "action2", "action3"], "successMetric": "specific measurable KPI"},
    {"phase": "Phase 2: Controlled Rollout", "duration": "Week 3-4", "actions": ["action1", "action2"], "successMetric": "specific KPI"},
    {"phase": "Phase 3: Public Launch", "duration": "Month 2", "actions": ["action1", "action2"], "successMetric": "specific KPI"}
  ],
  "messaging": {
    "headline": "benefit-first headline",
    "subheadline": "addresses main concern",
    "cta": "action CTA",
    "keyMessages": ["message for power users", "message for skeptics", "message for admins"]
  },
  "safeguards": ["safeguard tied to top risk 1", "safeguard 2", "safeguard 3"],
  "successMetrics": ["40% week-1 activation", "secondary metric", "leading indicator"],
  "launchReadinessScore": 74
}

fit must be one of: excellent, good, neutral, poor. Be specific and tie everything to the actual simulation data.`;

    const raw = await chat(prompt);
    const clean = raw.replace(/```json\n?|\n?```/g, "").trim();
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in LLM response");
    const playbook: LaunchPlaybook = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ playbook });
  } catch (err) {
    console.error("Playbook error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Failed to generate playbook" },
      { status: 500 }
    );
  }
}
