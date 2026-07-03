import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { FicheForm } from "@/components/fiche/fiche-form";
import { getSession } from "@/lib/session";

export default async function NouvelleFichePage() {
  const session = await getSession();
  if (session.role !== "ADMIN") {
    redirect("/fiches");
  }

  return (
    <AppShell>
      <FicheForm mode="create" />
    </AppShell>
  );
}
