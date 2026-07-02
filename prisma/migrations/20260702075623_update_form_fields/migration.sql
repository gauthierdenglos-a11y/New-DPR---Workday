-- Migration manuelle : refonte des enums TypeProjet / Phase + nouveaux champs
-- (formulaire, Météo équipe, Compréhension de la dérive, section IA)

-- ---------------------------------------------------------------------------
-- TypeProjet : BUILD, RUN, FORFAIT, REGIE, MIXTE -> TM, FORFAIT
-- ---------------------------------------------------------------------------
ALTER TYPE "TypeProjet" RENAME TO "TypeProjet_old";
CREATE TYPE "TypeProjet" AS ENUM ('TM', 'FORFAIT');

ALTER TABLE "Fiche" ALTER COLUMN "typeProjet" TYPE "TypeProjet" USING (
  CASE "typeProjet"::text
    WHEN 'FORFAIT' THEN 'FORFAIT'
    ELSE 'TM'
  END
)::"TypeProjet";

DROP TYPE "TypeProjet_old";

-- ---------------------------------------------------------------------------
-- Phase : CADRAGE, BUILD, RECETTE, DEPLOIEMENT, RUN -> BUILD, RUN, MIXTE
-- ---------------------------------------------------------------------------
ALTER TYPE "Phase" RENAME TO "Phase_old";
CREATE TYPE "Phase" AS ENUM ('BUILD', 'RUN', 'MIXTE');

ALTER TABLE "Fiche" ALTER COLUMN "phaseActuelle" TYPE "Phase" USING (
  CASE "phaseActuelle"::text
    WHEN 'RUN' THEN 'RUN'
    ELSE 'BUILD'
  END
)::"Phase";

DROP TYPE "Phase_old";

-- ---------------------------------------------------------------------------
-- Nouveaux champs texte libre
-- ---------------------------------------------------------------------------
ALTER TABLE "Fiche" ADD COLUMN "departsCles" TEXT;
ALTER TABLE "Fiche" ADD COLUMN "difficultesMaitrisables" TEXT;
ALTER TABLE "Fiche" ADD COLUMN "difficultesNonMaitrisables" TEXT;

-- ---------------------------------------------------------------------------
-- Section E. Intelligence Artificielle
-- ---------------------------------------------------------------------------
CREATE TYPE "IaUtilisee" AS ENUM ('OUI', 'EN_COURS', 'NON');
CREATE TYPE "GainIa" AS ENUM ('ZERO', 'MOINS_5', 'CINQ_DIX', 'DIX_VINGT', 'PLUS_20');
CREATE TYPE "FreinIa" AS ENUM (
  'MANQUE_TEMPS',
  'MANQUE_COMPETENCES',
  'CONTRAINTES_CLIENT',
  'SECURITE_CONFIDENTIALITE',
  'OUTILS_NON_DISPONIBLES',
  'AUCUN',
  'AUTRE'
);

ALTER TABLE "Fiche" ADD COLUMN "iaUtilisee" "IaUtilisee" NOT NULL DEFAULT 'NON';
ALTER TABLE "Fiche" ADD COLUMN "iaPhases" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "Fiche" ADD COLUMN "iaGainEstime" "GainIa" NOT NULL DEFAULT 'ZERO';
ALTER TABLE "Fiche" ADD COLUMN "iaCasUsagePrincipal" TEXT;
ALTER TABLE "Fiche" ADD COLUMN "iaFrein" "FreinIa" NOT NULL DEFAULT 'AUCUN';
