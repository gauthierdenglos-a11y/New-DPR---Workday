import { AppShell } from "@/components/layout/app-shell";
import { StatistiquesDashboard } from "@/components/statistiques/statistiques-dashboard";
import { listFichesCourantes } from "@/lib/actions/fiche";
import { ficheToStat } from "@/lib/statistiques-utils";
import { estAutorise, getSession } from "@/lib/session";

export default async function StatistiquesPage() {
  const [session, fiches] = await Promise.all([getSession(), listFichesCourantes()]);
  const visibles =
    session.role === "ADMIN"
      ? fiches
      : fiches.filter((f) => estAutorise(session, f.responsableEmail));
  const stats = visibles.map(ficheToStat);

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Statistiques</h1>
          <p className="text-sm text-muted-foreground">
            {session.role === "ADMIN"
              ? "Vue consolidée du portefeuille de projets."
              : "Statistiques de votre projet."}
          </p>
        </div>
        <StatistiquesDashboard fiches={stats} />
      </div>
    </AppShell>
  );
}
