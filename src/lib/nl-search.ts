/** Local natural-language search for the Ask LibraAI assistant.
 *
 * Used because no Groq key is configured yet. Parses simple intent from the
 * query and searches the REAL store catalog — it never invents books.
 */

import type { Book } from "./types";

/** Genre keyword → canonical genre mapping for intent detection. */
const GENRE_KEYWORDS: Record<string, string> = {
  python: "Programming",
  programming: "Programming",
  coding: "Programming",
  javascript: "Programming",
  java: "Programming",
  linux: "Operating Systems",
  os: "Operating Systems",
  "operating system": "Operating Systems",
  sql: "Databases",
  database: "Databases",
  dbms: "Databases",
  network: "Networking",
  networking: "Networking",
  "machine learning": "Artificial Intelligence",
  "deep learning": "Artificial Intelligence",
  ai: "Artificial Intelligence",
  "artificial intelligence": "Artificial Intelligence",
  "software engineering": "Software Engineering",
  "clean code": "Software Engineering",
};

const LEVEL_KEYWORDS: Record<string, string> = {
  beginner: "Beginner",
  beginners: "Beginner",
  "for beginners": "Beginner",
  introduction: "Beginner",
  intro: "Beginner",
  basics: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export interface NlSearchResult {
  books: Book[];
  /** Human-readable summary of what was understood from the query. */
  interpretation: string;
}

export function nlSearch(query: string, books: Book[]): NlSearchResult {
  const q = query.toLowerCase();

  const genre = Object.keys(GENRE_KEYWORDS).find((k) => q.includes(k));
  const level = Object.keys(LEVEL_KEYWORDS).find((k) => q.includes(k));

  // Remaining words act as free-text keywords
  const stop = new Set([
    "show", "me", "find", "available", "availability", "books", "book", "the",
    "a", "an", "for", "in", "on", "is", "are", "any", "give", "about", "of",
  ]);
  const keywords = q
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !stop.has(w) && !GENRE_KEYWORDS[w] && !LEVEL_KEYWORDS[w]);

  let results = books.filter((b) => {
    const text = `${b.title} ${b.author} ${b.genre} ${b.level}`.toLowerCase();
    const matchesGenre = genre ? text.includes(genre) || b.genre === GENRE_KEYWORDS[genre] : true;
    const matchesLevel = level ? b.level === LEVEL_KEYWORDS[level] : true;
    const matchesKeywords =
      keywords.length === 0 || keywords.some((k) => text.includes(k));
    return matchesGenre && matchesLevel && matchesKeywords;
  });

  // "available" / "in stock" style intent narrows to in-stock books
  const wantsAvailable = /available|in stock|on shelf|now/.test(q);
  if (wantsAvailable) results = results.filter((b) => b.availableCopies > 0);

  const parts: string[] = [];
  if (level) parts.push(`level: ${LEVEL_KEYWORDS[level]}`);
  if (genre) parts.push(`subject: ${GENRE_KEYWORDS[genre]}`);
  if (keywords.length) parts.push(`keywords: ${keywords.join(", ")}`);
  if (wantsAvailable) parts.push("only available copies");

  return {
    books: results,
    interpretation:
      parts.length > 0
        ? `Filtered by ${parts.join(" · ")}`
        : "Interpreted as a general search across the catalog",
  };
}
