import type { Fiche } from "@/lib/generated/prisma/client";
import {
  BESOIN_SUPPORT_KEYS,
  BESOIN_SUPPORT_LABELS,
  CAUSE_KEYS,
  CAUSE_LABELS,
  STATUT_GLOBAL,
  TYPE_PROJET_LABELS,
  type BesoinSupportItem,
  type Causes,
  type Phase,
  type RisqueItem,
  type StatutGlobal,
  type TypeProjet,
} from "@/lib/validations/fiche";

// ---------------------------------------------------------------------------
// Transformation Fiche (Prisma) -> FicheStat (données planes, sérialisables)
// ---------------------------------------------------------------------------

export type FicheStat = {
  id: string;
  projet: string;
  client: string;
  responsablePilotage: string;
  typeProjet: TypeProjet;
  phaseActuelle: Phase;
  statutGlobal: StatutGlobal;
  dateMiseAJour: string;
  causes: Causes;
  ecartMargePct: number | null;
  ecartPlanningJours: number | null;
  chargeReevalueePct: number | null;
  avancementPct: number | null;
  besoinsSupport: BesoinSupportItem[];
  risques: RisqueItem[];
};

export function ficheToStat(fiche: Fiche): FicheStat {
  return {
    id: fiche.id,
    projet: fiche.projet,
    client: fiche.client,
    responsablePilotage: fiche.responsablePilotage,
    typeProjet: fiche.typeProjet,
    phaseActuelle: fiche.phaseActuelle,
    statutGlobal: fiche.statutGlobal,
    dateMiseAJour: fiche.dateMiseAJour.toISOString().slice(0, 10),
    causes: fiche.causes as Causes,
    ecartMargePct: fiche.ecartMargePct,
    ecartPlanningJours: fiche.ecartPlanningJours,
    chargeReevalueePct: fiche.chargeReevalueePct,
    avancementPct: fiche.avancementPct,
    besoinsSupport: fiche.besoinsSupport as BesoinSupportItem[],
    risques: fiche.risques as RisqueItem[],
  };
}

// ---------------------------------------------------------------------------
// Causes : 6 clés nommées + "autre" (catch-all)
// ---------------------------------------------------------------------------

export const ALL_CAUSE_KEYS = [...CAUSE_KEYS, "autre"] as const;
export type AllCauseKey = (typeof ALL_CAUSE_KEYS)[number];
export const ALL_CAUSE_LABELS: Record<AllCauseKey, string> = {
  ...CAUSE_LABELS,
  autre: "Autre",
};

function hasCause(causes: Causes | null | undefined, key: AllCauseKey): boolean {
  if (!causes) return false;
  return causes[key] === true;
}

// ---------------------------------------------------------------------------
// Filtres
// ---------------------------------------------------------------------------

export type StatistiquesFilters = {
  client: string;
  responsable: string;
  typeProjet: string;
  phase: string;
  statut: string;
  projet: string;
  periode: string;
};

export const DEFAULT_FILTERS: StatistiquesFilters = {
  client: "all",
  responsable: "all",
  typeProjet: "all",
  phase: "all",
  statut: "all",
  projet: "all",
  periode: "all",
};

export function applyFilters(
  fiches: FicheStat[],
  filters: StatistiquesFilters,
): FicheStat[] {
  return fiches.filter(
    (f) =>
      (filters.client === "all" || f.client === filters.client) &&
      (filters.responsable === "all" || f.responsablePilotage === filters.responsable) &&
      (filters.typeProjet === "all" || f.typeProjet === filters.typeProjet) &&
      (filters.phase === "all" || f.phaseActuelle === filters.phase) &&
      (filters.statut === "all" || f.statutGlobal === filters.statut) &&
      (filters.projet === "all" || f.projet === filters.projet) &&
      (filters.periode === "all" || monthKey(f.dateMiseAJour) === filters.periode),
  );
}

// ---------------------------------------------------------------------------
// Bucketing mensuel
// ---------------------------------------------------------------------------

export function monthKey(dateIso: string): string {
  return dateIso.slice(0, 7);
}

const MONTH_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
  month: "short",
  year: "numeric",
});

export function monthLabel(key: string): string {
  const [year, month] = key.split("-").map(Number);
  return MONTH_FORMATTER.format(new Date(year, month - 1, 1));
}

export function sortedMonthKeys(fiches: FicheStat[]): string[] {
  return Array.from(new Set(fiches.map((f) => monthKey(f.dateMiseAJour)))).sort();
}

// ---------------------------------------------------------------------------
// Couleurs (alignées sur la palette --chart-1..5 de globals.css)
// ---------------------------------------------------------------------------

export const STATUT_COLORS: Record<StatutGlobal, string> = {
  OK: "var(--color-chart-2)",
  SOUS_CONTROLE: "var(--color-chart-3)",
  WARNING: "var(--color-chart-5)",
  CRITIQUE: "var(--color-chart-1)",
};

export const CHART_PALETTE = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

// Palette étendue (7 teintes) pour les séries "causes" et "besoins de support"
export const EXTENDED_PALETTE = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
  "#8B5CF6",
  "#0EA5E9",
];

// ---------------------------------------------------------------------------
// Seuil "hors seuil" (section 3)
// ---------------------------------------------------------------------------

export const SEUIL_ECART_MARGE = -5;
export const SEUIL_ECART_PLANNING = 5;

export function isHorsSeuil(f: FicheStat): boolean {
  const margeHorsSeuil = f.ecartMargePct !== null && f.ecartMargePct < SEUIL_ECART_MARGE;
  const planningHorsSeuil =
    f.ecartPlanningJours !== null && f.ecartPlanningJours > SEUIL_ECART_PLANNING;
  return margeHorsSeuil || planningHorsSeuil;
}

// ---------------------------------------------------------------------------
// Helpers numériques
// ---------------------------------------------------------------------------

function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function pct(count: number, total: number): number {
  return total === 0 ? 0 : Math.round((count / total) * 1000) / 10;
}

function nonNull(values: (number | null)[]): number[] {
  return values.filter((v): v is number => v !== null);
}

// ---------------------------------------------------------------------------
// KPI globaux (Cartes KPI)
// ---------------------------------------------------------------------------

export type GlobalKpis = {
  total: number;
  pctVerts: number;
  pctAlerte: number;
  ecartMargeMoyen: number | null;
  ecartPlanningMoyen: number | null;
  nbDemandesSupport: number;
  causeNo1: string;
  avancementMoyen: number | null;
};

export function computeGlobalKpis(fiches: FicheStat[]): GlobalKpis {
  const total = fiches.length;
  const ok = fiches.filter((f) => f.statutGlobal === "OK").length;
  const alerte = fiches.filter(
    (f) => f.statutGlobal === "WARNING" || f.statutGlobal === "CRITIQUE",
  ).length;

  const causeCounts = computeCauseCounts(fiches);
  const topCause = causeCounts.find((c) => c.count > 0);

  return {
    total,
    pctVerts: pct(ok, total),
    pctAlerte: pct(alerte, total),
    ecartMargeMoyen: average(nonNull(fiches.map((f) => f.ecartMargePct))),
    ecartPlanningMoyen: average(nonNull(fiches.map((f) => f.ecartPlanningJours))),
    nbDemandesSupport: countSupportDemandes(fiches),
    causeNo1: topCause ? topCause.label : "—",
    avancementMoyen: average(nonNull(fiches.map((f) => f.avancementPct))),
  };
}

function countSupportDemandes(fiches: FicheStat[]): number {
  return fiches.reduce(
    (sum, f) => sum + f.besoinsSupport.filter((b) => b.applicable).length,
    0,
  );
}

function countRisquesActifs(fiches: FicheStat[]): number {
  return fiches.reduce(
    (sum, f) =>
      sum + f.risques.filter((r) => r.description && r.description.trim() !== "").length,
    0,
  );
}

// ---------------------------------------------------------------------------
// Formatage
// ---------------------------------------------------------------------------

export function formatPct(value: number | null, decimals = 1): string {
  if (value === null) return "—";
  return `${value.toFixed(decimals)} %`;
}

export function formatSignedPct(value: number | null, decimals = 1): string {
  if (value === null) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)} %`;
}

export function formatSignedDays(value: number | null, decimals = 1): string {
  if (value === null) return "—";
  const sign = value > 0 ? "+" : "";
  const rounded = Number(value.toFixed(decimals));
  return `${sign}${rounded} j`;
}

// ---------------------------------------------------------------------------
// Options de filtres (dérivées du jeu de données non filtré)
// ---------------------------------------------------------------------------

export type FilterOptions = {
  clients: string[];
  responsables: string[];
  projets: string[];
  periodes: { key: string; label: string }[];
};

export function computeFilterOptions(fiches: FicheStat[]): FilterOptions {
  return {
    clients: Array.from(new Set(fiches.map((f) => f.client))).sort(),
    responsables: Array.from(new Set(fiches.map((f) => f.responsablePilotage))).sort(),
    projets: Array.from(new Set(fiches.map((f) => f.projet))).sort(),
    periodes: sortedMonthKeys(fiches)
      .slice()
      .reverse()
      .map((key) => ({ key, label: monthLabel(key) })),
  };
}

// ---------------------------------------------------------------------------
// Section 1 : État de santé du portefeuille
// ---------------------------------------------------------------------------

export type StatutCount = { statut: StatutGlobal; label: string; count: number; pct: number };

export function computeStatutCounts(fiches: FicheStat[]): StatutCount[] {
  const total = fiches.length;
  return STATUT_GLOBAL.map((statut) => {
    const count = fiches.filter((f) => f.statutGlobal === statut).length;
    return { statut, label: statut, count, pct: pct(count, total) };
  });
}

export type MonthlyStatutPoint = { month: string; label: string } & Record<
  StatutGlobal,
  number
>;

export function computeMonthlyStatuts(fiches: FicheStat[]): MonthlyStatutPoint[] {
  return sortedMonthKeys(fiches).map((month) => {
    const inMonth = fiches.filter((f) => monthKey(f.dateMiseAJour) === month);
    const point = { month, label: monthLabel(month) } as MonthlyStatutPoint;
    for (const statut of STATUT_GLOBAL) {
      point[statut] = inMonth.filter((f) => f.statutGlobal === statut).length;
    }
    return point;
  });
}

// ---------------------------------------------------------------------------
// Section 2 : Causes principales des dérives
// ---------------------------------------------------------------------------

export type CauseCount = { key: AllCauseKey; label: string; count: number; pct: number };

export function computeCauseCounts(fiches: FicheStat[]): CauseCount[] {
  const total = fiches.length;
  return ALL_CAUSE_KEYS.map((key) => {
    const count = fiches.filter((f) => hasCause(f.causes, key)).length;
    return { key, label: ALL_CAUSE_LABELS[key], count, pct: pct(count, total) };
  }).sort((a, b) => b.count - a.count);
}

export type HeatmapData = {
  rows: { key: AllCauseKey; label: string }[];
  cols: { key: string; label: string }[];
  matrix: number[][];
  max: number;
};

export function computeCauseHeatmap(
  fiches: FicheStat[],
  dimension: "client" | "typeProjet",
): HeatmapData {
  const colKeys = Array.from(
    new Set(fiches.map((f) => (dimension === "client" ? f.client : f.typeProjet))),
  ).sort();

  const cols = colKeys.map((key) => ({
    key,
    label: dimension === "typeProjet" ? TYPE_PROJET_LABELS[key as TypeProjet] : key,
  }));

  const matrix = ALL_CAUSE_KEYS.map((causeKey) =>
    colKeys.map(
      (colKey) =>
        fiches.filter(
          (f) =>
            (dimension === "client" ? f.client : f.typeProjet) === colKey &&
            hasCause(f.causes, causeKey),
        ).length,
    ),
  );

  const max = Math.max(0, ...matrix.flat());

  return {
    rows: ALL_CAUSE_KEYS.map((key) => ({ key, label: ALL_CAUSE_LABELS[key] })),
    cols,
    matrix,
    max,
  };
}

export type MonthlyCausePoint = { month: string; label: string } & Record<
  AllCauseKey,
  number
>;

export function computeMonthlyCauses(fiches: FicheStat[]): MonthlyCausePoint[] {
  return sortedMonthKeys(fiches).map((month) => {
    const inMonth = fiches.filter((f) => monthKey(f.dateMiseAJour) === month);
    const point = { month, label: monthLabel(month) } as MonthlyCausePoint;
    for (const key of ALL_CAUSE_KEYS) {
      point[key] = inMonth.filter((f) => hasCause(f.causes, key)).length;
    }
    return point;
  });
}

// ---------------------------------------------------------------------------
// Section 3 : Indicateurs de performance projet
// ---------------------------------------------------------------------------

export type PerformanceKpis = {
  ecartMargeMoyen: number | null;
  ecartPlanningMoyen: number | null;
  chargeReevalueeMoyenne: number | null;
  avancementMoyen: number | null;
  nbHorsSeuil: number;
};

export function computePerformanceKpis(fiches: FicheStat[]): PerformanceKpis {
  return {
    ecartMargeMoyen: average(nonNull(fiches.map((f) => f.ecartMargePct))),
    ecartPlanningMoyen: average(nonNull(fiches.map((f) => f.ecartPlanningJours))),
    chargeReevalueeMoyenne: average(nonNull(fiches.map((f) => f.chargeReevalueePct))),
    avancementMoyen: average(nonNull(fiches.map((f) => f.avancementPct))),
    nbHorsSeuil: fiches.filter(isHorsSeuil).length,
  };
}

export type MonthlyAveragePoint = {
  month: string;
  label: string;
  ecartMargeMoyen: number | null;
  ecartPlanningMoyen: number | null;
  avancementMoyen: number | null;
};

export function computeMonthlyAverages(fiches: FicheStat[]): MonthlyAveragePoint[] {
  return sortedMonthKeys(fiches).map((month) => {
    const inMonth = fiches.filter((f) => monthKey(f.dateMiseAJour) === month);
    return {
      month,
      label: monthLabel(month),
      ecartMargeMoyen: average(nonNull(inMonth.map((f) => f.ecartMargePct))),
      ecartPlanningMoyen: average(nonNull(inMonth.map((f) => f.ecartPlanningJours))),
      avancementMoyen: average(nonNull(inMonth.map((f) => f.avancementPct))),
    };
  });
}

// ---------------------------------------------------------------------------
// Section 4 : Besoins de support
// ---------------------------------------------------------------------------

export type BesoinCount = { key: string; label: string; count: number; pct: number };

export function computeBesoinCounts(fiches: FicheStat[]): BesoinCount[] {
  const total = fiches.length;
  const counts = new Map<string, number>();
  for (const f of fiches) {
    for (const b of f.besoinsSupport) {
      if (b.applicable) counts.set(b.besoin, (counts.get(b.besoin) ?? 0) + 1);
    }
  }
  return BESOIN_SUPPORT_KEYS.map((key) => {
    const count = counts.get(key) ?? 0;
    return { key, label: BESOIN_SUPPORT_LABELS[key], count, pct: pct(count, total) };
  }).sort((a, b) => b.count - a.count);
}

export type ClientCount = { client: string; count: number };

export function computeBesoinsByClient(fiches: FicheStat[]): ClientCount[] {
  const map = new Map<string, number>();
  for (const f of fiches) {
    const count = f.besoinsSupport.filter((b) => b.applicable).length;
    if (count > 0) map.set(f.client, (map.get(f.client) ?? 0) + count);
  }
  return Array.from(map.entries())
    .map(([client, count]) => ({ client, count }))
    .sort((a, b) => b.count - a.count);
}

export type BesoinKpis = {
  nbDemandes: number;
  pctProjetsAvecSupport: number;
  besoinLePlusFrequent: string;
};

export function computeBesoinKpis(fiches: FicheStat[]): BesoinKpis {
  const total = fiches.length;
  const nbDemandes = countSupportDemandes(fiches);
  const projetsAvecSupport = fiches.filter((f) =>
    f.besoinsSupport.some((b) => b.applicable),
  ).length;
  const counts = computeBesoinCounts(fiches);
  const top = counts.find((c) => c.count > 0);
  return {
    nbDemandes,
    pctProjetsAvecSupport: pct(projetsAvecSupport, total),
    besoinLePlusFrequent: top ? top.label : "—",
  };
}

export type MonthlyBesoinPoint = { month: string; label: string } & Record<string, number | string>;

export function computeMonthlyBesoins(fiches: FicheStat[]): MonthlyBesoinPoint[] {
  return sortedMonthKeys(fiches).map((month) => {
    const inMonth = fiches.filter((f) => monthKey(f.dateMiseAJour) === month);
    const point: MonthlyBesoinPoint = { month, label: monthLabel(month) };
    for (const key of BESOIN_SUPPORT_KEYS) {
      point[key] = inMonth.reduce(
        (sum, f) => sum + f.besoinsSupport.filter((b) => b.besoin === key && b.applicable).length,
        0,
      );
    }
    return point;
  });
}

// ---------------------------------------------------------------------------
// Section 5 : Évolution du portefeuille
// ---------------------------------------------------------------------------

export type PortfolioEvolutionSummary = {
  hasComparison: boolean;
  moisActuelLabel: string | null;
  moisPrecedentLabel: string | null;
  nouveauxEnAlerte: number;
  revenusAuVert: number;
  variationRisques: number;
  variationDemandesSupport: number;
};

function isAlerte(f: FicheStat): boolean {
  return f.statutGlobal === "WARNING" || f.statutGlobal === "CRITIQUE";
}

export function computePortfolioEvolution(fiches: FicheStat[]): PortfolioEvolutionSummary {
  const months = sortedMonthKeys(fiches);
  if (months.length < 2) {
    return {
      hasComparison: false,
      moisActuelLabel: months[0] ? monthLabel(months[0]) : null,
      moisPrecedentLabel: null,
      nouveauxEnAlerte: 0,
      revenusAuVert: 0,
      variationRisques: 0,
      variationDemandesSupport: 0,
    };
  }

  const moisActuel = months[months.length - 1];
  const moisPrecedent = months[months.length - 2];
  const actuel = fiches.filter((f) => monthKey(f.dateMiseAJour) === moisActuel);
  const precedent = fiches.filter((f) => monthKey(f.dateMiseAJour) === moisPrecedent);
  const precedentParProjet = new Map(precedent.map((f) => [f.projet, f]));

  let nouveauxEnAlerte = 0;
  let revenusAuVert = 0;
  for (const f of actuel) {
    const prev = precedentParProjet.get(f.projet);
    if (!prev) continue;
    if (isAlerte(f) && !isAlerte(prev)) nouveauxEnAlerte++;
    if (f.statutGlobal === "OK" && prev.statutGlobal !== "OK") revenusAuVert++;
  }

  return {
    hasComparison: true,
    moisActuelLabel: monthLabel(moisActuel),
    moisPrecedentLabel: monthLabel(moisPrecedent),
    nouveauxEnAlerte,
    revenusAuVert,
    variationRisques: countRisquesActifs(actuel) - countRisquesActifs(precedent),
    variationDemandesSupport: countSupportDemandes(actuel) - countSupportDemandes(precedent),
  };
}

export type MonthlyPortfolioPoint = {
  month: string;
  label: string;
  nbRouges: number;
  nbCritiques: number;
  ecartMargeMoyen: number | null;
  ecartPlanningMoyen: number | null;
  nbDemandesSupport: number;
};

export function computeMonthlyPortfolio(fiches: FicheStat[]): MonthlyPortfolioPoint[] {
  return sortedMonthKeys(fiches).map((month) => {
    const inMonth = fiches.filter((f) => monthKey(f.dateMiseAJour) === month);
    return {
      month,
      label: monthLabel(month),
      nbRouges: inMonth.filter((f) => f.statutGlobal === "WARNING").length,
      nbCritiques: inMonth.filter((f) => f.statutGlobal === "CRITIQUE").length,
      ecartMargeMoyen: average(nonNull(inMonth.map((f) => f.ecartMargePct))),
      ecartPlanningMoyen: average(nonNull(inMonth.map((f) => f.ecartPlanningJours))),
      nbDemandesSupport: countSupportDemandes(inMonth),
    };
  });
}
