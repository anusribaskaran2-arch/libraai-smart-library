import { NextResponse } from "next/server";
import { nlSearch } from "@/lib/nl-search";
import { groqJson, isGroqConfigured, GROUNDING_RULES } from "@/lib/groq";
import {
  catalogPrompt,
  sanitizeBooks,
  type AiBook,
  type AiSearchResponse,
} from "@/lib/ai";

export const runtime = "nodejs";

/** Order the catalog by the ids the model returned, dropping unknown ids. */
function matchByIds(ids: string[], books: AiBook[]): AiBook[] {
  const byId = new Map(books.map((b) => [b.id, b]));
  return ids
    .map((id) => byId.get(id))
    .filter((b): b is AiBook => Boolean(b));
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const body = (payload ?? {}) as Record<string, unknown>;
  const query = typeof body.query === "string" ? body.query.trim() : "";
  const books = sanitizeBooks(body.books);

  if (!query) {
    return NextResponse.json(
      { error: "A search query is required." },
      { status: 400 }
    );
  }

  /** Local keyword search over the REAL catalog — used when Groq is missing
   * or fails, so the page still works offline. */
  const keywordFallback = (): NextResponse<AiSearchResponse> => {
    const result = nlSearch(query, books);
    return NextResponse.json<AiSearchResponse>({
      books: result.books as AiBook[],
      interpretation: result.interpretation,
      source: "keyword",
    });
  };

  if (books.length === 0) {
    return NextResponse.json<AiSearchResponse>({
      books: [],
      interpretation: "The catalog is empty, so there is nothing to search.",
      source: "keyword",
    });
  }

  // No key configured → keyword search only. Never pretend the model ran.
  if (!isGroqConfigured()) return keywordFallback();

  try {
    const result = await groqJson<{ ids?: unknown; interpretation?: unknown }>([
      {
        role: "system",
        content: `${GROUNDING_RULES} Respond with a JSON object of the form {"ids": ["<catalog id>", ...], "interpretation": "<one short sentence explaining what you matched>"}. Search across title, author, genre and level. Respect availability wording ("available now", "in stock") by preferring entries whose availability is not "none available".`,
      },
      {
        role: "user",
        content: `CATALOG:\n${catalogPrompt(books)}\n\nUSER QUERY: ${query}`,
      },
    ]);

    const ids = Array.isArray(result.ids)
      ? result.ids.filter((id): id is string => typeof id === "string")
      : [];
    const matched = matchByIds(ids, books);

    // A model response that resolves to no real catalog entry is treated as a
    // failure, not as "no results" — fall back so the user still sees matches.
    if (matched.length === 0) return keywordFallback();

    const interpretation =
      typeof result.interpretation === "string" && result.interpretation.trim()
        ? result.interpretation.trim()
        : `Matched ${matched.length} book${matched.length === 1 ? "" : "s"} in the catalog.`;

    return NextResponse.json<AiSearchResponse>({
      books: matched,
      interpretation,
      source: "groq",
    });
  } catch (error) {
    console.error("[ai/search] Groq failed, using keyword search:", error);
    return keywordFallback();
  }
}
