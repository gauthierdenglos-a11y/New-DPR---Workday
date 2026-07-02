import Link from "next/link";
import { Bell, HelpCircle, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-8">
        <Link href="/fiches" className="text-lg font-semibold text-foreground">
          ProjetCommand
        </Link>
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
