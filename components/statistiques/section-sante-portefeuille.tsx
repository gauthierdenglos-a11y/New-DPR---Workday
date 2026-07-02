"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { STATUT_GLOBAL_LABELS } from "@/lib/validations/fiche";
import {
  STATUT_COLORS,
  computeMonthlyStatuts,
  computeStatutCounts,
  formatPct,
  type FicheStat,
} from "@/lib/statistiques-utils";
import { MonthlyDataHint } from "@/components/statistiques/monthly-data-hint";

export function SectionSantePortefeuille({ fiches }: { fiches: FicheStat[] }) {
  const statutCounts = computeStatutCounts(fiches);
  const monthlyStatuts = computeMonthlyStatuts(fiches);
  const donutData = statutCounts.filter((s) => s.count > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>1. État de santé du portefeuille</CardTitle>
        <CardDescription>Comment se porte mon portefeuille de projets ?</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {statutCounts.map((s) => (
            <div key={s.statut} className="rounded-lg border border-border p-3">
              <p className="text-xs text-muted-foreground">{STATUT_GLOBAL_LABELS[s.statut]}</p>
              <p className="text-lg font-semibold text-foreground">{formatPct(s.pct)}</p>
              <p className="text-xs text-muted-foreground">{s.count} projet(s)</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">
              Répartition des projets par statut
            </h3>
            {donutData.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">Aucune donnée.</p>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={donutData}
                      dataKey="count"
                      nameKey="statut"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={2}
                    >
                      {donutData.map((entry) => (
                        <Cell key={entry.statut} fill={STATUT_COLORS[entry.statut]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, _name, item) => [
                        `${value} projet(s)`,
                        STATUT_GLOBAL_LABELS[
                          (item.payload as { statut: keyof typeof STATUT_GLOBAL_LABELS }).statut
                        ],
                      ]}
                    />
                    <Legend
                      formatter={(_value, entry) =>
                        STATUT_GLOBAL_LABELS[
                          (entry.payload as { statut: keyof typeof STATUT_GLOBAL_LABELS }).statut
                        ]
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">
              Évolution mensuelle des statuts
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyStatuts}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend formatter={(value) => STATUT_GLOBAL_LABELS[value as keyof typeof STATUT_GLOBAL_LABELS]} />
                  <Area
                    type="monotone"
                    dataKey="OK"
                    stackId="1"
                    stroke={STATUT_COLORS.OK}
                    fill={STATUT_COLORS.OK}
                    fillOpacity={0.7}
                  />
                  <Area
                    type="monotone"
                    dataKey="SOUS_CONTROLE"
                    stackId="1"
                    stroke={STATUT_COLORS.SOUS_CONTROLE}
                    fill={STATUT_COLORS.SOUS_CONTROLE}
                    fillOpacity={0.7}
                  />
                  <Area
                    type="monotone"
                    dataKey="WARNING"
                    stackId="1"
                    stroke={STATUT_COLORS.WARNING}
                    fill={STATUT_COLORS.WARNING}
                    fillOpacity={0.7}
                  />
                  <Area
                    type="monotone"
                    dataKey="CRITIQUE"
                    stackId="1"
                    stroke={STATUT_COLORS.CRITIQUE}
                    fill={STATUT_COLORS.CRITIQUE}
                    fillOpacity={0.7}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <MonthlyDataHint monthCount={monthlyStatuts.length} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
