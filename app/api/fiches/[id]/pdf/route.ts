import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { estFicheHistorisee } from "@/lib/actions/fiche";
import { FichePdfDocument } from "@/lib/fiche-pdf";
import { estAutorise, getSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const [session, fiche] = await Promise.all([
    getSession(),
    prisma.fiche.findUnique({ where: { id } }),
  ]);
  if (!fiche) {
    return NextResponse.json({ error: "Fiche introuvable" }, { status: 404 });
  }
  if (!estAutorise(session, fiche.responsableEmail)) {
    return NextResponse.json({ error: "Fiche introuvable" }, { status: 404 });
  }

  const historisee = await estFicheHistorisee(fiche);
  const buffer = await renderToBuffer(FichePdfDocument({ fiche, historisee }));
  const nomFichier = `fiche-${fiche.projet}-${fiche.periode.toISOString().slice(0, 7)}.pdf`
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-");

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${nomFichier}"`,
    },
  });
}
