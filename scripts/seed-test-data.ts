/**
 * Jeu de données de test pour vérifier la clôture mensuelle + l'envoi
 * d'email (voir components/fiche/simulate-month-button.tsx).
 *
 * Supprime les anciennes fiches de test et recrée 2 projets avec 3 mois
 * d'historique chacun (avril, mai, juin 2026), avec des réponses différentes
 * chaque mois : un projet qui se dégrade, un projet qui se redresse. Le mois
 * en cours (juillet) n'est volontairement pas créé : c'est le bouton
 * "Simuler mois suivant" qui doit le générer.
 *
 * Usage : npx tsx scripts/seed-test-data.ts
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Prisma } from "../lib/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function causes(overrides: Partial<Record<string, boolean>> = {}) {
  return {
    sousEstimationInitiale: false,
    deriveDePerimetre: false,
    problemesStaffing: false,
    difficultesTechniques: false,
    dependancesClientPartenaires: false,
    gouvernancePilotageInsuffisant: false,
    autre: false,
    autrePrecision: "",
    ...overrides,
  };
}

function iaPhases(overrides: Partial<Record<string, boolean>> = {}) {
  return {
    conception: false,
    cadrage: false,
    developpement: false,
    tests: false,
    documentation: false,
    gestionProjet: false,
    deploiement: false,
    support: false,
    autre: false,
    ...overrides,
  };
}

const BESOIN_KEYS = [
  "renfortStaffing",
  "expertiseTechnique",
  "appuiPilotage",
  "supportCommerceClient",
  "arbitrageManagement",
  "autre",
] as const;

function besoins(overrides: Partial<Record<(typeof BESOIN_KEYS)[number], { applicable: boolean; commentaire?: string }>> = {}) {
  return BESOIN_KEYS.map((besoin) => ({
    besoin,
    applicable: overrides[besoin]?.applicable ?? false,
    commentaire: overrides[besoin]?.commentaire ?? "",
  }));
}

const periode = (year: number, month: number) => new Date(Date.UTC(year, month - 1, 1));
const dateDansLeMois = (year: number, month: number, day: number) =>
  new Date(Date.UTC(year, month - 1, day));

type ProjetSeed = {
  nom: string;
  client: string;
  responsablePilotage: string;
  responsableEmail: string;
  typeProjet: "TM" | "FORFAIT";
  mois: {
    year: number;
    month: number;
    jourMiseAJour: number;
    data: Omit<
      Prisma.FicheCreateInput,
      "dossierProjet" | "periode" | "dateMiseAJour" | "statut" | "notifieLe" | "projet" | "client" | "responsablePilotage" | "responsableEmail" | "typeProjet"
    >;
  }[];
};

const projets: ProjetSeed[] = [
  {
    nom: "Refonte Portail Client",
    client: "Banque Alpha",
    responsablePilotage: "Julien Marchand",
    responsableEmail: "julien.marchand@banquealpha.fr",
    typeProjet: "FORFAIT",
    mois: [
      {
        year: 2026,
        month: 4,
        jourMiseAJour: 28,
        data: {
          phaseActuelle: "BUILD",
          statutGlobal: "OK",
          relationClient: "SAINE",
          relationClientCommentaire: "Client satisfait de l'avancement, comité mensuel serein.",
          meteoEquipe: "ENGAGEE",
          signauxFaibles: "",
          departsCles: "",
          causes: causes(),
          difficultesMaitrisables: "Quelques ajustements de planning mineurs, résolus en interne.",
          difficultesNonMaitrisables: "",
          ecartMargePct: 0,
          ecartMargeCommentaire: "",
          ecartPlanningJours: 0,
          ecartPlanningCommentaire: "",
          chargeReevalueePct: 0,
          chargeReevalueeCommentaire: "",
          avancementPct: 35,
          avancementCommentaire: "Développement des lots 1 et 2 en cours, conforme au planning.",
          planRemediationDefini: false,
          statutPlan: null,
          actions: [
            { action: "", responsable: "", echeance: "" },
            { action: "", responsable: "", echeance: "" },
            { action: "", responsable: "", echeance: "" },
          ],
          risques: [{ description: "" }, { description: "" }, { description: "" }],
          besoinsSupport: besoins(),
          iaUtilisee: "NON",
          iaPhases: iaPhases(),
          iaGainEstime: "ZERO",
          iaCasUsagePrincipal: "",
          iaFrein: "AUCUN",
          iaFreinCommentaire: "",
        },
      },
      {
        year: 2026,
        month: 5,
        jourMiseAJour: 29,
        data: {
          phaseActuelle: "BUILD",
          statutGlobal: "WARNING",
          relationClient: "TENDUE",
          relationClientCommentaire: "Le client s'inquiète du rythme de livraison du lot 3.",
          meteoEquipe: "FRAGILE",
          signauxFaibles: "Deux développeurs clés sollicités en parallèle sur un autre projet.",
          departsCles: "",
          causes: causes({ problemesStaffing: true, difficultesTechniques: true }),
          difficultesMaitrisables: "Montée en compétence des nouveaux arrivants sur le legacy.",
          difficultesNonMaitrisables: "Dépendance à une API tierce instable côté client.",
          ecartMargePct: -8,
          ecartMargeCommentaire: "Surcharge liée aux reprises techniques.",
          ecartPlanningJours: 12,
          ecartPlanningCommentaire: "Glissement du lot 3 de deux semaines.",
          chargeReevalueePct: 15,
          chargeReevalueeCommentaire: "Recalage de la charge restante sur le lot 3.",
          avancementPct: 48,
          avancementCommentaire: "Lot 3 démarré en retard, rattrapage partiel.",
          planRemediationDefini: true,
          statutPlan: "EN_COURS",
          actions: [
            { action: "Renforcer l'équipe dev de 1 ETP", responsable: "Julien Marchand", echeance: "15/06/2026" },
            { action: "Sécuriser l'accès à l'API tierce avec le client", responsable: "Référent client", echeance: "01/06/2026" },
            { action: "Replanifier le lot 3 avec le client", responsable: "Julien Marchand", echeance: "10/06/2026" },
          ],
          risques: [
            { description: "Retard supplémentaire si l'API tierce n'est pas stabilisée", impact: "ELEVE", probabilite: "MOYENNE" },
            { description: "Fatigue de l'équipe en fin de build", impact: "MOYEN", probabilite: "MOYENNE" },
            { description: "Insatisfaction client si le lot 3 dérive encore", impact: "ELEVE", probabilite: "FAIBLE" },
          ],
          besoinsSupport: besoins({
            renfortStaffing: { applicable: true, commentaire: "1 développeur backend supplémentaire pour 6 semaines." },
            expertiseTechnique: { applicable: true, commentaire: "Support sur l'intégration de l'API tierce." },
          }),
          iaUtilisee: "EN_COURS",
          iaPhases: iaPhases({ developpement: true, tests: true }),
          iaGainEstime: "MOINS_5",
          iaCasUsagePrincipal: "Génération de tests unitaires",
          iaFrein: "MANQUE_TEMPS",
          iaFreinCommentaire: "L'équipe n'a pas eu le temps de former tout le monde aux outils IA.",
        },
      },
      {
        year: 2026,
        month: 6,
        jourMiseAJour: 29,
        data: {
          phaseActuelle: "MIXTE",
          statutGlobal: "CRITIQUE",
          relationClient: "DEGRADEE",
          relationClientCommentaire: "Comité de crise organisé avec le client suite au nouveau retard.",
          meteoEquipe: "DESENGAGEMENT",
          signauxFaibles: "Un développeur senior a exprimé son souhait de quitter le projet.",
          departsCles: "Démission annoncée du lead technique, préavis d'un mois.",
          causes: causes({ problemesStaffing: true, difficultesTechniques: true, gouvernancePilotageInsuffisant: true }),
          difficultesMaitrisables: "Reprise du plan de charge en cours.",
          difficultesNonMaitrisables: "Instabilité persistante de l'API tierce du client, hors de notre contrôle.",
          ecartMargePct: -18,
          ecartMargeCommentaire: "Surcoût lié au turnover et aux reprises techniques.",
          ecartPlanningJours: 25,
          ecartPlanningCommentaire: "Le lot 3 n'est toujours pas livré, le lot 4 est décalé d'autant.",
          chargeReevalueePct: 30,
          chargeReevalueeCommentaire: "Recrutement et transfert de connaissance à intégrer à la charge.",
          avancementPct: 52,
          avancementCommentaire: "Avancement quasi à l'arrêt sur le lot 3.",
          planRemediationDefini: true,
          statutPlan: "INEFFICACE",
          actions: [
            { action: "Recruter en urgence un remplaçant au lead technique", responsable: "Julien Marchand", echeance: "15/07/2026" },
            { action: "Organiser un comité de crise avec la direction client", responsable: "Julien Marchand", echeance: "05/07/2026" },
            { action: "Auditer la charge restante avec un regard externe", responsable: "Hub Tech", echeance: "12/07/2026" },
          ],
          risques: [
            { description: "Perte du lead technique avant transfert de connaissance", impact: "ELEVE", probabilite: "ELEVEE" },
            { description: "Rupture de contrat si le client perd confiance", impact: "ELEVE", probabilite: "MOYENNE" },
            { description: "Dérive de marge supérieure à 20%", impact: "ELEVE", probabilite: "ELEVEE" },
          ],
          besoinsSupport: besoins({
            renfortStaffing: { applicable: true, commentaire: "Remplacement urgent du lead technique." },
            appuiPilotage: { applicable: true, commentaire: "Un CP senior en soutien pour le comité de crise." },
            arbitrageManagement: { applicable: true, commentaire: "Décision sur la poursuite du forfait aux conditions actuelles." },
          }),
          iaUtilisee: "EN_COURS",
          iaPhases: iaPhases({ developpement: true }),
          iaGainEstime: "MOINS_5",
          iaCasUsagePrincipal: "Génération de tests unitaires",
          iaFrein: "MANQUE_TEMPS",
          iaFreinCommentaire: "Crise en cours, aucune disponibilité pour approfondir l'usage de l'IA.",
        },
      },
    ],
  },
  {
    nom: "Migration ERP Finance",
    client: "Industrie Beta",
    responsablePilotage: "Claire Dubois",
    responsableEmail: "claire.dubois@industriebeta.fr",
    typeProjet: "TM",
    mois: [
      {
        year: 2026,
        month: 4,
        jourMiseAJour: 28,
        data: {
          phaseActuelle: "RUN",
          statutGlobal: "CRITIQUE",
          relationClient: "DEGRADEE",
          relationClientCommentaire: "Client très mécontent des incidents de bascule en production.",
          meteoEquipe: "FRAGILE",
          signauxFaibles: "Équipe sous tension suite aux astreintes répétées.",
          departsCles: "",
          causes: causes({ difficultesTechniques: true, sousEstimationInitiale: true }),
          difficultesMaitrisables: "Correctifs en cours sur les jobs de nuit.",
          difficultesNonMaitrisables: "Volumétrie de données réelle bien supérieure aux estimations initiales.",
          ecartMargePct: -22,
          ecartMargeCommentaire: "Surconsommation en régie pour gérer les incidents.",
          ecartPlanningJours: 20,
          ecartPlanningCommentaire: "Stabilisation non prévue au planning initial.",
          chargeReevalueePct: 25,
          chargeReevalueeCommentaire: "Plan de stabilisation à chiffrer.",
          avancementPct: 60,
          avancementCommentaire: "Module comptabilité en production mais instable.",
          planRemediationDefini: true,
          statutPlan: "NON_LANCE",
          actions: [
            { action: "Cadrer un plan de stabilisation avec le client", responsable: "Claire Dubois", echeance: "30/04/2026" },
            { action: "Renforcer le monitoring des jobs batch", responsable: "Équipe technique", echeance: "15/05/2026" },
            { action: "Revoir le dimensionnement de l'infrastructure", responsable: "Claire Dubois", echeance: "20/05/2026" },
          ],
          risques: [
            { description: "Nouvel incident bloquant en clôture comptable client", impact: "ELEVE", probabilite: "ELEVEE" },
            { description: "Perte de confiance totale du sponsor", impact: "ELEVE", probabilite: "MOYENNE" },
            { description: "Explosion du TJM consommé en régie", impact: "MOYEN", probabilite: "ELEVEE" },
          ],
          besoinsSupport: besoins({
            expertiseTechnique: { applicable: true, commentaire: "Expert performance base de données en urgence." },
            arbitrageManagement: { applicable: true, commentaire: "Décision sur le report de la clôture comptable client." },
          }),
          iaUtilisee: "NON",
          iaPhases: iaPhases(),
          iaGainEstime: "ZERO",
          iaCasUsagePrincipal: "",
          iaFrein: "MANQUE_TEMPS",
          iaFreinCommentaire: "",
        },
      },
      {
        year: 2026,
        month: 5,
        jourMiseAJour: 29,
        data: {
          phaseActuelle: "RUN",
          statutGlobal: "SOUS_CONTROLE",
          relationClient: "TENDUE",
          relationClientCommentaire: "Le client constate les premiers effets du plan de stabilisation.",
          meteoEquipe: "FRAGILE",
          signauxFaibles: "Charge d'astreinte encore élevée mais en baisse.",
          departsCles: "",
          causes: causes({ difficultesTechniques: true }),
          difficultesMaitrisables: "Optimisation des jobs batch en cours de validation.",
          difficultesNonMaitrisables: "",
          ecartMargePct: -10,
          ecartMargeCommentaire: "Amélioration par rapport au mois précédent.",
          ecartPlanningJours: 8,
          ecartPlanningCommentaire: "Stabilisation en bonne voie.",
          chargeReevalueePct: 12,
          chargeReevalueeCommentaire: "Charge de stabilisation en baisse.",
          avancementPct: 75,
          avancementCommentaire: "Stabilité retrouvée sur 80% des flux nocturnes.",
          planRemediationDefini: true,
          statutPlan: "PREMIERS_RESULTATS",
          actions: [
            { action: "Finaliser l'optimisation des 20% de flux restants", responsable: "Équipe technique", echeance: "15/06/2026" },
            { action: "Point hebdomadaire de suivi avec le sponsor client", responsable: "Claire Dubois", echeance: "Hebdomadaire" },
            { action: "Documenter les procédures de reprise sur incident", responsable: "Équipe technique", echeance: "20/06/2026" },
          ],
          risques: [
            { description: "Régression sur les flux déjà stabilisés", impact: "MOYEN", probabilite: "FAIBLE" },
            { description: "Astreinte prolongée épuisant l'équipe", impact: "MOYEN", probabilite: "MOYENNE" },
            { description: "Report de la fin de stabilisation au-delà de juin", impact: "FAIBLE", probabilite: "MOYENNE" },
          ],
          besoinsSupport: besoins({
            expertiseTechnique: { applicable: true, commentaire: "Suivi de clôture de la mission de l'expert performance." },
          }),
          iaUtilisee: "EN_COURS",
          iaPhases: iaPhases({ tests: true, support: true }),
          iaGainEstime: "CINQ_DIX",
          iaCasUsagePrincipal: "Analyse automatisée des logs d'incident",
          iaFrein: "OUTILS_NON_DISPONIBLES",
          iaFreinCommentaire: "Licences de l'outil d'analyse de logs encore en cours de validation achats.",
        },
      },
      {
        year: 2026,
        month: 6,
        jourMiseAJour: 29,
        data: {
          phaseActuelle: "RUN",
          statutGlobal: "OK",
          relationClient: "SAINE",
          relationClientCommentaire: "Confiance restaurée, le client salue la réactivité de l'équipe.",
          meteoEquipe: "ENGAGEE",
          signauxFaibles: "",
          departsCles: "",
          causes: causes(),
          difficultesMaitrisables: "",
          difficultesNonMaitrisables: "",
          ecartMargePct: -2,
          ecartMargeCommentaire: "Quasi résorbé.",
          ecartPlanningJours: 0,
          ecartPlanningCommentaire: "",
          chargeReevalueePct: 0,
          chargeReevalueeCommentaire: "",
          avancementPct: 90,
          avancementCommentaire: "Tous les flux stabilisés, passage en mode run standard.",
          planRemediationDefini: false,
          statutPlan: null,
          actions: [
            { action: "Transférer le suivi en run standard", responsable: "Claire Dubois", echeance: "01/07/2026" },
            { action: "", responsable: "", echeance: "" },
            { action: "", responsable: "", echeance: "" },
          ],
          risques: [
            { description: "Nouvelle montée de charge à la clôture annuelle", impact: "FAIBLE", probabilite: "FAIBLE" },
            { description: "", impact: undefined, probabilite: undefined },
            { description: "", impact: undefined, probabilite: undefined },
          ],
          besoinsSupport: besoins(),
          iaUtilisee: "OUI",
          iaPhases: iaPhases({ support: true }),
          iaGainEstime: "CINQ_DIX",
          iaCasUsagePrincipal: "Analyse automatisée des logs d'incident généralisée en run",
          iaFrein: "AUCUN",
          iaFreinCommentaire: "",
        },
      },
    ],
  },
];

async function main() {
  console.log("Suppression des anciennes données de test...");
  await prisma.fiche.deleteMany({});
  await prisma.projet.deleteMany({});

  for (const p of projets) {
    const projet = await prisma.projet.create({
      data: {
        nom: p.nom,
        client: p.client,
        responsablePilotage: p.responsablePilotage,
        responsableEmail: p.responsableEmail,
        typeProjet: p.typeProjet,
      },
    });
    console.log(`Projet créé : ${p.nom} (${p.client})`);

    for (const mois of p.mois) {
      await prisma.fiche.create({
        data: {
          projetId: projet.id,
          periode: periode(mois.year, mois.month),
          dateMiseAJour: dateDansLeMois(mois.year, mois.month, mois.jourMiseAJour),
          statut: "SOUMISE",
          notifieLe: null,
          projet: p.nom,
          client: p.client,
          responsablePilotage: p.responsablePilotage,
          responsableEmail: p.responsableEmail,
          typeProjet: p.typeProjet,
          ...mois.data,
        } as Prisma.FicheUncheckedCreateInput,
      });
      console.log(`  Fiche ${mois.month}/${mois.year} créée.`);
    }
  }

  console.log("Terminé.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
