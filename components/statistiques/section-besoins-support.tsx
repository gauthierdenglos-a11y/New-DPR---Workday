"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyDataHint } from "@/components/statistiques/monthly-data-hint";
import { BESOIN_SUPPORT_KEYS, BESOIN_SUPPORT_LABELS } from "@/lib/validations/fiche";
import {
  EXTENDED_PALETTE,
  computeBesoinCounts,
  computeBesoinKpis,
  computeBesoinsByClient,
  computeMonthlyBesoins,
  formatPct,
  type FicheStat,
} from "@/lib/statistiques-utils";

export function SectionBesoinsSupport({ fiches }: { fiches: FicheStat[] }) {
  const besoinCounts = computeBesoinCounts(fiches);
  const kpis = computeBesoinKpis(fiches);
  const byClient = computeBesoinsByClient(fiches);
  const monthlyBesoins = computeMonthlyBesoins(fiches);

  return (
    <Card>
      <CardHeader>
        <CardTitle>4. Besoins de support</CardTitle>
        <CardDescription>Où le Hub Tech doit-il intervenir ?</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground">Nombre de demandes</p>
            <p className="text-lg font-semibold text-foreground">{kpis.nbDemandes}</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground">% de projets demandant un support</p>
            <p className="text-lg font-semibold text-foreground">
              {formatPct(kpis.pctProjetsAvecSupport)}
            </p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-muted-foreground">Besoin le plus fréquent</p>
            <p className="text-lg font-semibold text-foreground">{kpis.besoinLePlusFrequent}</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">Histogramme des besoins</h3>
            {besoinCounts.every((b) => b.count === 0) ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Aucune donnée.</p>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={besoinCounts} layout="vertical" margin={{ left: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                    <YAxis type="category" dataKey="label" width={180} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => [`${value} demande(s)`, ""]} />
                    <Bar dataKey="count" fill="var(--color-chart-3)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">Répartition par client</h3>
            {byClient.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">Aucune donnée.</p>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byClient}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="client" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={50} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => [`${value} demande(s)`, ""]} />
                    <Bar dataKey="count" fill="var(--color-chart-4)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-medium text-foreground">Évolution mensuelle</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyBesoins}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend
                  formatter={(value) => BESOIN_SUPPORT_LABELS[value as keyof typeof BESOIN_SUPPORT_LABELS]}
                  wrapperStyle={{ fontSize: 12 }}
                />
                {BESOIN_SUPPORT_KEYS.map((key, index) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={EXTENDED_PALETTE[index % EXTENDED_PALETTE.length]}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <MonthlyDataHint monthCount={monthlyBesoins.length} />
        </div>
      </CardContent>
    </Card>
  );
}
