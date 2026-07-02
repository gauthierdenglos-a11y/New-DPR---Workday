import { cn } from "@/lib/utils";
import { FICHE_STATUT_LABELS } from "@/lib/fiche-statut";
import type { FicheStatut } from "@/lib/generated/prisma/client";

const FICHE_STATUT_CLASSES: Record<FicheStatut, string> = {
  A_COMPLETER: "border-amber-200 bg-amber-50 text-amber-700",
  SOUMISE: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export function FicheStatutBadge({ value }: { value: FicheStatut }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        FICHE_STATUT_CLASSES[value],
      )}
    >
      {FICHE_STATUT_LABELS[value]}
    </span>
  );
}
