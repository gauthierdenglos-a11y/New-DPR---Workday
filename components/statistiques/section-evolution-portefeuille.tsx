"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyDataHint } from "@/components/statistiques/monthly-data-hint";
import {
  computeMonthlyPortfolio,
  computePortfolioEvolution,
  type FicheStat,
  type MonthlyPortfolioPoint,
} from "@/lib/statistiques-utils";

function MiniLineChart({
  data,
  dataKey,
  color,
  unit,
}: {
  data: MonthlyPortfolioPoint[];
  dataKey: keyof MonthlyPortfolioPoint;
  color: string;
  unit?: string;
}) {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} unit={unit} />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SectionEvolutionPortefeuille({ fiches }: { fiches: FicheStat[] }) {
  const monthly = computeMonthlyPortfolio(fiches);
  const evolution = computePortfolioEvolution(fiches);

  return (
    <Card>
      <CardHeader>
        <CardTitle>5. Évolution du portefeuille</CardTitle>
        <CardDescription>Le portefeuille s&apos;améliore-t-il ?</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground">Nouveaux projets en alerte</p>
            <p className="text-lg font-semibold text-foreground">
              {evolution.hasComparison ? evolution.nouveauxEnAlerte : "—"}
            </p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground">Projets revenus au vert</p>
            <p className="text-lg font-semibold text-foreground">
              {evolution.hasComparison ? evolution.revenusAuVert : "—"}
            </p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground">Variation du nombre de risques</p>
            <p className="text-lg font-semibold text-foreground">
              {evolution.hasComparison
                ? `${evolution.variationRisques > 0 ? "+" : ""}${evolution.variationRisques}`
                : "—"}
            </p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground">Variation des demandes de support</p>
            <p className="text-lg font-semibold text-foreground">
              {evolution.hasComparison
                ? `${evolution.variationDemandesSupport > 0 ? "+" : ""}${evolution.variationDemandesSupport}`
                : "—"}
            </p>
          </div>
        </div>
        {evolution.hasComparison ? (
          <p className="-mt-4 text-xs text-muted-foreground">
            Comparaison {evolution.moisPrecedentLabel} → {evolution.moisActuelLabel}
          </p>
        ) : (
          <p className="-mt-4 text-xs text-muted-foreground">
            Comparaison indisponible : il faut au moins deux mois de fiches pour calculer une
            variation.
          </p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">Nombre de projets rouges</h3>
            <MiniLineChart data={monthly} dataKey="nbRouges" color="var(--color-chart-5)" />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">
              Nombre de projets critiques
            </h3>
            <MiniLineChart data={monthly} dataKey="nbCritiques" color="var(--color-chart-1)" />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">
              Évolution de la marge moyenne
            </h3>
            <MiniLineChart
              data={monthly}
              dataKey="ecartMargeMoyen"
              color="var(--color-chart-2)"
              unit="%"
            />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">
              Évolution du retard moyen
            </h3>
            <MiniLineChart
              data={monthly}
              dataKey="ecartPlanningMoyen"
              color="var(--color-chart-3)"
              unit="j"
            />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">
              Évolution du nombre de besoins de support
            </h3>
            <MiniLineChart
              data={monthly}
              dataKey="nbDemandesSupport"
              color="var(--color-chart-4)"
            />
          </div>
        </div>
        <MonthlyDataHint monthCount={monthly.length} />
      </CardContent>
    </Card>
  );
}
