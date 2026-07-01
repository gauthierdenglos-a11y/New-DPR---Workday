-- CreateTable
CREATE TABLE "Fiche" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "dateMiseAJour" DATETIME NOT NULL,
    "projet" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "responsablePilotage" TEXT NOT NULL,
    "typeProjet" TEXT NOT NULL,
    "phaseActuelle" TEXT NOT NULL,
    "statutGlobal" TEXT NOT NULL,
    "relationClient" TEXT NOT NULL,
    "relationClientCommentaire" TEXT,
    "meteoEquipe" TEXT NOT NULL,
    "signauxFaibles" TEXT,
    "causes" JSONB NOT NULL,
    "ecartMargePct" REAL,
    "ecartMargeCommentaire" TEXT,
    "ecartPlanningJours" REAL,
    "ecartPlanningCommentaire" TEXT,
    "chargeReevalueePct" REAL,
    "chargeReevalueeCommentaire" TEXT,
    "avancementPct" REAL,
    "avancementCommentaire" TEXT,
    "planRemediationDefini" BOOLEAN NOT NULL,
    "statutPlan" TEXT,
    "actions" JSONB NOT NULL,
    "risques" JSONB NOT NULL,
    "besoinsSupport" JSONB NOT NULL
);

-- CreateIndex
CREATE INDEX "Fiche_projet_idx" ON "Fiche"("projet");

-- CreateIndex
CREATE INDEX "Fiche_dateMiseAJour_idx" ON "Fiche"("dateMiseAJour");
