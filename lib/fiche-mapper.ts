import type { Fiche } from "@/lib/generated/prisma/client";
import type {
  ActionItem,
  BesoinSupportItem,
  Causes,
  FicheFormValues,
  IaPhases,
  RisqueItem,
} from "@/lib/validations/fiche";

function toNumberOrUndefined(value: number | null) {
  return value === null ? undefined : String(value);
}

export function ficheToFormValues(fiche: Fiche | null): FicheFormValues | null {
  if (!fiche) return null;
  return {
    dateMiseAJour: fiche.dateMiseAJour.toISOString().slice(0, 10),
    projet: fiche.projet,
    client: fiche.client,
    responsablePilotage: fiche.responsablePilotage,
    typeProjet: fiche.typeProjet,
    phaseActuelle: fiche.phaseActuelle,
    statutGlobal: fiche.statutGlobal,
    relationClient: fiche.relationClient,
    relationClientCommentaire: fiche.relationClientCommentaire ?? "",
    meteoEquipe: fiche.meteoEquipe,
    signauxFaibles: fiche.signauxFaibles ?? "",
    departsCles: fiche.departsCles ?? "",
    causes: fiche.causes as Causes,
    difficultesMaitrisables: fiche.difficultesMaitrisables ?? "",
    difficultesNonMaitrisables: fiche.difficultesNonMaitrisables ?? "",
    ecartMargePct: toNumberOrUndefined(fiche.ecartMargePct),
    ecartMargeCommentaire: fiche.ecartMargeCommentaire ?? "",
    ecartPlanningJours: toNumberOrUndefined(fiche.ecartPlanningJours),
    ecartPlanningCommentaire: fiche.ecartPlanningCommentaire ?? "",
    chargeReevalueePct: toNumberOrUndefined(fiche.chargeReevalueePct),
    chargeReevalueeCommentaire: fiche.chargeReevalueeCommentaire ?? "",
    avancementPct: toNumberOrUndefined(fiche.avancementPct),
    avancementCommentaire: fiche.avancementCommentaire ?? "",
    planRemediationDefini: fiche.planRemediationDefini,
    statutPlan: fiche.statutPlan ?? undefined,
    actions: fiche.actions as ActionItem[],
    risques: fiche.risques as RisqueItem[],
    besoinsSupport: fiche.besoinsSupport as BesoinSupportItem[],
    iaUtilisee: fiche.iaUtilisee,
    iaPhases: fiche.iaPhases as IaPhases,
    iaGainEstime: fiche.iaGainEstime,
    iaCasUsagePrincipal: fiche.iaCasUsagePrincipal ?? "",
    iaFrein: fiche.iaFrein,
    iaFreinCommentaire: fiche.iaFreinCommentaire ?? "",
  };
}
