import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  formatPct,
  formatSignedDays,
  formatSignedPct,
  type GlobalKpis,
} from "@/lib/statistiques-utils";

type KpiCardsProps = {
  kpis: GlobalKpis;
};

export function KpiCards({ kpis }: KpiCardsProps) {
  const cards = [
    { label: "Nombre de projets", value: String(kpis.total) },
    {
      label: "% de projets verts",
      value: formatPct(kpis.pctVerts),
      tone: "text-emerald-600",
    },
    {
      label: "% de projets en alerte (🔴 + ⚫)",
      value: formatPct(kpis.pctAlerte),
      tone: kpis.pctAlerte > 0 ? "text-red-600" : undefined,
    },
    {
      label: "Écart marge moyen",
      value: formatSignedPct(kpis.ecartMargeMoyen),
      tone: (kpis.ecartMargeMoyen ?? 0) < 0 ? "text-red-600" : "text-emerald-600",
    },
    {
      label: "Écart planning moyen",
      value: formatSignedDays(kpis.ecartPlanningMoyen),
      tone: (kpis.ecartPlanningMoyen ?? 0) > 0 ? "text-red-600" : "text-emerald-600",
    },
    { label: "Nombre de demandes de support", value: String(kpis.nbDemandesSupport) },
    { label: "Cause de dérive n°1", value: kpis.causeNo1 },
    { label: "Avancement moyen du portefeuille", value: formatPct(kpis.avancementMoyen) },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
      {cards.map((card) => (
        <Card key={card.label} size="sm">
          <CardContent className="flex flex-col gap-1">
            <p className="text-xs text-muted-foreground">{card.label}</p>
            <p className={cn("text-lg font-semibold text-foreground", card.tone)}>
              {card.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
