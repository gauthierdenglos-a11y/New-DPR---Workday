import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { FichesList } from "@/components/fiche/fiches-list";
import { SimulateMonthButton } from "@/components/fiche/simulate-month-button";
import { listFichesGroupeesParProjet } from "@/lib/actions/fiche";

export default async function FichesPage() {
  const groupes = await listFichesGroupeesParProjet();

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Mes Fiches</h1>
            <p className="text-sm text-muted-foreground">
              Fiche en cours par projet. Dépliez une ligne pour consulter son historique.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SimulateMonthButton />
            <Button nativeButton={false} render={<Link href="/fiches/nouveau" />}>
              Nouveau Projet
            </Button>
          </div>
        </div>

        <FichesList groupes={groupes} />
      </div>
    </AppShell>
  );
}
