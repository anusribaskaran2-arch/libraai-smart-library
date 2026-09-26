import type { NavItem } from "@/components/Sidebar";

/** Static navigation definitions. Role-based selection is wired up in the
 * auth phase — both lists are defined here so that only wiring remains. */

export const STUDENT_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Catalog", href: "/catalog", icon: "catalog" },
  { label: "History", href: "/history", icon: "history" },
  { label: "Ask LibraAI", href: "/assistant", icon: "sparkles" },
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Books", href: "/admin/books", icon: "catalog" },
  { label: "Borrowing Records", href: "/admin/records", icon: "history" },
  { label: "Overdue", href: "/admin/overdue", icon: "alert" },
];
