import Link from "next/link";
import { Bell, HelpCircle, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/mobile-nav";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
      <div className="flex items-center gap-2 sm:gap-8">
        <MobileNav />
        <Link href="/fiches" className="text-lg font-semibold text-foreground">
          ProjetCommand
        </Link>
      </div>
      <div className="flex items-center gap-1 sm:gap-3">
        <Button variant="ghost" size="icon" aria-label="Notifications" className="hidden sm:inline-flex">
          <Bell />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Aide" className="hidden sm:inline-flex">
          <HelpCircle />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Paramètres" className="hidden sm:inline-flex">
          <Settings />
        </Button>
        <Button nativeButton={false} render={<Link href="/fiches/nouveau" />}>
          <Plus />
          <span className="hidden sm:inline">Nouveau Projet</span>
        </Button>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          GD
        </div>
      </div>
    </header>
  );
}
