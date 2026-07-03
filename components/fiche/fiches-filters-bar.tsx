"use client";

import { Search, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { FICHE_STATUT_LABELS } from "@/lib/fiche-statut";
import type { FicheStatut } from "@/lib/generated/prisma/client";
import {
  DEFAULT_FICHES_FILTERS,
  DEFAULT_FICHES_SORT,
  FICHES_SORT_LABELS,
  type FichesFilterOptions,
  type FichesFilters,
  type FichesSort,
} from "@/lib/fiches-list-utils";

const FICHE_STATUT_OPTIONS: FicheStatut[] = ["A_COMPLETER", "SOUMISE"];

export function FichesFiltersBar({
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  options,
}: {
  filters: FichesFilters;
  onFiltersChange: (filters: FichesFilters) => void;
  sort: FichesSort;
  onSortChange: (sort: FichesSort) => void;
  options: FichesFilterOptions;
}) {
  const set = <K extends keyof FichesFilters>(key: K, value: string | null) => {
    onFiltersChange({ ...filters, [key]: value ?? "all" });
  };

  const isDefault =
    JSON.stringify(filters) === JSON.stringify(DEFAULT_FICHES_FILTERS) &&
    sort === DEFAULT_FICHES_SORT;

  const reset = () => {
    onFiltersChange(DEFAULT_FICHES_FILTERS);
    onSortChange(DEFAULT_FICHES_SORT);
  };

  return (
    <Card>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-medium text-foreground">Filtres et tri</h2>
          <Button
            variant="ghost"
            size="sm"
            disabled={isDefault}
            onClick={reset}
            className="text-muted-foreground"
          >
            <RotateCcw />
            Réinitialiser
          </Button>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Recherche</Label>
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un projet ou un client..."
              value={filters.search}
              onChange={(e) => set("search", e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Client</Label>
            <Select value={filters.client} onValueChange={(v) => set("client", v)}>
              <SelectTrigger className="w-full">
                <SelectValue>{(value: string) => (value === "all" ? "Tous" : value)}</SelectValue>
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
            <Label className="text-xs text-muted-foreground">Responsable DP/CP</Label>
            <Select
              value={filters.responsable}
              onValueChange={(v) => set("responsable", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue>{(value: string) => (value === "all" ? "Tous" : value)}</SelectValue>
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
            <Label className="text-xs text-muted-foreground">Type de projet</Label>
            <Select value={filters.typeProjet} onValueChange={(v) => set("typeProjet", v)}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value: string) =>
                    value === "all" ? "Tous" : TYPE_PROJET_LABELS[value as (typeof TYPE_PROJET)[number]]
                  }
                </SelectValue>
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
            <Label className="text-xs text-muted-foreground">Phase</Label>
            <Select value={filters.phase} onValueChange={(v) => set("phase", v)}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value: string) =>
                    value === "all" ? "Toutes" : PHASE_LABELS[value as (typeof PHASE)[number]]
                  }
                </SelectValue>
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

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Statut global</Label>
            <Select
              value={filters.statutGlobal}
              onValueChange={(v) => set("statutGlobal", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value: string) =>
                    value === "all"
                      ? "Tous"
                      : STATUT_GLOBAL_LABELS[value as (typeof STATUT_GLOBAL)[number]]
                  }
                </SelectValue>
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
            <Label className="text-xs text-muted-foreground">Statut de la fiche</Label>
            <Select value={filters.statut} onValueChange={(v) => set("statut", v)}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  {(value: string) =>
                    value === "all" ? "Tous" : FICHE_STATUT_LABELS[value as FicheStatut]
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {FICHE_STATUT_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {FICHE_STATUT_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-muted-foreground">Trier par</Label>
            <Select value={sort} onValueChange={(v) => onSortChange(v as FichesSort)}>
              <SelectTrigger className="w-full">
                <SelectValue>{(value: string) => FICHES_SORT_LABELS[value as FichesSort]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(FICHES_SORT_LABELS) as FichesSort[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {FICHES_SORT_LABELS[key]}
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
