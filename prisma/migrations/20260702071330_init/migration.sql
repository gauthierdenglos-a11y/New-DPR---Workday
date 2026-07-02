-- CreateEnum
CREATE TYPE "TypeProjet" AS ENUM ('BUILD', 'RUN', 'FORFAIT', 'REGIE', 'MIXTE');

-- CreateEnum
CREATE TYPE "Phase" AS ENUM ('CADRAGE', 'BUILD', 'RECETTE', 'DEPLOIEMENT', 'RUN');

-- CreateEnum
CREATE TYPE "StatutGlobal" AS ENUM ('CRITIQUE', 'WARNING', 'SOUS_CONTROLE', 'OK');

-- CreateEnum
CREATE TYPE "RelationClient" AS ENUM ('DEGRADEE', 'TENDUE', 'SAINE');

-- CreateEnum
CREATE TYPE "MeteoEquipe" AS ENUM ('DESENGAGEMENT', 'FRAGILE', 'ENGAGEE');

-- CreateEnum
CREATE TYPE "StatutPlan" AS ENUM ('NON_LANCE', 'EN_COURS', 'PREMIERS_RESULTATS', 'INEFFICACE');

-- CreateTable
CREATE TABLE "Fiche" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "dateMiseAJour" TIMESTAMP(3) NOT NULL,
    "projet" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "responsablePilotage" TEXT NOT NULL,
    "typeProjet" "TypeProjet" NOT NULL,
    "phaseActuelle" "Phase" NOT NULL,
    "statutGlobal" "StatutGlobal" NOT NULL,
    "relationClient" "RelationClient" NOT NULL,
    "relationClientCommentaire" TEXT,
    "meteoEquipe" "MeteoEquipe" NOT NULL,
    "signauxFaibles" TEXT,
    "causes" JSONB NOT NULL,
    "ecartMargePct" DOUBLE PRECISION,
    "ecartMargeCommentaire" TEXT,
    "ecartPlanningJours" DOUBLE PRECISION,
    "ecartPlanningCommentaire" TEXT,
    "chargeReevalueePct" DOUBLE PRECISION,
    "chargeReevalueeCommentaire" TEXT,
    "avancementPct" DOUBLE PRECISION,
    "avancementCommentaire" TEXT,
    "planRemediationDefini" BOOLEAN NOT NULL,
    "statutPlan" "StatutPlan",
    "actions" JSONB NOT NULL,
    "risques" JSONB NOT NULL,
    "besoinsSupport" JSONB NOT NULL,

    CONSTRAINT "Fiche_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Fiche_projet_idx" ON "Fiche"("projet");

-- CreateIndex
CREATE INDEX "Fiche_dateMiseAJour_idx" ON "Fiche"("dateMiseAJour");
