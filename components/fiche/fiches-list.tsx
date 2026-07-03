"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FicheProjetGroup } from "@/components/fiche/fiche-projet-group";
import { FichesFiltersBar } from "@/components/fiche/fiches-filters-bar";
import type { FicheGroupe } from "@/lib/actions/fiche";
import {
  DEFAULT_FICHES_FILTERS,
  DEFAULT_FICHES_SORT,
  applyFichesFilters,
  computeFichesFilterOptions,
  sortFicheGroupes,
  type FichesFilters,
  type FichesSort,
} from "@/lib/fiches-list-utils";

export function FichesList({ groupes }: { groupes: FicheGroupe[] }) {
  const [filters, setFilters] = useState<FichesFilters>(DEFAULT_FICHES_FILTERS);
  const [sort, setSort] = useState<FichesSort>(DEFAULT_FICHES_SORT);

  const options = useMemo(() => computeFichesFilterOptions(groupes), [groupes]);
  const visibles = useMemo(
    () => sortFicheGroupes(applyFichesFilters(groupes, filters), sort),
    [groupes, filters, sort],
  );

  if (groupes.length === 0) {
    return (
      <Card>
        <CardContent>
          <p className="py-10 text-center text-sm text-muted-foreground">
            Aucune fiche pour le moment. Créez la première fiche projet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <FichesFiltersBar
        filters={filters}
        onFiltersChange={setFilters}
        sort={sort}
        onSortChange={setSort}
        options={options}
      />

      <Card>
        <CardContent>
          {visibles.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Aucun projet ne correspond aux filtres sélectionnés.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Projet</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Responsable pilotage</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Date de dernière modification</TableHead>
                  <TableHead>Phase</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Fiche du mois</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibles.map((groupe) => (
                  <FicheProjetGroup
                    key={groupe.projetId}
                    courante={groupe.courante}
                    historisees={groupe.historisees}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
