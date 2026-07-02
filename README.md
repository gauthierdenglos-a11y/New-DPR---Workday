This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Clôture mensuelle & notifications

Chaque mois, à la clôture, chaque projet suivi doit avoir sa fiche mise à jour. Deux mécanismes automatisent ça :

- **Historisation** : la première fiche d'un projet se crée via "Nouveau Projet". Les fiches suivantes ne se créent plus manuellement : `generateMonthlyFiches()` (`lib/actions/cycle.ts`) ouvre, une fois par mois et par projet, une nouvelle fiche préremplie avec les réponses du mois précédent (statut `À compléter`). Le DP/CP n'a plus qu'à mettre à jour les champs qui ont changé.
- **Notification email** : à la création de chaque fiche du mois, un email est envoyé au responsable pilotage du projet avec le lien direct vers sa fiche (`lib/email.ts`, SMTP via `nodemailer`).

Le déclenchement mensuel se fait via un appel HTTP externe (cron DSI, tâche planifiée, Vercel Cron...) :

```
POST /api/cron/cloture-mensuelle
Authorization: Bearer <CRON_SECRET>
```

Variables d'environnement à renseigner (voir `.env.example`) :

- `CRON_SECRET` : jeton partagé exigé par la route (celle-ci refuse toute requête tant qu'il n'est pas configuré).
- `APP_BASE_URL` : URL publique utilisée pour construire le lien dans l'email.
- `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` / `SMTP_USER` / `SMTP_PASSWORD` / `SMTP_FROM` : relais SMTP fourni par la DSI. Sans `SMTP_HOST`, les fiches du mois sont générées mais aucun email n'est envoyé (visible dans la réponse JSON de la route).

Cette route est protégée par un jeton partagé en attendant la mise en place du SSO, qui permettra à terme d'identifier plus finement qui déclenche quoi.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
