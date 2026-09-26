import { NextResponse } from "next/server";
import { groqJson, isGroqConfigured, GROUNDING_RULES } from "@/lib/groq";
import {
  catalogPrompt,
  sanitizeBooks,
  type AiBook,
  type AiHistoryItem,
  type AiRecommendResponse,
  type AiRecommendation,
} from "@/lib/ai";

export const runtime = "nodejs";

const DEFAULT_LIMIT = 3;

function sanitizeHistory(value: unknown): AiHistoryItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((raw): AiHistoryItem[] => {
    if (!raw || typeof raw !== "object") return [];
    const h = raw as Record<string, unknown>;
    if (typeof h.title !== "string" || !h.title.trim()) return [];
    return [{
      title: h.title,
      genre: typeof h.genre === "string" ? h.genre : undefined,
    }];
  });
}

/** Deterministic suggestions over the REAL catalog — the fallback path. */
function keywordRecommend(
  books: AiBook[],
  history: AiHistoryItem[],
  limit: number
): AiRecommendation[] {
  const borrowed = new Set(history.map((h) => h.title.toLowerCase()));
  const genres = new Set(
    history
      .map((h) => h.genre?.toLowerCase())
      .filter((g): g is string => Boolean(g))
  );

  return books
    .filter((b) => !borrowed.has(b.title.toLowerCase()))
    .map((b) => {
      const sameGenre = genres.has(b.genre.toLowerCase());
      const available = b.availableCopies > 0;
      const score = (sameGenre ? 3 : 0) + (available ? 2 : 0);
      return { book: b, sameGenre, available, score };
    })
    .sort(
      (a, b) => b.score - a.score || a.book.title.localeCompare(b.book.title)
    )
    .slice(0, limit)
    .map(({ book, sameGenre, available }) => ({
      id: book.id,
      reason: sameGenre
        ? `More in ${book.genre} — a subject you've borrowed before.`
        : available
          ? "On the shelf now and a good fit for your level."
          : "A strong addition from the wider collection.",
    }));
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const body = (payload ?? {}) as Record<string, unknown>;
  const books = sanitizeBooks(body.books);
  const history = sanitizeHistory(body.history);
  const limit =
    typeof body.limit === "number" && body.limit > 0
      ? Math.min(Math.floor(body.limit), 10)
      : DEFAULT_LIMIT;

  if (books.length === 0) {
    return NextResponse.json<AiRecommendResponse>({
      recommendations: [],
      interpretation: "The catalog is empty, so there is nothing to recommend.",
      source: "keyword",
    });
  }

  const fallback = (): NextResponse<AiRecommendResponse> =>
    NextResponse.json<AiRecommendResponse>({
      recommendations: keywordRecommend(books, history, limit),
      interpretation:
        history.length > 0
          ? "Based on your borrowing history and what's on the shelf."
          : "Popular picks available in the library right now.",
      source: "keyword",
    });

  if (!isGroqConfigured()) return fallback();

  try {
    const historyText =
      history.length > 0
        ? history
            .map((h) => (h.genre ? `${h.title} (${h.genre})` : h.title))
            .join("; ")
        : "none yet";

    const result = await groqJson<{
      recommendations?: unknown;
      interpretation?: unknown;
    }>([
      {
        role: "system",
        content: `${GROUNDING_RULES} Respond with a JSON object {"recommendations": [{"id": "<catalog id>", "reason": "<short reason>"}], "interpretation": "<one short sentence>"}. Recommend at most ${limit} books the student has NOT already borrowed, preferring subjects related to their history and titles that are currently available.`,
      },
      {
        role: "user",
        content: `CATALOG:\n${catalogPrompt(books)}\n\nALREADY BORROWED: ${historyText}`,
      },
    ]);

    const byId = new Map(books.map((b) => [b.id, b]));
    const borrowed = new Set(history.map((h) => h.title.toLowerCase()));
    const seen = new Set<string>();

    const recommendations = (
      Array.isArray(result.recommendations) ? result.recommendations : []
    ).flatMap((raw): AiRecommendation[] => {
      if (!raw || typeof raw !== "object") return [];
      const item = raw as Record<string, unknown>;
      if (typeof item.id !== "string") return [];
      const book = byId.get(item.id);
      if (!book) return [];
      if (borrowed.has(book.title.toLowerCase())) return [];
      if (seen.has(book.id)) return [];
      seen.add(book.id);
      return [{
        id: book.id,
        reason:
          typeof item.reason === "string" && item.reason.trim()
            ? item.reason.trim()
            : "Recommended from the catalog.",
      }];
    });

    if (recommendations.length === 0) return fallback();

    const interpretation =
      typeof result.interpretation === "string" && result.interpretation.trim()
        ? result.interpretation.trim()
        : history.length > 0
          ? "Based on your borrowing history and what's on the shelf."
          : "Popular picks available in the library right now.";

    return NextResponse.json<AiRecommendResponse>({
      recommendations: recommendations.slice(0, limit),
      interpretation,
      source: "groq",
    });
  } catch (error) {
    console.error("[ai/recommend] Groq failed, using keyword fallback:", error);
    return fallback();
  }
}
