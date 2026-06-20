import { getCerebrasClient } from "@/lib/cerebras";

export const MODEL = "gpt-oss-120b";

function getClient() {
  return getCerebrasClient();
}

export async function chat(prompt: string, systemPrompt?: string): Promise<string> {
  const messages: { role: "system" | "user"; content: string }[] = [];
  if (systemPrompt) messages.push({ role: "system", content: systemPrompt });
  messages.push({ role: "user", content: prompt });

  const response = await getClient().chat.completions.create({
    model: MODEL,
    messages,
    max_completion_tokens: 4096,
  });

  const r = response as { choices: { message?: { content?: string } }[] };
  return (r.choices[0]?.message?.content as string) ?? "";
}

export async function chatStream(
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  onChunk: (text: string) => void
): Promise<void> {
  const stream = await getClient().chat.completions.create({
    model: MODEL,
    messages,
    max_completion_tokens: 2048,
    stream: true,
  });

  for await (const chunk of stream) {
    const c = chunk as { choices: { delta?: { content?: string } }[] };
    const text = c.choices[0]?.delta?.content;
    if (text) onChunk(text);
  }
}
