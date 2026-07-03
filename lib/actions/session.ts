"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ROLE_COOKIE, EMAIL_COOKIE, type Role } from "@/lib/session";

// Purement local (mode de test avant SSO) : pas de donnée sensible, juste
// confortable pour ne pas re-choisir son rôle à chaque visite.
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export async function setSession(role: Role, email: string): Promise<void> {
  const store = await cookies();
  store.set(ROLE_COOKIE, role, { maxAge: COOKIE_MAX_AGE, sameSite: "lax" });

  if (role === "UTILISATEUR" && email) {
    store.set(EMAIL_COOKIE, email, { maxAge: COOKIE_MAX_AGE, sameSite: "lax" });
  } else {
    store.delete(EMAIL_COOKIE);
  }

  revalidatePath("/", "layout");
}
