import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { FicheForm } from "@/components/fiche/fiche-form";
import { estFicheHistorisee, getFiche } from "@/lib/actions/fiche";
import { ficheToFormValues } from "@/lib/fiche-mapper";
import { formatPeriodeFr } from "@/lib/periode";
import { estAutorise, getSession } from "@/lib/session";

export default async function FichePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [session, fiche] = await Promise.all([getSession(), getFiche(id)]);
  const defaultValues = ficheToFormValues(fiche);

  if (!fiche || !defaultValues) {
    notFound();
  }

  // Un utilisateur standard ne doit pas pouvoir ouvrir la fiche d'un autre
  // projet, y compris en devinant l'URL : on masque l'existence de la fiche
  // plutôt que d'afficher un message d'accès refusé.
  if (!estAutorise(session, fiche.responsableEmail)) {
    notFound();
  }

  return (
    <AppShell>
      <FicheForm
        mode="edit"
        ficheId={id}
        defaultValues={defaultValues}
        readOnly={await estFicheHistorisee(fiche)}
        periodeLabel={formatPeriodeFr(fiche.periode)}
      />
    </AppShell>
  );
}
