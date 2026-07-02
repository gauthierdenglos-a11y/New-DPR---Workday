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
import { Heatmap } from "@/components/statistiques/heatmap";
import { MonthlyDataHint } from "@/components/statistiques/monthly-data-hint";
import {
  ALL_CAUSE_KEYS,
  ALL_CAUSE_LABELS,
  EXTENDED_PALETTE,
  computeCauseCounts,
  computeCauseHeatmap,
  computeMonthlyCauses,
  type FicheStat,
} from "@/lib/statistiques-utils";

export function SectionCausesDerives({ fiches }: { fiches: FicheStat[] }) {
  const causeCounts = computeCauseCounts(fiches);
  const heatmapClient = computeCauseHeatmap(fiches, "client");
  const heatmapType = computeCauseHeatmap(fiches, "typeProjet");
  const monthlyCauses = computeMonthlyCauses(fiches);

  return (
    <Card>
      <CardHeader>
        <CardTitle>2. Causes principales des dérives</CardTitle>
        <CardDescription>Pourquoi les projets dérivent-ils ?</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <div>
          <h3 className="mb-2 text-sm font-medium text-foreground">
            Nombre de projets concernés par chaque cause
          </h3>
          {causeCounts.every((c) => c.count === 0) ? (
            <p className="py-10 text-center text-sm text-muted-foreground">Aucune donnée.</p>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={causeCounts} layout="vertical" margin={{ left: 24 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
                  <YAxis
                    type="category"
                    dataKey="label"
                    width={220}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value, _name, item) => [
                      `${value} projet(s) (${(item.payload as { pct: number }).pct} %)`,
                      "Projets concernés",
                    ]}
                  />
                  <Bar dataKey="count" fill="var(--color-chart-5)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">Heatmap Cause × Client</h3>
            <Heatmap data={heatmapClient} />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium text-foreground">
              Heatmap Cause × Type de projet
            </h3>
            <Heatmap data={heatmapType} />
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-medium text-foreground">
            Évolution des causes dans le temps
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyCauses}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend
                  formatter={(value) => ALL_CAUSE_LABELS[value as keyof typeof ALL_CAUSE_LABELS]}
                  wrapperStyle={{ fontSize: 12 }}
                />
                {ALL_CAUSE_KEYS.map((key, index) => (
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
          <MonthlyDataHint monthCount={monthlyCauses.length} />
        </div>
      </CardContent>
    </Card>
  );
}
