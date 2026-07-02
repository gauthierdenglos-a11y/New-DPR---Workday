"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ficheFormSchema, type FicheFormValues } from "@/lib/validations/fiche";
import type { Prisma } from "@/lib/generated/prisma/client";

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
  const fiche = await prisma.fiche.create({ data });
  revalidatePath("/fiches");
  redirect(`/fiches/${fiche.id}`);
}

export async function updateFiche(id: string, values: FicheFormValues) {
  const data = toPrismaData(values);
  await prisma.fiche.update({ where: { id }, data });
  revalidatePath("/fiches");
  revalidatePath(`/fiches/${id}`);
  redirect(`/fiches/${id}`);
}

export async function deleteFiche(id: string) {
  await prisma.fiche.delete({ where: { id } });
  revalidatePath("/fiches");
}

export async function listFiches() {
  return prisma.fiche.findMany({ orderBy: { dateMiseAJour: "desc" } });
}

export async function getFiche(id: string) {
  return prisma.fiche.findUnique({ where: { id } });
}
