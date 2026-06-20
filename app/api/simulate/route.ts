import { NextRequest, NextResponse } from "next/server";
import { chat } from "@/lib/llm";
import { searchWeb, formatSerpResults } from "@/lib/serp";
import { ExtractedInsights, PersonaSliders, MarketConditions, SimulationResult } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { insights, sliders, market } = (await req.json()) as {
      insights: ExtractedInsights;
      sliders: PersonaSliders;
      market: MarketConditions;
    };

    // Web search for real launch strategy patterns
    const serpResults = await searchWeb(
      `${insights.featureName} ${insights.targetSegments[0]} launch strategy reception user feedback`
    );
    const serpContext = formatSerpResults(serpResults);

    const prompt = `You are a product launch simulation engine. Generate realistic persona reactions for a feature launch across three scenarios.

FEATURE: ${insights.featureName}
CORE BENEFIT: ${insights.coreBenefit}
TARGET SEGMENTS: ${insights.targetSegments.join(", ")}
KEY DIFFERENTIATORS: ${insights.keyDifferentiators.join(", ")}
POTENTIAL CONCERNS: ${insights.potentialConcerns.join(", ")}
${serpContext}

PERSONA PARAMETERS (0-100):
- Trust Level: ${sliders.trustLevel} (0=no trust, 100=high trust)
- Urgency: ${sliders.urgency} (0=not urgent, 100=very urgent)
- Price Sensitivity: ${sliders.priceSensitivity} (0=insensitive, 100=very sensitive)
- Switching Friction: ${sliders.switchingFriction} (0=easy switch, 100=hard to switch)
- Novelty Appetite: ${sliders.noveltyAppetite} (0=risk averse, 100=innovation hungry)
- Adoption Readiness: ${sliders.adoptionReadiness} (0=resistant, 100=ready)

MARKET CONDITIONS:
- Market Maturity: ${market.marketMaturity} (0=emerging, 100=mature)
- Competition Intensity: ${market.competitionIntensity}
- Economic Climate: ${market.economicClimate} (0=tight, 100=expansionary)

Generate 5 personas for EACH of the three scenarios (15 total). Personas: power_user, casual_user, skeptic, admin, new_user.
Use the slider values to calibrate reactions — high trust = more positive, high price sensitivity = cost concerns dominate, etc.

Return ONLY valid JSON, no markdown, no code fences:
{
  "overallSentiment": <number 0-100 for likely case>,
  "sentimentLabel": "Mixed",
  "personas": [
    {
      "personaName": "The Power User",
      "personaType": "power_user",
      "mood": "excited",
      "moodEmoji": "🚀",
      "quote": "specific reaction quote referencing the actual feature",
      "concerns": ["specific concern about this feature"],
      "drivers": ["specific driver for this persona"],
      "adoptionLikelihood": 85,
      "scenario": "best"
    }
  ],
  "weatherReport": {
    "adoptionSunshine": <0-100>,
    "backlashStorm": <0-100>,
    "confusionFog": <0-100>,
    "trustTurbulence": <0-100>
  },
  "topRisks": ["risk1", "risk2", "risk3"],
  "topOpportunities": ["opportunity1", "opportunity2", "opportunity3"]
}

mood must be one of: excited, interested, neutral, skeptical, confused, blocked, resistant
scenario must be one of: best, likely, worst
Make all 15 personas (5 per scenario). Make quotes specific to ${insights.featureName}.`;

    const raw = await chat(prompt);
    const clean = raw.replace(/```json\n?|\n?```/g, "").trim();
    const jsonMatch = clean.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in LLM response");
    const simulation: SimulationResult = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ simulation });
  } catch (err) {
    console.error("Simulate error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Failed to run simulation" },
      { status: 500 }
    );
  }
}
