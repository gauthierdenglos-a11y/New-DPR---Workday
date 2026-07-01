import Link from "next/link";
import { Bell, HelpCircle, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/fiches", label: "Projets" },
  { href: "/rapports", label: "Rapports" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-8">
        <Link href="/fiches" className="text-lg font-semibold text-foreground">
          ProjetCommand
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Aide">
          <HelpCircle />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Paramètres">
          <Settings />
        </Button>
        <Button nativeButton={false} render={<Link href="/fiches/nouveau" />}>
          <Plus />
          Nouveau Projet
        </Button>
        <div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          GD
        </div>
      </div>
    </header>
  );
}
