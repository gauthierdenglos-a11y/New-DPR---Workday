import { AppShell } from "@/components/layout/app-shell";
import { StatistiquesDashboard } from "@/components/statistiques/statistiques-dashboard";
import { listFiches } from "@/lib/actions/fiche";
import { ficheToStat } from "@/lib/statistiques-utils";

export default async function StatistiquesPage() {
  const fiches = await listFiches();
  const stats = fiches.map(ficheToStat);

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Statistiques</h1>
          <p className="text-sm text-muted-foreground">
            Vue consolidée du portefeuille de projets.
          </p>
        </div>
        <StatistiquesDashboard fiches={stats} />
      </div>
    </AppShell>
  );
}
