-- CreateEnum
CREATE TYPE "FicheStatut" AS ENUM ('A_COMPLETER', 'SOUMISE');

-- CreateTable
CREATE TABLE "Projet" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nom" TEXT NOT NULL,
    "client" TEXT NOT NULL,
    "responsablePilotage" TEXT NOT NULL,
    "responsableEmail" TEXT NOT NULL,
    "typeProjet" "TypeProjet" NOT NULL,

    CONSTRAINT "Projet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Projet_nom_client_key" ON "Projet"("nom", "client");

-- AlterTable: add new Fiche columns as nullable / defaulted first so we can backfill
ALTER TABLE "Fiche"
    ADD COLUMN "projetId" TEXT,
    ADD COLUMN "periode" TIMESTAMP(3),
    ADD COLUMN "statut" "FicheStatut" NOT NULL DEFAULT 'SOUMISE',
    ADD COLUMN "notifieLe" TIMESTAMP(3),
    ADD COLUMN "responsableEmail" TEXT NOT NULL DEFAULT '';

-- Backfill: create one Projet per distinct (projet, client) pair already present in Fiche,
-- using the most recent row's responsable/type as the baseline.
INSERT INTO "Projet" ("id", "createdAt", "updatedAt", "nom", "client", "responsablePilotage", "responsableEmail", "typeProjet")
SELECT
    md5(sub.projet || '||' || sub.client),
    now(),
    now(),
    sub.projet,
    sub.client,
    sub."responsablePilotage",
    '',
    sub."typeProjet"
FROM (
    SELECT DISTINCT ON (projet, client) projet, client, "responsablePilotage", "typeProjet"
    FROM "Fiche"
    ORDER BY projet, client, "dateMiseAJour" DESC
) sub;

-- Backfill: link every existing Fiche to its Projet and derive its period from dateMiseAJour
UPDATE "Fiche" f
SET "projetId" = p.id,
    "periode" = date_trunc('month', f."dateMiseAJour")
FROM "Projet" p
WHERE p."nom" = f.projet AND p."client" = f.client;

-- AlterTable: now that every row is backfilled, enforce NOT NULL
ALTER TABLE "Fiche"
    ALTER COLUMN "projetId" SET NOT NULL,
    ALTER COLUMN "periode" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Fiche" ADD CONSTRAINT "Fiche_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE UNIQUE INDEX "Fiche_projetId_periode_key" ON "Fiche"("projetId", "periode");

-- CreateIndex
CREATE INDEX "Fiche_statut_idx" ON "Fiche"("statut");
