"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ficheFormSchema, type FicheFormValues } from "@/lib/validations/fiche";
import type { Fiche, Prisma } from "@/lib/generated/prisma/client";
import { debutDuMois, estHistorisee, formatPeriodeFr } from "@/lib/periode";

function toNumberOrNull(value: string | undefined) {
  if (!value || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function toPrismaData(values: FicheFormValues) {
  const parsed = ficheFormSchema.parse(values);
  return {
    dateMiseAJour: new Date(parsed.dateMiseAJour),
    projet: parsed.projet,
    client: parsed.client,
    responsablePilotage: parsed.responsablePilotage,
    responsableEmail: parsed.responsableEmail,
    typeProjet: parsed.typeProjet,
    phaseActuelle: parsed.phaseActuelle,
    statutGlobal: parsed.statutGlobal,
    relationClient: parsed.relationClient,
    relationClientCommentaire: parsed.relationClientCommentaire || null,
    meteoEquipe: parsed.meteoEquipe,
    signauxFaibles: parsed.signauxFaibles || null,
    departsCles: parsed.departsCles || null,
    causes: parsed.causes as Prisma.InputJsonValue,
    difficultesMaitrisables: parsed.difficultesMaitrisables || null,
    difficultesNonMaitrisables: parsed.difficultesNonMaitrisables || null,
    ecartMargePct: toNumberOrNull(parsed.ecartMargePct),
    ecartMargeCommentaire: parsed.ecartMargeCommentaire || null,
    ecartPlanningJours: toNumberOrNull(parsed.ecartPlanningJours),
    ecartPlanningCommentaire: parsed.ecartPlanningCommentaire || null,
    chargeReevalueePct: toNumberOrNull(parsed.chargeReevalueePct),
    chargeReevalueeCommentaire: parsed.chargeReevalueeCommentaire || null,
    avancementPct: toNumberOrNull(parsed.avancementPct),
    avancementCommentaire: parsed.avancementCommentaire || null,
    planRemediationDefini: parsed.planRemediationDefini,
    statutPlan: parsed.statutPlan ?? null,
    actions: parsed.actions as Prisma.InputJsonValue,
    risques: parsed.risques as Prisma.InputJsonValue,
    besoinsSupport: parsed.besoinsSupport as Prisma.InputJsonValue,
    iaUtilisee: parsed.iaUtilisee,
    iaPhases: parsed.iaPhases as Prisma.InputJsonValue,
    iaGainEstime: parsed.iaGainEstime,
    iaCasUsagePrincipal: parsed.iaCasUsagePrincipal || null,
    iaFrein: parsed.iaFrein,
    iaFreinCommentaire: parsed.iaFreinCommentaire || null,
  };
}

export async function createFiche(values: FicheFormValues) {
  const data = toPrismaData(values);
  const periode = debutDuMois(data.dateMiseAJour);

  const projet = await prisma.projet.upsert({
    where: { nom_client: { nom: data.projet, client: data.client } },
    update: {
      responsablePilotage: data.responsablePilotage,
      responsableEmail: data.responsableEmail,
      typeProjet: data.typeProjet,
    },
    create: {
      nom: data.projet,
      client: data.client,
      responsablePilotage: data.responsablePilotage,
      responsableEmail: data.responsableEmail,
      typeProjet: data.typeProjet,
    },
  });

  const ficheExistante = await prisma.fiche.findUnique({
    where: { projetId_periode: { projetId: projet.id, periode } },
  });
  if (ficheExistante) {
    throw new Error(
      `Une fiche existe déjà pour "${data.projet}" (${formatPeriodeFr(periode)}). Modifiez-la plutôt que d'en créer une nouvelle.`,
    );
  }

  const fiche = await prisma.fiche.create({
    data: { ...data, projetId: projet.id, periode, statut: "SOUMISE" },
  });
  revalidatePath("/fiches");
  redirect(`/fiches/${fiche.id}`);
}

export async function updateFiche(id: string, values: FicheFormValues) {
  const data = toPrismaData(values);
  const existante = await prisma.fiche.findUniqueOrThrow({ where: { id } });

  if (estHistorisee(existante.periode)) {
    throw new Error(
      `La fiche de ${formatPeriodeFr(existante.periode)} est historisée (mois clos) et n'est plus modifiable.`,
    );
  }

  await prisma.projet.update({
    where: { id: existante.projetId },
    data: {
      nom: data.projet,
      client: data.client,
      responsablePilotage: data.responsablePilotage,
      responsableEmail: data.responsableEmail,
      typeProjet: data.typeProjet,
    },
  });

  await prisma.fiche.update({
    where: { id },
    data: { ...data, statut: "SOUMISE" },
  });
  revalidatePath("/fiches");
  revalidatePath(`/fiches/${id}`);
  redirect(`/fiches/${id}`);
}

export async function deleteFiche(id: string) {
  const existante = await prisma.fiche.findUniqueOrThrow({ where: { id } });

  // La version en cours (la plus récente du projet) ne peut être supprimée
  // que si elle n'a pas d'historique : sinon, on supprime d'abord les
  // versions plus anciennes. Ces dernières, elles, sont toujours supprimables.
  const plusRecente = await prisma.fiche.findFirst({
    where: { projetId: existante.projetId },
    orderBy: { periode: "desc" },
  });
  if (plusRecente?.id === existante.id) {
    const possedeHistorique = await prisma.fiche.count({
      where: { projetId: existante.projetId, id: { not: existante.id } },
    });
    if (possedeHistorique > 0) {
      throw new Error(
        `La fiche de ${formatPeriodeFr(existante.periode)} est la version en cours du projet et possède un historique : supprimez d'abord les versions plus anciennes.`,
      );
    }
  }

  await prisma.fiche.delete({ where: { id } });
  revalidatePath("/fiches");
}

export async function listFiches() {
  return prisma.fiche.findMany({ orderBy: { updatedAt: "desc" } });
}

export type FicheGroupe = {
  projetId: string;
  courante: Fiche;
  historisees: Fiche[];
};

// Une entrée par projet : la fiche la plus récente (mise en avant dans la
// liste) et le reste de son historique, du plus récent au plus ancien.
export async function listFichesGroupeesParProjet(): Promise<FicheGroupe[]> {
  const fiches = await prisma.fiche.findMany({ orderBy: { periode: "desc" } });

  const parProjet = new Map<string, Fiche[]>();
  for (const fiche of fiches) {
    const liste = parProjet.get(fiche.projetId);
    if (liste) {
      liste.push(fiche);
    } else {
      parProjet.set(fiche.projetId, [fiche]);
    }
  }

  return Array.from(parProjet.values())
    .map(([courante, ...historisees]) => ({
      projetId: courante.projetId,
      courante,
      historisees,
    }))
    .sort((a, b) => b.courante.periode.getTime() - a.courante.periode.getTime());
}

export async function getFiche(id: string) {
  return prisma.fiche.findUnique({ where: { id } });
}
