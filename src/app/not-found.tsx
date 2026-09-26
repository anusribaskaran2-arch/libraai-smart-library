import Link from "next/link";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-4 text-center">
      <Logo />
      <div>
        <p className="font-display text-5xl font-bold text-primary-600">404</p>
        <h1 className="mt-2 font-display text-xl font-semibold text-slate-900">
          Page not found
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
      </div>
      <Link
        href="/"
        className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700"
      >
        Back to home
      </Link>
    </main>
  );
}
