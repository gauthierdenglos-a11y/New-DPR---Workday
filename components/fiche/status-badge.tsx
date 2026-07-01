import { cn } from "@/lib/utils";
import {
  STATUT_GLOBAL_LABELS,
  type StatutGlobal,
} from "@/lib/validations/fiche";

const STATUT_GLOBAL_CLASSES: Record<StatutGlobal, string> = {
  CRITIQUE: "border-foreground/30 bg-foreground/10 text-foreground",
  WARNING: "border-red-200 bg-red-50 text-red-700",
  SOUS_CONTROLE: "border-amber-200 bg-amber-50 text-amber-700",
  OK: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export function StatutGlobalBadge({ value }: { value: StatutGlobal }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STATUT_GLOBAL_CLASSES[value],
      )}
    >
      {STATUT_GLOBAL_LABELS[value]}
    </span>
  );
}
