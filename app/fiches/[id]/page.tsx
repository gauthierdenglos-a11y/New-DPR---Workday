import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { FicheForm } from "@/components/fiche/fiche-form";
import { getFiche } from "@/lib/actions/fiche";
import { ficheToFormValues } from "@/lib/fiche-mapper";

export default async function FichePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const fiche = await getFiche(id);
  const defaultValues = ficheToFormValues(fiche);

  if (!defaultValues) {
    notFound();
  }

  return (
    <AppShell>
      <FicheForm mode="edit" ficheId={id} defaultValues={defaultValues} />
    </AppShell>
  );
}
