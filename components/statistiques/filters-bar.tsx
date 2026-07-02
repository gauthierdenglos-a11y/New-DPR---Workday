"use client";

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PHASE,
  PHASE_LABELS,
  STATUT_GLOBAL,
  STATUT_GLOBAL_LABELS,
  TYPE_PROJET,
  TYPE_PROJET_LABELS,
} from "@/lib/validations/fiche";
import {
  DEFAULT_FILTERS,
  type FilterOptions,
  type StatistiquesFilters,
} from "@/lib/statistiques-utils";

type FiltersBarProps = {
  filters: StatistiquesFilters;
  onChange: (filters: StatistiquesFilters) => void;
  options: FilterOptions;
};

export function FiltersBar({ filters, onChange, options }: FiltersBarProps) {
  const set = <K extends keyof StatistiquesFilters>(key: K, value: string | null) => {
    onChange({ ...filters, [key]: value ?? "all" });
  };

  const isDefault = JSON.stringify(filters) === JSON.stringify(DEFAULT_FILTERS);

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-medium text-foreground">Filtres</h2>
          <Button
            variant="ghost"
            size="sm"
            disabled={isDefault}
            onClick={() => onChange(DEFAULT_FILTERS)}
            className="text-muted-foreground"
          >
            <RotateCcw />
            Réinitialiser
          </Button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Période</Label>
            <Select value={filters.periode} onValueChange={(v) => set("periode", v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                {options.periodes.map((p) => (
                  <SelectItem key={p.key} value={p.key}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Responsable DP/CP</Label>
            <Select value={filters.responsable} onValueChange={(v) => set("responsable", v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {options.responsables.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Client</Label>
            <Select value={filters.client} onValueChange={(v) => set("client", v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {options.clients.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Projet</Label>
            <Select value={filters.projet} onValueChange={(v) => set("projet", v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {options.projets.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Type de projet</Label>
            <Select value={filters.typeProjet} onValueChange={(v) => set("typeProjet", v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {TYPE_PROJET.map((t) => (
                  <SelectItem key={t} value={t}>
                    {TYPE_PROJET_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Statut</Label>
            <Select value={filters.statut} onValueChange={(v) => set("statut", v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {STATUT_GLOBAL.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUT_GLOBAL_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Phase</Label>
            <Select value={filters.phase} onValueChange={(v) => set("phase", v)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                {PHASE.map((p) => (
                  <SelectItem key={p} value={p}>
                    {PHASE_LABELS[p]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
