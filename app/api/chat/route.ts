import { NextRequest } from "next/server";
import { MODEL } from "@/lib/llm";
import { getCerebrasClient } from "@/lib/cerebras";
import { ExtractedInsights, SimulationResult } from "@/lib/types";

function getClient() {
  return getCerebrasClient();
}

export async function POST(req: NextRequest) {
  try {
    const { messages, insights, simulation } = (await req.json()) as {
      messages: { role: "user" | "assistant"; content: string }[];
      insights: ExtractedInsights;
      simulation?: SimulationResult;
    };

    const systemPrompt = `You are LauncHappy's expert Launch Consultant — a strategic advisor specialized in product launches, go-to-market strategy, and market reception modeling.

You are currently helping a product team simulate the launch of: "${insights.featureName}"
Core benefit: ${insights.coreBenefit}
Target segments: ${insights.targetSegments.join(", ")}
Key differentiators: ${insights.keyDifferentiators.join(", ")}
Potential concerns: ${insights.potentialConcerns.join(", ")}
${
  simulation
    ? `
Current simulation results:
- Overall sentiment: ${simulation.overallSentiment}% (${simulation.sentimentLabel})
- Top risks: ${simulation.topRisks.join(", ")}
- Top opportunities: ${simulation.topOpportunities.join(", ")}
`
    : ""
}

Your role:
- Proactively suggest the best launch strategies based on the simulation data
- Answer user questions about their launch with specific, actionable advice
- Reference the persona reactions and sentiment data when relevant
- Be direct, specific, and strategic — not generic
- Keep responses concise (2-4 sentences) unless the user asks for detail
- Always ground advice in the specific feature context, not generic best practices

You are a consultant, not a chatbot. Be opinionated and make clear recommendations.`;

    const stream = await getClient().chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      max_completion_tokens: 1024,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const c = chunk as { choices: { delta?: { content?: string } }[] };
            const text = c.choices[0]?.delta?.content;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (err) {
    console.error("Chat error:", err);
    return new Response("Sorry, I encountered an error. Please try again.", { status: 500 });
  }
}
