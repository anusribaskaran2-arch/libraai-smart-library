/** Minimal server-only Groq client (OpenAI-compatible chat completions).
 *
 * IMPORTANT: this module reads GROQ_API_KEY from the server environment.
 * Never import it from a client component — the key must never reach the
 * browser. Route handlers are the only intended consumers.
 */

// Fail loudly if this module is ever pulled into a browser bundle.
if (typeof window !== "undefined") {
  throw new Error(
    "src/lib/groq.ts is server-only and must not be imported from client code."
  );
}

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL ?? "openai/gpt-oss-120b";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/** True when the server has a Groq key configured. */
export function isGroqConfigured(): boolean {
  return Boolean(process.env.GROQ_API_KEY);
}

/** Call Groq and parse a JSON object response. Throws on any failure so the
 * caller can fall back to local keyword search. */
export async function groqJson<T>(
  messages: ChatMessage[],
  timeoutMs = 15_000
): Promise<T> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not configured.");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(GROQ_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature: 0.2,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(
        `Groq request failed (${res.status}): ${detail.slice(0, 200)}`
      );
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("Groq returned an empty response.");

    return JSON.parse(content) as T;
  } finally {
    clearTimeout(timer);
  }
}

/** Shared instruction that keeps the model grounded in the local catalog. */
export const GROUNDING_RULES = [
  "You are the retrieval assistant for a small college library.",
  "You are given a CATALOG array of books that exist in the library right now.",
  "Use ONLY the books in the CATALOG. Never invent, rename, or add books, authors, genres, ids or availability.",
  "Every id you output MUST be copied verbatim from the CATALOG.",
  "If nothing in the CATALOG matches, return an empty selection rather than guessing.",
].join(" ");
