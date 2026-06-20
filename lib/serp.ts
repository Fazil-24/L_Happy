export interface SerpResult {
  title: string;
  snippet: string;
  link: string;
}

export async function searchWeb(query: string): Promise<SerpResult[]> {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) return [];

  try {
    const url = new URL("https://serpapi.com/search.json");
    url.searchParams.set("q", query);
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("num", "5");
    url.searchParams.set("engine", "google");

    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) return [];

    const data = await res.json();
    const organic: { title: string; snippet?: string; link: string }[] =
      data.organic_results ?? [];

    return organic.slice(0, 5).map((r) => ({
      title: r.title,
      snippet: r.snippet ?? "",
      link: r.link,
    }));
  } catch {
    return [];
  }
}

export function formatSerpResults(results: SerpResult[]): string {
  if (results.length === 0) return "";
  return (
    "\n\nREAL-WORLD MARKET INTELLIGENCE (from web search):\n" +
    results
      .map((r, i) => `${i + 1}. ${r.title}\n   ${r.snippet}`)
      .join("\n")
  );
}
