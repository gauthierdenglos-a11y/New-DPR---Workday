"use client";

import { useMemo, useState } from "react";
import { FiltersBar } from "@/components/statistiques/filters-bar";
import { KpiCards } from "@/components/statistiques/kpi-cards";
import { SectionBesoinsSupport } from "@/components/statistiques/section-besoins-support";
import { SectionCausesDerives } from "@/components/statistiques/section-causes-derives";
import { SectionEvolutionPortefeuille } from "@/components/statistiques/section-evolution-portefeuille";
import { SectionIndicateursPerformance } from "@/components/statistiques/section-indicateurs-performance";
import { SectionSantePortefeuille } from "@/components/statistiques/section-sante-portefeuille";
import {
  DEFAULT_FILTERS,
  applyFilters,
  computeFilterOptions,
  computeGlobalKpis,
  type FicheStat,
  type StatistiquesFilters,
} from "@/lib/statistiques-utils";

export function StatistiquesDashboard({ fiches }: { fiches: FicheStat[] }) {
  const [filters, setFilters] = useState<StatistiquesFilters>(DEFAULT_FILTERS);
  const options = useMemo(() => computeFilterOptions(fiches), [fiches]);
  const filtered = useMemo(() => applyFilters(fiches, filters), [fiches, filters]);
  const kpis = useMemo(() => computeGlobalKpis(filtered), [filtered]);

  return (
    <div className="flex flex-col gap-6">
      <FiltersBar filters={filters} onChange={setFilters} options={options} />

      {fiches.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Aucune fiche projet en base pour le moment. Les statistiques apparaîtront dès la
          création de fiches.
        </p>
      ) : filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Aucune fiche ne correspond aux filtres sélectionnés.
        </p>
      ) : (
        <>
          <KpiCards kpis={kpis} />
          <SectionSantePortefeuille fiches={filtered} />
          <SectionCausesDerives fiches={filtered} />
          <SectionIndicateursPerformance fiches={filtered} />
          <SectionBesoinsSupport fiches={filtered} />
          <SectionEvolutionPortefeuille fiches={filtered} />
        </>
      )}
    </div>
  );
}
