import type { Metadata } from "next";
import { EmptyIcon } from "@/components/EmptyState";

export const metadata: Metadata = {
  title: "LibraAI — Smart Library Management, powered by AI",
};

const capabilities = [
  {
    icon: "search" as const,
    title: "Smart Book Search",
    text: "Find titles by name, author, genre or level — plus an AI assistant that understands plain-language questions.",
  },
  {
    icon: "box" as const,
    title: "Real-Time Availability",
    text: "Live copy counts and shelf locations, so students always know what's on the shelf before walking to it.",
  },
  {
    icon: "book" as const,
    title: "Easy Borrow & Return",
    text: "Borrow in a click and return with the same ease — availability updates instantly for everyone.",
  },
  {
    icon: "clock" as const,
    title: "Borrowing History",
    text: "Every borrow, return and due date in one place, with clear active, returned and overdue statuses.",
  },
  {
    icon: "sparkles" as const,
    title: "AI Library Assistant",
    text: "Ask things like “Which AI books are available for beginners?” and get answers grounded in the real catalog.",
  },
] satisfies ReadonlyArray<{
  icon: "search" | "box" | "book" | "clock" | "sparkles";
  title: string;
  text: string;
}>;

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary-50 via-white to-white"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 text-center sm:px-6 sm:pb-24 sm:pt-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-3 py-1 text-xs font-medium text-primary-700 shadow-sm">
            <span className="size-1.5 rounded-full bg-primary-500" aria-hidden="true" />
            College hackathon project
          </span>

          <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Smart Library Management,{" "}
            <span className="text-primary-600">powered by AI</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600 sm:text-lg">
            LibraAI gives your college library a modern catalog with real-time availability,
            effortless borrowing, and an AI assistant that answers natural-language questions —
            grounded strictly in the library&apos;s real collection.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/login"
              className="w-full rounded-lg bg-primary-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 sm:w-auto"
            >
              Log in to LibraAI
            </a>
            <a
              href="#capabilities"
              className="w-full rounded-lg border border-border-subtle bg-white px-6 py-3 text-center text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 sm:w-auto"
            >
              Explore capabilities
            </a>            </div>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border-subtle bg-white p-8 shadow-sm">
            <div className="flex size-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-6"
                aria-hidden="true"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold text-slate-900">For students</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Search the catalog, see what&apos;s available right now, borrow and return books, and keep
              track of due dates — with an AI assistant to help you find the right book faster.
            </p>            </div>

          <div className="rounded-2xl border border-border-subtle bg-white p-8 shadow-sm">
            <div className="flex size-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-6"
                aria-hidden="true"
              >
                <path d="M12 20h9 M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold text-slate-900">
              For admins &amp; librarians
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Manage the collection, track every borrowing record, monitor overdue books, and get
              clear library statistics — all from one clean dashboard.
            </p>            </div>
        </div>
      </section>

      {/* Capabilities */}
      <section id="capabilities" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <h2 className="font-display text-2xl font-semibold text-slate-900 sm:text-3xl">
            Key capabilities
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600">
            The LibraAI platform is being built around these core features.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c) => (
            <div
              key={c.title}
              className="rounded-xl border border-border-subtle bg-white p-6 shadow-sm"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <EmptyIcon kind={c.icon} />
              </div>
              <h3 className="mt-4 font-medium text-slate-900">{c.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-slate-600">{c.text}</p>
            </div>
          ))}

          {/* Sixth card balances the 3-column grid */}
          <div className="rounded-xl border border-primary-200 bg-primary-50/60 p-6">
            <h3 className="font-medium text-primary-900">Built on a modern stack</h3>
            <p className="mt-1.5 text-sm leading-6 text-primary-700/90">
              Next.js, TypeScript, Tailwind CSS, Supabase with Row Level Security, and the Groq API
              for fast AI responses.
            </p>
            <p className="mt-3 text-xs text-primary-600/80">
              Features are delivered phase-by-phase as the project develops.
            </p>
          </  div>
        </div>
      </section>
    </>
  );
}
