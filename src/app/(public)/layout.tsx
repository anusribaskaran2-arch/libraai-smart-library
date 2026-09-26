import Navbar from "@/components/Navbar";

/** Public pages (landing) share the top-navbar shell. */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar
        links={[
          { label: "Capabilities", href: "/#capabilities", icon: "sparkles" },
        ]}
        action={
          <a
            href="/login"
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
          >
            Log in
          </a>
        }
      />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border-subtle bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:px-6">
          <p>LibraAI — Smart Library Management, powered by AI</p>
          <p>Built for a college hackathon</p>
        </div>
      </footer>
    </div>
  );
}
