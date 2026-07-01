# Base de données locale

**Cible : PostgreSQL** (via `docker-compose.yml` à la racine). C'est la base à utiliser dès que Docker Desktop est débloqué par la DSI (connexion à l'organisation `groupeonepoint` requise pour pull l'image `postgres:16-alpine`).

**Contournement temporaire (actuel)** : en attendant le déblocage, le projet tourne en local avec **SQLite** (`../dev.db`, ignoré par git) pour ne pas bloquer le développement. Le schéma (`schema.prisma`) est identique (mêmes modèles/enums/champs Json), seul le `datasource.provider` et le `DATABASE_URL` changent.

## Revenir à Postgres dès que possible

1. Démarrer Docker Desktop, se connecter avec le compte pro, puis : `docker compose up -d`
2. Dans `prisma/schema.prisma` : remettre `provider = "postgresql"` sur le bloc `datasource db`
3. Dans `.env` : remettre `DATABASE_URL="postgresql://fiche_flash:fiche_flash@localhost:5432/fiche_flash?schema=public"`
4. Supprimer `prisma/migrations/` (les migrations SQLite ne sont pas compatibles Postgres) et régénérer : `npx prisma migrate dev --name init`
5. Dans `lib/prisma.ts` : remplacer l'adapter `PrismaBetterSqlite3` par `PrismaPg` (package `@prisma/adapter-pg`, déjà installé) :
   ```ts
   import { PrismaPg } from "@prisma/adapter-pg";
   const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
   ```
