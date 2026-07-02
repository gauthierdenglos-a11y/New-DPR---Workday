import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FicheProjetGroup } from "@/components/fiche/fiche-projet-group";
import { listFichesGroupeesParProjet } from "@/lib/actions/fiche";

export default async function FichesPage() {
  const groupes = await listFichesGroupeesParProjet();

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Mes Fiches</h1>
            <p className="text-sm text-muted-foreground">
              Fiche en cours par projet. Dépliez une ligne pour consulter son historique.
            </p>
          </div>
          <Button nativeButton={false} render={<Link href="/fiches/nouveau" />}>
            Nouveau Projet
          </Button>
        </div>

        <Card>
          <CardContent>
            {groupes.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Aucune fiche pour le moment. Créez la première fiche projet.
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
                  {groupes.map((groupe) => (
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
    </AppShell>
  );
}
