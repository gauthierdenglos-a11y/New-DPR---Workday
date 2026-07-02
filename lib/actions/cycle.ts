import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { sendClotureNotification } from "@/lib/email";
import { debutDuMois, formatPeriodeFr } from "@/lib/periode";
import type { Prisma } from "@/lib/generated/prisma/client";

export type ResultatGeneration = {
  projet: string;
  ficheId: string;
  email: { sent: boolean; reason?: string };
};

// Clôture mensuelle : pour chaque projet déjà suivi, ouvre la fiche du mois en
// cours en la préremplissant avec les réponses du mois précédent, puis notifie
// le DP/CP par email avec le lien vers la fiche à mettre à jour.
export async function generateMonthlyFiches(now: Date = new Date()): Promise<ResultatGeneration[]> {
  const periode = debutDuMois(now);
  const projets = await prisma.projet.findMany();
  const baseUrl = process.env.APP_BASE_URL || "http://localhost:3000";
  const resultats: ResultatGeneration[] = [];

  for (const projet of projets) {
    const dejaGeneree = await prisma.fiche.findUnique({
      where: { projetId_periode: { projetId: projet.id, periode } },
    });
    if (dejaGeneree) continue;

    const precedente = await prisma.fiche.findFirst({
      where: { projetId: projet.id },
      orderBy: { periode: "desc" },
    });
    // Pas encore de première fiche pour ce projet : rien à reconduire, le
    // DP/CP doit la créer lui-même via "Nouveau Projet".
    if (!precedente) continue;

    const nouvelle = await prisma.fiche.create({
      data: {
        projetId: projet.id,
        dateMiseAJour: periode,
        periode,
        statut: "A_COMPLETER",
        notifieLe: null,
        projet: precedente.projet,
        client: precedente.client,
        responsablePilotage: precedente.responsablePilotage,
        responsableEmail: precedente.responsableEmail,
        typeProjet: precedente.typeProjet,
        phaseActuelle: precedente.phaseActuelle,
        statutGlobal: precedente.statutGlobal,
        relationClient: precedente.relationClient,
        relationClientCommentaire: precedente.relationClientCommentaire,
        meteoEquipe: precedente.meteoEquipe,
        signauxFaibles: precedente.signauxFaibles,
        departsCles: precedente.departsCles,
        causes: precedente.causes as Prisma.InputJsonValue,
        difficultesMaitrisables: precedente.difficultesMaitrisables,
        difficultesNonMaitrisables: precedente.difficultesNonMaitrisables,
        ecartMargePct: precedente.ecartMargePct,
        ecartMargeCommentaire: precedente.ecartMargeCommentaire,
        ecartPlanningJours: precedente.ecartPlanningJours,
        ecartPlanningCommentaire: precedente.ecartPlanningCommentaire,
        chargeReevalueePct: precedente.chargeReevalueePct,
        chargeReevalueeCommentaire: precedente.chargeReevalueeCommentaire,
        avancementPct: precedente.avancementPct,
        avancementCommentaire: precedente.avancementCommentaire,
        planRemediationDefini: precedente.planRemediationDefini,
        statutPlan: precedente.statutPlan,
        actions: precedente.actions as Prisma.InputJsonValue,
        risques: precedente.risques as Prisma.InputJsonValue,
        besoinsSupport: precedente.besoinsSupport as Prisma.InputJsonValue,
        iaUtilisee: precedente.iaUtilisee,
        iaPhases: precedente.iaPhases as Prisma.InputJsonValue,
        iaGainEstime: precedente.iaGainEstime,
        iaCasUsagePrincipal: precedente.iaCasUsagePrincipal,
        iaFrein: precedente.iaFrein,
        iaFreinCommentaire: precedente.iaFreinCommentaire,
      },
    });

    const email = await sendClotureNotification({
      to: nouvelle.responsableEmail,
      projet: nouvelle.projet,
      client: nouvelle.client,
      periodeLabel: formatPeriodeFr(periode),
      ficheUrl: `${baseUrl}/fiches/${nouvelle.id}`,
    });
    if (email.sent) {
      await prisma.fiche.update({
        where: { id: nouvelle.id },
        data: { notifieLe: new Date() },
      });
    }

    resultats.push({ projet: nouvelle.projet, ficheId: nouvelle.id, email });
  }

  if (resultats.length > 0) {
    revalidatePath("/fiches");
  }
  return resultats;
}
