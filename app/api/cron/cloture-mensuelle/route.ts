import { NextResponse } from "next/server";
import { generateMonthlyFiches } from "@/lib/actions/cycle";

export const dynamic = "force-dynamic";

// Déclenché mensuellement par un ordonnanceur externe (cron DSI, Vercel Cron...)
// juste après la clôture. Protégé par CRON_SECRET tant que le SSO n'est pas en place.
async function handleCloture(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET n'est pas configuré côté serveur." },
      { status: 500 },
    );
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const resultats = await generateMonthlyFiches();
  return NextResponse.json({
    generees: resultats.length,
    notifiees: resultats.filter((r) => r.email.sent).length,
    details: resultats,
  });
}

export async function POST(request: Request) {
  return handleCloture(request);
}

export async function GET(request: Request) {
  return handleCloture(request);
}
