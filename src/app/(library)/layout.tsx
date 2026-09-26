"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { STUDENT_NAV_ITEMS, ADMIN_NAV_ITEMS } from "@/lib/nav";

/** Shared shell for logged-in pages. Role-based selection arrives with Supabase Auth. */
export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  const items = [...STUDENT_NAV_ITEMS, ...ADMIN_NAV_ITEMS];

  return (
    <div className="flex min-h-dvh">
      <Sidebar items={items} title="LibraAI" />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          links={items}
          withMenu
          action={
            <button
              type="button"
              disabled
              title="Sign-in arrives in the auth phase"
              className="rounded-lg border border-border-subtle bg-white px-3 py-1.5 text-xs font-medium text-slate-400"
            >
              Account
            </button>
          }
        />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
