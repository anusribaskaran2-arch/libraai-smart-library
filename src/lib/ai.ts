/** Shared types and helpers for the LibraAI assistant endpoints.
 *
 * Safe to import from both client and server code — contains no secrets.
 */

import type { Book } from "./types";

/** Book shape exchanged with the AI endpoints. Structurally compatible with
 * `Book`, so results can be rendered by BookCard directly. */
export interface AiBook {
  id: string;
  title: string;
  author: string;
  genre: string;
  level: string;
  availableCopies: number;
  totalCopies: number;
  shelfLocation: string;
  description?: string;
}

/** Where a result came from, surfaced in the UI so the user knows if the
 * model answered or if we fell back to plain keyword search. */
export type AiSource = "groq" | "keyword";

export interface AiSearchRequest {
  query: string;
  books: AiBook[];
}

export interface AiSearchResponse {
  /** Always a subset of the catalog the server received — never invented. */
  books: AiBook[];
  interpretation: string;
  source: AiSource;
}

export interface AiRecommendation {
  id: string;
  reason: string;
}

/** A past loan used as a taste signal for recommendations. */
export interface AiHistoryItem {
  title: string;
  genre?: string;
}

export interface AiRecommendRequest {
  books: AiBook[];
  /** Books the student has already borrowed, used as taste signals. */
  history?: AiHistoryItem[];
  limit?: number;
}

export interface AiRecommendResponse {
  recommendations: AiRecommendation[];
  interpretation: string;
  source: AiSource;
}

/** Validate an unknown payload into a clean AiBook list. */
export function sanitizeBooks(value: unknown): AiBook[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((raw): AiBook[] => {
    if (!raw || typeof raw !== "object") return [];
    const b = raw as Record<string, unknown>;
    if (
      typeof b.id !== "string" ||
      typeof b.title !== "string" ||
      typeof b.author !== "string"
    ) {
      return [];
    }
    return [{
      id: b.id,
      title: b.title,
      author: b.author,
      genre: typeof b.genre === "string" ? b.genre : "General",
      level: typeof b.level === "string" ? b.level : "Beginner",
      availableCopies:
        typeof b.availableCopies === "number" ? b.availableCopies : 0,
      totalCopies: typeof b.totalCopies === "number" ? b.totalCopies : 0,
      shelfLocation:
        typeof b.shelfLocation === "string" ? b.shelfLocation : "—",
      description:
        typeof b.description === "string" ? b.description : undefined,
    }];
  });
}

/** Client helper: project the live store catalog into the wire format. */
export function toAiBooks(books: Book[]): AiBook[] {
  return books.map((b) => ({
    id: b.id,
    title: b.title,
    author: b.author,
    genre: b.genre,
    level: b.level,
    availableCopies: b.availableCopies,
    totalCopies: b.totalCopies,
    shelfLocation: b.shelfLocation,
    description: b.description,
  }));
}

/** Compact catalog representation sent to the model. */
export function catalogPrompt(books: AiBook[]): string {
  return JSON.stringify(
    books.map((b) => ({
      id: b.id,
      title: b.title,
      author: b.author,
      genre: b.genre,
      level: b.level,
      available:
        b.availableCopies > 0
          ? `${b.availableCopies} of ${b.totalCopies} copies`
          : "none available",
    }))
  );
}
