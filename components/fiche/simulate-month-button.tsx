"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { CalendarClock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { simulerMoisSuivant } from "@/lib/actions/cycle";

export function SimulateMonthButton() {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      try {
        const { periodeLabel, resultats } = await simulerMoisSuivant();

        if (resultats.length === 0) {
          toast.info(`Rien à générer pour ${periodeLabel} : aucun projet en attente.`);
          return;
        }

        const notifiees = resultats.filter((r) => r.email.sent).length;
        const previewUrl = resultats.find((r) => r.email.previewUrl)?.email.previewUrl;

        toast.success(
          `Clôture simulée pour ${periodeLabel} : ${resultats.length} fiche(s) générée(s), ${notifiees} email(s) envoyé(s) à g.denglos@groupeonepoint.com.`,
          previewUrl
            ? {
                action: {
                  label: "Voir l'email",
                  onClick: () => window.open(previewUrl, "_blank"),
                },
              }
            : undefined,
        );
      } catch (error) {
        const message =
          error instanceof Error && error.message
            ? error.message
            : "Échec de la simulation de clôture mensuelle.";
        toast.error(message);
      }
    });
  };

  return (
    <Button variant="outline" onClick={handleClick} disabled={isPending}>
      <CalendarClock />
      {isPending ? "Simulation en cours..." : "Simuler mois suivant"}
    </Button>
  );
}
