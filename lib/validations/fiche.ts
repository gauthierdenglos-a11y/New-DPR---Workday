import { z } from "zod";

// ---------------------------------------------------------------------------
// Enums + libellés FR (source : onglet "Listes" du fichier Excel Fiche Projet V2)
// ---------------------------------------------------------------------------

export const TYPE_PROJET = ["BUILD", "RUN", "FORFAIT", "REGIE", "MIXTE"] as const;
export type TypeProjet = (typeof TYPE_PROJET)[number];
export const TYPE_PROJET_LABELS: Record<TypeProjet, string> = {
  BUILD: "Build",
  RUN: "Run",
  FORFAIT: "Forfait",
  REGIE: "Régie",
  MIXTE: "Mixte",
};

export const PHASE = ["CADRAGE", "BUILD", "RECETTE", "DEPLOIEMENT", "RUN"] as const;
export type Phase = (typeof PHASE)[number];
export const PHASE_LABELS: Record<Phase, string> = {
  CADRAGE: "Cadrage",
  BUILD: "Build",
  RECETTE: "Recette",
  DEPLOIEMENT: "Déploiement",
  RUN: "Run",
};

export const STATUT_GLOBAL = ["CRITIQUE", "WARNING", "SOUS_CONTROLE", "OK"] as const;
export type StatutGlobal = (typeof STATUT_GLOBAL)[number];
export const STATUT_GLOBAL_LABELS: Record<StatutGlobal, string> = {
  CRITIQUE: "⚫ Critique",
  WARNING: "🔴 Warning",
  SOUS_CONTROLE: "🟠 Sous contrôle",
  OK: "🟢 OK",
};
export const STATUT_GLOBAL_LEGENDE =
  "⚫ Critique = dérive non maîtrisée | 🔴 Warning = risques non sécurisés | 🟠 Sous contrôle = plan engagé | 🟢 OK = stabilisé";

export const RELATION_CLIENT = ["DEGRADEE", "TENDUE", "SAINE"] as const;
export type RelationClient = (typeof RELATION_CLIENT)[number];
export const RELATION_CLIENT_LABELS: Record<RelationClient, string> = {
  DEGRADEE: "🔴 Dégradée",
  TENDUE: "🟠 Tendue",
  SAINE: "🟢 Saine",
};

export const METEO_EQUIPE = ["DESENGAGEMENT", "FRAGILE", "ENGAGEE"] as const;
export type MeteoEquipe = (typeof METEO_EQUIPE)[number];
export const METEO_EQUIPE_LABELS: Record<MeteoEquipe, string> = {
  DESENGAGEMENT: "🔴 Désengagement",
  FRAGILE: "🟠 Fragile",
  ENGAGEE: "🟢 Engagée",
};

export const STATUT_PLAN = [
  "NON_LANCE",
  "EN_COURS",
  "PREMIERS_RESULTATS",
  "INEFFICACE",
] as const;
export type StatutPlan = (typeof STATUT_PLAN)[number];
export const STATUT_PLAN_LABELS: Record<StatutPlan, string> = {
  NON_LANCE: "Non lancé",
  EN_COURS: "En cours",
  PREMIERS_RESULTATS: "Premiers résultats",
  INEFFICACE: "Inefficace",
};

export const IMPACT = ["FAIBLE", "MOYEN", "ELEVE"] as const;
export type Impact = (typeof IMPACT)[number];
export const IMPACT_LABELS: Record<Impact, string> = {
  FAIBLE: "Faible",
  MOYEN: "Moyen",
  ELEVE: "Élevé",
};

export const PROBABILITE = ["FAIBLE", "MOYENNE", "ELEVEE"] as const;
export type Probabilite = (typeof PROBABILITE)[number];
export const PROBABILITE_LABELS: Record<Probabilite, string> = {
  FAIBLE: "Faible",
  MOYENNE: "Moyenne",
  ELEVEE: "Élevée",
};

// ---------------------------------------------------------------------------
// C. Causes principales de la dérive (7 cases à cocher, dont "Autre")
// ---------------------------------------------------------------------------

export const CAUSE_KEYS = [
  "sousEstimationInitiale",
  "deriveDePerimetre",
  "problemesStaffing",
  "difficultesTechniques",
  "dependancesClientPartenaires",
  "gouvernancePilotageInsuffisant",
] as const;
export type CauseKey = (typeof CAUSE_KEYS)[number];
export const CAUSE_LABELS: Record<CauseKey, string> = {
  sousEstimationInitiale: "Sous-estimation initiale",
  deriveDePerimetre: "Dérive périmètre",
  problemesStaffing: "Problèmes staffing (compétences / capacité)",
  difficultesTechniques: "Difficultés techniques",
  dependancesClientPartenaires: "Dépendances client / partenaires",
  gouvernancePilotageInsuffisant: "Gouvernance / pilotage insuffisant",
};

export const causesSchema = z.object({
  sousEstimationInitiale: z.boolean(),
  deriveDePerimetre: z.boolean(),
  problemesStaffing: z.boolean(),
  difficultesTechniques: z.boolean(),
  dependancesClientPartenaires: z.boolean(),
  gouvernancePilotageInsuffisant: z.boolean(),
  autre: z.boolean(),
  autrePrecision: z.string().optional(),
});
export type Causes = z.infer<typeof causesSchema>;
export const DEFAULT_CAUSES: Causes = {
  sousEstimationInitiale: false,
  deriveDePerimetre: false,
  problemesStaffing: false,
  difficultesTechniques: false,
  dependancesClientPartenaires: false,
  gouvernancePilotageInsuffisant: false,
  autre: false,
  autrePrecision: "",
};

// ---------------------------------------------------------------------------
// D.2 Actions prioritaires (3 max)
// ---------------------------------------------------------------------------

export const actionItemSchema = z.object({
  action: z.string().optional(),
  responsable: z.string().optional(),
  echeance: z.string().optional(),
});
export type ActionItem = z.infer<typeof actionItemSchema>;
export const DEFAULT_ACTIONS: ActionItem[] = [
  { action: "", responsable: "", echeance: "" },
  { action: "", responsable: "", echeance: "" },
  { action: "", responsable: "", echeance: "" },
];

// ---------------------------------------------------------------------------
// D.3 Risques majeurs (top 3)
// ---------------------------------------------------------------------------

export const risqueItemSchema = z.object({
  description: z.string().optional(),
  impact: z.enum(IMPACT).optional(),
  probabilite: z.enum(PROBABILITE).optional(),
});
export type RisqueItem = z.infer<typeof risqueItemSchema>;
export const DEFAULT_RISQUES: RisqueItem[] = [
  { description: "" },
  { description: "" },
  { description: "" },
];

// ---------------------------------------------------------------------------
// D.4 Besoins de support Hub Tech (6 items fixes)
// ---------------------------------------------------------------------------

export const BESOIN_SUPPORT_KEYS = [
  "renfortStaffing",
  "expertiseTechnique",
  "appuiPilotage",
  "supportCommerceClient",
  "arbitrageManagement",
  "autre",
] as const;
export type BesoinSupportKey = (typeof BESOIN_SUPPORT_KEYS)[number];
export const BESOIN_SUPPORT_LABELS: Record<BesoinSupportKey, string> = {
  renfortStaffing: "Renfort staffing",
  expertiseTechnique: "Expertise technique",
  appuiPilotage: "Appui pilotage",
  supportCommerceClient: "Support commerce / client",
  arbitrageManagement: "Arbitrage management",
  autre: "Autre",
};

export const besoinSupportItemSchema = z.object({
  besoin: z.enum(BESOIN_SUPPORT_KEYS),
  applicable: z.boolean(),
  commentaire: z.string().optional(),
});
export type BesoinSupportItem = z.infer<typeof besoinSupportItemSchema>;
export const DEFAULT_BESOINS_SUPPORT: BesoinSupportItem[] = BESOIN_SUPPORT_KEYS.map(
  (besoin) => ({ besoin, applicable: false, commentaire: "" }),
);

// ---------------------------------------------------------------------------
// Schéma complet de la fiche
// ---------------------------------------------------------------------------

export const ficheFormSchema = z.object({
  dateMiseAJour: z.string().min(1, "Date requise"),

  // A. Informations générales
  projet: z.string().min(1, "Le nom du projet est requis"),
  client: z.string().min(1, "Le client est requis"),
  responsablePilotage: z.string().min(1, "Le responsable pilotage est requis"),
  typeProjet: z.enum(TYPE_PROJET),
  phaseActuelle: z.enum(PHASE),

  // B. Indicateurs visuels clés
  statutGlobal: z.enum(STATUT_GLOBAL),
  relationClient: z.enum(RELATION_CLIENT),
  relationClientCommentaire: z.string().optional(),
  meteoEquipe: z.enum(METEO_EQUIPE),
  signauxFaibles: z.string().optional(),

  // C. Compréhension de la dérive
  causes: causesSchema,
  // Champs numériques saisis en texte, convertis en nombre au moment de la sauvegarde (lib/actions/fiche.ts)
  ecartMargePct: z.string().optional(),
  ecartMargeCommentaire: z.string().optional(),
  ecartPlanningJours: z.string().optional(),
  ecartPlanningCommentaire: z.string().optional(),
  chargeReevalueePct: z.string().optional(),
  chargeReevalueeCommentaire: z.string().optional(),
  avancementPct: z.string().optional(),
  avancementCommentaire: z.string().optional(),

  // D. Plan d'action & trajectoire
  planRemediationDefini: z.boolean(),
  statutPlan: z.enum(STATUT_PLAN).optional(),
  actions: z.array(actionItemSchema).length(3),
  risques: z.array(risqueItemSchema).length(3),
  besoinsSupport: z.array(besoinSupportItemSchema).length(6),
});

export type FicheFormValues = z.infer<typeof ficheFormSchema>;

export const DEFAULT_FICHE_VALUES: FicheFormValues = {
  dateMiseAJour: new Date().toISOString().slice(0, 10),
  projet: "",
  client: "",
  responsablePilotage: "",
  typeProjet: "BUILD",
  phaseActuelle: "CADRAGE",
  statutGlobal: "OK",
  relationClient: "SAINE",
  relationClientCommentaire: "",
  meteoEquipe: "ENGAGEE",
  signauxFaibles: "",
  causes: DEFAULT_CAUSES,
  ecartMargePct: "",
  ecartMargeCommentaire: "",
  ecartPlanningJours: "",
  ecartPlanningCommentaire: "",
  chargeReevalueePct: "",
  chargeReevalueeCommentaire: "",
  avancementPct: "",
  avancementCommentaire: "",
  planRemediationDefini: false,
  statutPlan: undefined,
  actions: DEFAULT_ACTIONS,
  risques: DEFAULT_RISQUES,
  besoinsSupport: DEFAULT_BESOINS_SUPPORT,
};
