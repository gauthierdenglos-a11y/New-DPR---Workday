# Base de données locale

PostgreSQL via Docker Compose (`docker-compose.yml` à la racine).

## Démarrer

```
docker compose up -d
npx prisma migrate dev
```

`DATABASE_URL` (dans `.env`) pointe vers `postgresql://fiche_flash:fiche_flash@localhost:5432/fiche_flash?schema=public`.
