"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { setSession } from "@/lib/actions/session";
import type { Role } from "@/lib/session";

// Sélecteur temporaire (avant SSO) pour simuler le rôle avec lequel parcourir
// l'application : administrateur (accès à tout) ou utilisateur standard
// (accès limité à son propre projet, via son email).
export function RoleSwitcher({
  role,
  email,
  emails,
}: {
  role: Role;
  email: string;
  emails: string[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState<Role>(role);
  const [pendingEmail, setPendingEmail] = useState(email || emails[0] || "");
  const [isPending, startTransition] = useTransition();

  const apply = () => {
    startTransition(async () => {
      await setSession(pendingRole, pendingRole === "UTILISATEUR" ? pendingEmail : "");
      setOpen(false);
      router.refresh();
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) {
          setPendingRole(role);
          setPendingEmail(email || emails[0] || "");
        }
      }}
    >
      <DialogTrigger render={<Button variant="outline" size="sm" className="gap-2" />}>
        {role === "ADMIN" ? (
          <ShieldCheck className="size-4" />
        ) : (
          <UserRound className="size-4" />
        )}
        <span className="hidden max-w-40 truncate sm:inline">
          {role === "ADMIN" ? "Administrateur" : email || "Utilisateur"}
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mode de test — rôle courant</DialogTitle>
          <DialogDescription>
            En attendant le SSO, choisissez ici le rôle et l&apos;identité avec
            lesquels parcourir l&apos;application.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Rôle</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={pendingRole === "ADMIN" ? "default" : "outline"}
                className={cn("justify-center")}
                onClick={() => setPendingRole("ADMIN")}
              >
                <ShieldCheck />
                Administrateur
              </Button>
              <Button
                type="button"
                variant={pendingRole === "UTILISATEUR" ? "default" : "outline"}
                className={cn("justify-center")}
                onClick={() => setPendingRole("UTILISATEUR")}
              >
                <UserRound />
                Utilisateur
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingRole === "ADMIN"
                ? "Accès à toutes les fiches projets et aux statistiques du portefeuille."
                : "Accès limité aux fiches du projet dont l'email responsable correspond."}
            </p>
          </div>

          {pendingRole === "UTILISATEUR" && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-muted-foreground">Se connecter en tant que</Label>
              {emails.length > 0 ? (
                <Select value={pendingEmail} onValueChange={(v) => setPendingEmail(v ?? "")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choisir un email" />
                  </SelectTrigger>
                  <SelectContent>
                    {emails.map((e) => (
                      <SelectItem key={e} value={e}>
                        {e}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Aucun responsable pilotage en base pour le moment.
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            onClick={apply}
            disabled={isPending || (pendingRole === "UTILISATEUR" && !pendingEmail)}
          >
            Appliquer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
