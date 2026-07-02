import type { FicheStatut } from "@/lib/generated/prisma/client";

export const FICHE_STATUT_LABELS: Record<FicheStatut, string> = {
  A_COMPLETER: "À compléter",
  SOUMISE: "Soumise",
};
