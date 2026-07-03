import { cookies } from "next/headers";

export type Role = "ADMIN" | "UTILISATEUR";

export type Session = {
  role: Role;
  email: string;
};

export const ROLE_COOKIE = "pc_role";
export const EMAIL_COOKIE = "pc_email";

// Tant qu'aucun choix n'a été fait dans le sélecteur de rôle, on reste en
// administrateur pour ne pas casser l'usage actuel de l'app.
const DEFAULT_SESSION: Session = { role: "ADMIN", email: "" };

// ---------------------------------------------------------------------------
// Stand-in avant SSO
// ---------------------------------------------------------------------------
// Le reste de l'application ne doit connaître l'utilisateur courant qu'à
// travers `getSession()`. Aujourd'hui elle lit un cookie posé par le
// sélecteur de rôle (`components/layout/role-switcher.tsx`, via la Server
// Action `setSession` dans `lib/actions/session.ts`). Quand le SSO sera
// branché, il suffira de remplacer le corps de cette fonction par la lecture
// du rôle/email portés par le token/les claims SSO — tous les appelants
// (`estAutorise`, `requireAdmin`, les pages) continueront de fonctionner
// sans changement.
export async function getSession(): Promise<Session> {
  const store = await cookies();
  const role = store.get(ROLE_COOKIE)?.value;
  const email = store.get(EMAIL_COOKIE)?.value ?? "";

  if (role !== "ADMIN" && role !== "UTILISATEUR") return DEFAULT_SESSION;
  if (role === "UTILISATEUR" && !email) return DEFAULT_SESSION;
  return { role, email };
}

// Un administrateur voit tout. Un utilisateur standard ne voit que ce qui
// est rattaché à son email (le responsable pilotage d'un projet/d'une fiche).
export function estAutorise(session: Session, responsableEmail: string): boolean {
  return session.role === "ADMIN" || session.email === responsableEmail;
}

// À utiliser en tête des Server Actions réservées aux administrateurs
// (création de projet, déclenchement de la clôture mensuelle...).
export async function requireAdmin(): Promise<Session> {
  const session = await getSession();
  if (session.role !== "ADMIN") {
    throw new Error("Action réservée aux administrateurs.");
  }
  return session;
}
