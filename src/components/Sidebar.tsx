"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

/** Static icon set — keeps Sidebar dependency-free. */
export type SidebarIcon = "dashboard" | "catalog" | "history" | "alert" | "sparkles";

export interface NavItem {
  label: string;
  href: string;
  icon: SidebarIcon;
}

const iconPaths: Record<SidebarIcon, string> = {
  dashboard: "M3 12 12 3l9 9M5 10v10h5v-6h4v6h5V10",
  catalog:
    "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20 M9 7h6",
  history: "M3 3v5h5 M3.05 13A9 9 0 1 0 6 5.3L3 8 M12 7v5l4 2",
  alert: "M12 9v4 M12 17h.01 M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z",
  sparkles:
    "M12 3v3 M12 18v3 M3 12h3 M18 12h3 M5.6 5.6l2.2 2.2 M16.2 16.2l2.1 2.1 M18.4 5.6l-2.2 2.2 M7.8 16.2l-2.1 2.1",
};

type SidebarProps = {
  items: NavItem[];
  /** Footer content, e.g. the future account/user section. */
  footer?: React.ReactNode;
  title?: string;
};

function SidebarLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-primary-50 text-primary-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-[18px] shrink-0"
        aria-hidden="true"
      >
        <path d={iconPaths[item.icon]} />
      </svg>
      {item.label}
    </Link>
  );
}

/** Desktop sidebar navigation. Hidden below the `lg` breakpoint — pages show
 * the Navbar (with its own links) on smaller screens instead. */
export default function Sidebar({ items, footer, title }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-border-subtle bg-white lg:flex">
      <div className="flex h-16 items-center border-b border-border-subtle px-5">
        <Logo size="sm" />
      </div>

      {title && (
        <p className="px-5 pt-5 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </p>
      )}

      <nav aria-label="Primary" className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {items.map((item) => (
          <SidebarLink
            key={item.href}
            item={item}
            active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
          />
        ))}
      </nav>

      {footer && <div className="border-t border-border-subtle p-4">{footer}</div>}
    </aside>
  );
}
