"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";
import type { NavItem } from "@/components/Sidebar";

export type NavbarLink = NavItem;

type NavbarProps = {
  /** Links shown on small screens where the sidebar is hidden. */
  links?: NavbarLink[];
  /** Right-side action, e.g. a login button on public pages. */
  action?: React.ReactNode;
  /** Show a hamburger that toggles the mobile dropdown. */
  withMenu?: boolean;
};

/** Top navigation bar. Always visible on mobile/tablet; on desktop it is used
 * on public pages while logged-in pages switch to the Sidebar. */
export default function Navbar({ links, action, withMenu = false }: NavbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Logo size="sm" />
          {links && links.length > 0 && (
            <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          {action}
          {withMenu && links && links.length > 0 && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="navbar-mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex size-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="size-5"
                aria-hidden="true"
              >
                {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          )}
        </div>
      </div>

      {open && links && links.length > 0 && (
        <nav
          id="navbar-mobile-menu"
          aria-label="Mobile"
          className="border-t border-border-subtle bg-white px-4 py-3 lg:hidden"
        >
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
