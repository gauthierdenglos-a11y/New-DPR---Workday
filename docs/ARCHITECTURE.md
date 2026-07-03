# Architecture — ProjetCommand (fiche-flash-projet)

> Ce document donne à un développeur qui découvre le projet une vue d'ensemble
> suffisante pour naviguer dans le code et l'étendre en confiance.
>
> **Contexte** : la V1 a été développée par un chef de projet non-développeur,
> en "vibe coding" (itérations rapides avec un assistant IA, sans revue de
> code ni tests automatisés). Le résultat est fonctionnel et plutôt propre,
> mais il n'y a **aucun test**, **aucune CI**, et **aucune authentification**.
> Voir [Dette technique & points d'attention](#dette-technique--points-dattention)
> avant de construire dessus.

## 1. Le produit

**ProjetCommand** est un outil de suivi mensuel de projets ("fiches flash
projet") pour une DSI/ESN. Chaque projet suivi a, une fois par mois, une
"fiche" à remplir par son responsable de pilotage : statut global, relation
client, causes de dérive, plan d'action, risques, besoins de support, usage
de l'IA. Le mois clos, une nouvelle fiche est ouverte automatiquement pour le
mois suivant (pré-remplie avec les réponses précédentes) et le responsable
est notifié par email.

Le portefeuille de fiches alimente ensuite un dashboard, une page
statistiques et (à terme) des pages Risques / Plan d'action / Rapports
actuellement en "Coming soon".

## 2. Stack technique

| Domaine | Choix |
|---|---|
| Framework | **Next.js 16.2.9** (App Router, Turbopack) — ⚠️ voir avertissement ci-dessous |
| UI | React 19, Tailwind CSS v4, [shadcn/ui](components/ui) (base-ui headless), lucide-react |
| Formulaires | react-hook-form + zod (validation partagée client/serveur) |
| Base de données | PostgreSQL 16, via **Prisma 7** (`@prisma/adapter-pg`, driver natif, pas de binaire Rust) |
| Graphiques | recharts (page statistiques) |
| PDF | `@react-pdf/renderer` (export fiche en PDF) |
| Email | nodemailer (SMTP fourni par la DSI, optionnel en dev) |
| Notifications UI | sonner (toasts) |

### ⚠️ Avertissement Next.js

Le fichier [`AGENTS.md`](../AGENTS.md) à la racine du repo prévient que cette
version de Next.js contient des ruptures par rapport aux habitudes connues :
consulter `node_modules/next/dist/docs/` avant d'écrire du code qui touche au
routing, aux server actions ou au cache. Prisma est en v7 avec le nouveau
`generator client` (sortie dans `lib/generated/prisma`, **ne pas éditer ces
fichiers**, ils sont regénérés par `npx prisma generate` / `migrate`).

## 3. Structure des dossiers

```
app/                          # Routes (App Router)
├── page.tsx                  # "/" → redirect vers /fiches
├── layout.tsx                # Layout racine (fonts, Toaster), pas de <html> par page
├── dashboard/page.tsx        # Tableau de bord
├── fiches/
│   ├── page.tsx               # Liste des fiches, groupées par projet (courante + historique)
│   ├── nouveau/page.tsx       # Création d'un nouveau projet + sa 1ère fiche
│   └── [id]/page.tsx          # Détail / édition d'une fiche
├── statistiques/page.tsx      # Dashboard statistiques (voir modèle de données)
├── plan-action/page.tsx       # Placeholder "Coming soon"
├── risques/page.tsx           # Placeholder "Coming soon"
├── rapports/page.tsx          # Placeholder "Coming soon"
└── api/
    ├── cron/cloture-mensuelle/route.ts   # Déclenche la clôture mensuelle (POST/GET, protégé par token)
    └── fiches/[id]/pdf/route.ts          # Génère le PDF d'une fiche

components/
├── layout/                   # AppShell, Navbar, Sidebar, MobileNav, ComingSoon
├── fiche/                    # Formulaire de fiche, tableau de liste, rendu PDF
├── statistiques/             # Filtres + sections du dashboard statistiques
└── ui/                       # Composants shadcn/ui génériques (button, select, table, ...)

lib/
├── actions/
│   ├── fiche.ts               # Server actions CRUD fiche + requêtes de lecture
│   └── cycle.ts                # Clôture mensuelle : génération + notification
├── validations/fiche.ts       # Schéma zod (source de vérité des enums, libellés FR, valeurs par défaut)
├── email.ts                    # Envoi SMTP (no-op si SMTP_HOST absent)
├── fiche-mapper.ts             # Fiche Prisma <-> valeurs de formulaire
├── fiche-pdf.tsx                # Document react-pdf
├── fiche-statut.ts              # Aide au calcul du statut d'une fiche
├── fiches-list-utils.ts         # Filtres/tri de la page /fiches
├── statistiques-utils.ts        # Agrégation + filtres de la page /statistiques
├── periode.ts                    # Utilitaires de calcul de mois ("période" = 1er du mois)
├── prisma.ts                     # Client Prisma singleton (adapter pg)
└── generated/prisma/              # ⚠️ généré par Prisma — ne pas modifier à la main

prisma/
├── schema.prisma               # Source de vérité du modèle de données
├── migrations/                  # Historique des migrations SQL
└── README-DB.md                 # Démarrage de la base locale (Docker)
```

Il n'y a pas de dossier `app/api` pour le CRUD applicatif : toute la logique
métier passe par des **Server Actions** (`"use server"` en tête de fichier
dans `lib/actions/`), appelées directement depuis les Server/Client
Components. Les deux seules routes API HTTP classiques sont le cron de
clôture mensuelle et l'export PDF.

## 4. Flux de données

1. Les pages sous `app/` sont des **Server Components async** par défaut :
   elles appellent directement `lib/actions/*` (qui utilisent Prisma côté
   serveur) et passent les données déjà sérialisées aux composants clients.
2. Les composants interactifs (formulaires, filtres, tableaux triables) sont
   des **Client Components** (`"use client"`), le plus souvent dans
   `components/`. Ils reçoivent les données en props et font le
   filtrage/tri/agrégation **côté client** avec `useMemo` (aucun état serveur
   ni pagination — cohérent avec un volume de données faible aujourd'hui,
   mais à surveiller si le portefeuille de projets grossit).
3. Les écritures (créer/modifier une fiche, déclencher la clôture) passent
   par les Server Actions dans `lib/actions/`, qui valident avec le schéma
   zod de `lib/validations/fiche.ts`, appellent Prisma, puis
   `revalidatePath()` pour rafraîchir le cache Next et `redirect()`.
4. `lib/validations/fiche.ts` est **la source de vérité** des enums et de
   leurs libellés français (ex. `STATUT_GLOBAL_LABELS`) : le schéma Prisma
   définit le stockage, ce fichier définit la validation et l'affichage.

## 5. Concepts métier clés

### Projet vs Fiche

- **`Projet`** : identité stable d'un projet suivi (nom, client, responsable
  de pilotage, type). Un projet est unique par couple `(nom, client)`.
- **`Fiche`** : un état mensuel d'un projet (`@@unique([projetId, periode])`
  — une seule fiche par projet et par mois). C'est la table qui porte
  toute l'information métier (statut, dérive, plan d'action, risques...).

### Fiche "courante" vs "historisée"

Il n'existe **pas de hiérarchie de projets parent/enfant**. Ce qui ressemble
à des "fiches filles" dans l'app, ce sont les fiches des mois précédents
d'un même projet : dès qu'une fiche plus récente existe pour ce projet, la
fiche devient **historisée** (lecture seule) — voir `estFicheHistorisee()`
dans `lib/actions/fiche.ts`. La fiche du mois le plus récent est la
**courante**, seule modifiable.

⚠️ Point corrigé récemment : les vues qui font des agrégats "portefeuille"
(ex. `/statistiques`) doivent utiliser `listFichesCourantes()` (une ligne par
projet) et **non** `listFiches()` (toutes les fiches, tous les mois), sous
peine de compter plusieurs fois un même projet.

### Clôture mensuelle

`generateMonthlyFiches()` (`lib/actions/cycle.ts`) :
1. Pour chaque `Projet`, si aucune fiche n'existe déjà pour le mois en cours
   et qu'une fiche précédente existe, crée une nouvelle fiche pré-remplie
   avec les valeurs de la précédente, statut `A_COMPLETER`.
2. Envoie un email au responsable de pilotage avec le lien direct vers la
   fiche à mettre à jour (`lib/email.ts`).

Déclenchement en production : `POST /api/cron/cloture-mensuelle` avec le
header `Authorization: Bearer <CRON_SECRET>`, appelé par un ordonnanceur
externe (cron DSI, Vercel Cron...). Un bouton "Simuler mois suivant" dans
l'UI (`simulerMoisSuivant()`) permet de tester le mécanisme sans attendre le
vrai changement de mois ; il redirige toutes les notifications vers une
adresse email fixe codée en dur dans `cycle.ts`.

## 6. Authentification

**Il n'y a aujourd'hui aucune authentification.** Le bouton "Déconnexion" de
la sidebar est désactivé avec le tooltip "Authentification à venir", et il
n'existe pas de `middleware.ts`. La seule protection de l'application est le
token partagé (`CRON_SECRET`) sur la route de clôture mensuelle. À traiter
avant toute mise en production réelle multi-utilisateurs.

## 7. Dette technique & points d'attention

- **Aucun test** (unitaire, intégration, e2e) et **aucune CI** (`.github/`
  absent). `npm run lint` (ESLint) et `tsc --noEmit` sont les seuls filets de
  sécurité actuels.
- **Pas d'authentification / autorisation** (cf. §6).
- **Pas de pagination** sur les listes (fiches, statistiques) : tout est
  chargé et filtré côté client. Acceptable au volume actuel, à revoir si le
  nombre de projets/fiches augmente significativement.
- Les pages **Risques**, **Plan d'action** et **Rapports** sont des
  placeholders (`ComingSoon`) alors que les données existent déjà en base
  (`Fiche.risques`, `Fiche.actions`, `Fiche.besoinsSupport` en JSON) : c'est
  probablement la suite logique du développement.
- Champs numériques (`ecartMargePct`, `avancementPct`...) saisis comme
  `string` dans le formulaire puis convertis en `number|null` à la
  sauvegarde (`toNumberOrNull` dans `lib/actions/fiche.ts`) — pattern à
  connaître avant de toucher au formulaire.
- Plusieurs champs sont dupliqués entre `Projet` (identité) et `Fiche`
  (photocopie du mois : `projet`, `client`, `responsablePilotage`,
  `responsableEmail`, `typeProjet`) — voulu pour garder l'historique intact
  même si le projet est renommé depuis, mais source de désynchronisation
  potentielle à documenter si un futur dev modifie l'un sans l'autre.

## 8. Démarrage local

```bash
docker compose up -d          # Postgres local (voir prisma/README-DB.md)
cp .env.example .env          # puis compléter si besoin (SMTP, CRON_SECRET...)
npm install
npx prisma migrate dev
npm run dev
```

Voir [`docs/MODELE-DONNEES.md`](./MODELE-DONNEES.md) pour le schéma complet
de la base et les recommandations pour l'exposer à PowerBI.
