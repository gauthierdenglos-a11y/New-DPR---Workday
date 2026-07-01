"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  ListChecks,
  AlertTriangle,
  BarChart3,
  LifeBuoy,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/fiches", label: "Mes Fiches", icon: FileText },
  { href: "/plan-action", label: "Plan d'action", icon: ListChecks },
  { href: "/risques", label: "Risques", icon: AlertTriangle },
  { href: "/statistiques", label: "Statistiques", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 flex-col justify-between border-r border-border bg-card px-4 py-6 md:flex">
      <div>
        <div className="mb-6 px-2">
          <p className="text-sm font-semibold text-foreground">Project Center</p>
          <p className="text-xs text-muted-foreground">Management Dashboard</p>
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active =
              item.href === "/fiches"
                ? pathname.startsWith("/fiches")
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-secondary/10 text-secondary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-3">
        <div className="rounded-lg bg-muted p-3">
          <div className="mb-1 flex items-center gap-2 text-sm font-medium text-foreground">
            <LifeBuoy className="size-4" />
            Support
          </div>
          <p className="text-xs text-muted-foreground">
            Besoin d&apos;aide ? Contactez le Hub Tech.
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground opacity-60"
          disabled
          title="Authentification à venir"
        >
          <LogOut className="size-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
