import { AppShell } from "@/components/layout/app-shell";
import { FicheForm } from "@/components/fiche/fiche-form";

export default function NouvelleFichePage() {
  return (
    <AppShell>
      <FicheForm mode="create" />
    </AppShell>
  );
}
