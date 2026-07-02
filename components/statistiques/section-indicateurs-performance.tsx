"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyDataHint } from "@/components/statistiques/monthly-data-hint";
import {
  SEUIL_ECART_MARGE,
  SEUIL_ECART_PLANNING,
  computeMonthlyAverages,
  computePerformanceKpis,
  formatPct,
  formatSignedDays,
  formatSignedPct,
  type FicheStat,
} from "@/lib/statistiques-utils";

function EcartBarChart({
  fiches,
  accessor,
  unit,
  emptyLabel,
}: {
  fiches: FicheStat[];
  accessor: (f: FicheStat) => number | null;
  unit: string;
  emptyLabel: string;
}) {
  const data = fiches
    .map((f) => ({ projet: f.projet, value: accessor(f) }))
    .filter((d): d is { projet: string; value: number } => d.value !== null)
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="projet" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={50} />
          <YAxis tick={{ fontSize: 12 }} unit={unit} />
          <Tooltip formatter={(value) => `${value} ${unit}`} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((d) => (
              <Cell
                key={d.projet}
                fill={d.value < 0 ? "var(--color-chart-5)" : "var(--color-chart-2)"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SectionIndicateursPerformance({ fiches }: { fiches: FicheStat[] }) {
  const kpis = computePerformanceKpis(fiches);
  const monthlyAverages = computeMonthlyAverages(fiches);

  const scatterData = fiches
    .filter((f) => f.avancementPct !== null && f.ecartMargePct !== null)
    .map((f) => ({
      projet: f.projet,
      avancement: f.avancementPct as number,
      ecartMarge: f.ecartMargePct as number,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>3. Indicateurs de performance projet</CardTitle>
        <CardDescription>Quels sont les écarts observés sur le portefeuille ?</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground">Écart marge moyen</p>
            <p className="text-lg font-semibold text-foreground">
              {formatSignedPct(kpis.ecartMargeMoyen)}
            </p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground">Écart planning moyen</p>
            <p className="text-lg font-semibold text-foreground">
              {formatSignedDays(kpis.ecartPlanningMoyen)}
            </p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground">Charge moyenne supplémentaire</p>
            <p className="text-lg font-semibold text-foreground">
              {formatPct(kpis.chargeReevalueeMoyenne)}
            </p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground">Avancement moyen</p>
            <p className="text-lg font-semibold text-foreground">
              {formatPct(kpis.avancementMoyen)}
            </p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground">Projets hors seuil</p>
            <p className="text-lg font-semibold text-foreground">{kpis.nbHorsSeuil}</p>
            <p className="text-[11px] text-muted-foreground">
              marge &lt; {SEUIL_ECART_MARGE} % ou planning &gt; +{SEUIL_ECART_PLANNING} j
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">Écart marge par projet</h3>
            <EcartBarChart
              fiches={fiches}
              accessor={(f) => f.ecartMargePct}
              unit="%"
              emptyLabel="Aucun écart marge renseigné."
            />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">
              Écart planning par projet
            </h3>
            <EcartBarChart
              fiches={fiches}
              accessor={(f) => f.ecartPlanningJours}
              unit="j"
              emptyLabel="Aucun écart planning renseigné."
            />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">
              Charge réévaluée par projet
            </h3>
            <EcartBarChart
              fiches={fiches}
              accessor={(f) => f.chargeReevalueePct}
              unit="%"
              emptyLabel="Aucune charge réévaluée renseignée."
            />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">Avancement par projet</h3>
            <EcartBarChart
              fiches={fiches}
              accessor={(f) => f.avancementPct}
              unit="%"
              emptyLabel="Aucun avancement renseigné."
            />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">
              Avancement vs Écart marge
            </h3>
            {scatterData.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Données insuffisantes pour ce graphique.
              </p>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ left: 8, right: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis
                      type="number"
                      dataKey="avancement"
                      name="Avancement"
                      unit="%"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      type="number"
                      dataKey="ecartMarge"
                      name="Écart marge"
                      unit="%"
                      tick={{ fontSize: 12 }}
                    />
                    <ZAxis range={[80, 80]} />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      formatter={(value, name) => [`${value} %`, name]}
                      labelFormatter={() => ""}
                    />
                    <Scatter data={scatterData} fill="var(--color-chart-1)" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">
              Moyennes mensuelles (marge / planning / avancement)
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyAverages}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="pct" tick={{ fontSize: 12 }} unit="%" />
                  <YAxis yAxisId="jours" orientation="right" tick={{ fontSize: 12 }} unit="j" />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Line
                    yAxisId="pct"
                    type="monotone"
                    dataKey="ecartMargeMoyen"
                    name="Écart marge moyen"
                    stroke="var(--color-chart-5)"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="pct"
                    type="monotone"
                    dataKey="avancementMoyen"
                    name="Avancement moyen"
                    stroke="var(--color-chart-2)"
                    strokeWidth={2}
                  />
                  <Line
                    yAxisId="jours"
                    type="monotone"
                    dataKey="ecartPlanningMoyen"
                    name="Écart planning moyen"
                    stroke="var(--color-chart-3)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <MonthlyDataHint monthCount={monthlyAverages.length} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
