import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatutGlobalBadge } from "@/components/fiche/status-badge";
import { listFiches } from "@/lib/actions/fiche";
import { PHASE_LABELS } from "@/lib/validations/fiche";

export default async function FichesPage() {
  const fiches = await listFiches();

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Mes Fiches</h1>
            <p className="text-sm text-muted-foreground">
              Historique des fiches flash projet.
            </p>
          </div>
          <Button nativeButton={false} render={<Link href="/fiches/nouveau" />}>
            Nouveau Projet
          </Button>
        </div>

        <Card>
          <CardContent>
            {fiches.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Aucune fiche pour le moment. Créez la première fiche projet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Projet</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Phase</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fiches.map((fiche) => (
                    <TableRow key={fiche.id}>
                      <TableCell className="font-medium">{fiche.projet}</TableCell>
                      <TableCell>{fiche.client}</TableCell>
                      <TableCell>
                        {fiche.dateMiseAJour.toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell>{PHASE_LABELS[fiche.phaseActuelle]}</TableCell>
                      <TableCell>
                        <StatutGlobalBadge value={fiche.statutGlobal} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Link
                          href={`/fiches/${fiche.id}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          Voir / Éditer
                        </Link>
                      </TableCell>
                    </TableRow>
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
