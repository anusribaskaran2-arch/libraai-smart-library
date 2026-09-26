"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type LoginFormProps = {
  /** Future hook point for Supabase Auth in the auth phase. */
  onSubmit?: (credentials: { email: string; password: string }) => void | Promise<void>;
};

/** Phase 1: validation-ready login form shell. No authentication is wired up
 * yet — submit shows a neutral "not connected" notice instead of pretending. */
export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [notice, setNotice] = useState<string | null>(null);

  function validate(): boolean {
    const next: typeof errors = {};

    if (!email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Enter a valid email address.";
    }

    if (!password) {
      next.password = "Password is required.";
    } else if (password.length < 8) {
      next.password = "Password must be at least 8 characters.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNotice(null);

    if (!validate()) return;

    if (onSubmit) {
      void onSubmit({ email: email.trim(), password });
      return;
    }

    // Honest placeholder until Supabase Auth is connected in the auth phase.
    setNotice("Login is not connected yet — authentication arrives in the next phase.");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          placeholder="you@college.edu"
          className={`mt-1.5 block w-full rounded-lg border px-3 py-2.5 text-sm shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:ring-2 ${
            errors.email
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : "border-border-subtle focus:border-primary-400 focus:ring-primary-100"
          }`}
        />
        {errors.email && (
          <p id="email-error" className="mt-1.5 text-xs text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? "password-error" : undefined}
          placeholder="••••••••"
          className={`mt-1.5 block w-full rounded-lg border px-3 py-2.5 text-sm shadow-sm outline-none transition-colors placeholder:text-slate-400 focus:ring-2 ${
            errors.password
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : "border-border-subtle focus:border-primary-400 focus:ring-primary-100"
          }`}
        />
        {errors.password && (
          <p id="password-error" className="mt-1.5 text-xs text-red-600">
            {errors.password}
          </p>
        )}
      </div>

      {notice && (
        <p
          role="status"
          className="rounded-lg bg-primary-50 px-3 py-2.5 text-xs text-primary-700"
        >
          {notice}
        </p>
      )}

      <button
        type="submit"
        className="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:ring-offset-2"
      >
        Log in
      </button>
    </form>
  );
}
