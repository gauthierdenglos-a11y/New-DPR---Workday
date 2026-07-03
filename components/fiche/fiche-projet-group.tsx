"use client";

import { type ReactNode, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { StatutGlobalBadge } from "@/components/fiche/status-badge";
import { FicheStatutBadge } from "@/components/fiche/fiche-statut-badge";
import type { Fiche } from "@/lib/generated/prisma/client";
import { formatPeriodeFr } from "@/lib/periode";
import { PHASE_LABELS } from "@/lib/validations/fiche";

function FicheRow({
  fiche,
  readOnly,
  toggle,
}: {
  fiche: Fiche;
  readOnly: boolean;
  toggle?: ReactNode;
}) {
  return (
    <TableRow className={readOnly ? "bg-muted/30" : undefined}>
      <TableCell className="font-medium">
        <div className="flex items-center gap-1.5">
          {toggle ?? <span className="inline-block size-5" />}
          <span className={readOnly ? "text-muted-foreground" : undefined}>
            {fiche.projet}
          </span>
        </div>
      </TableCell>
      <TableCell>{fiche.client}</TableCell>
      <TableCell>{fiche.responsablePilotage}</TableCell>
      <TableCell className="capitalize">{formatPeriodeFr(fiche.periode)}</TableCell>
      <TableCell>{fiche.updatedAt.toLocaleDateString("fr-FR")}</TableCell>
      <TableCell>{PHASE_LABELS[fiche.phaseActuelle]}</TableCell>
      <TableCell>
        <StatutGlobalBadge value={fiche.statutGlobal} />
      </TableCell>
      <TableCell>
        <FicheStatutBadge value={fiche.statut} />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            nativeButton={false}
            render={<Link href={`/fiches/${fiche.id}`} />}
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:bg-blue-600/10 hover:text-blue-600"
          >
            {readOnly ? "Consulter" : "Modifier"}
          </Button>
          <Button
            nativeButton={false}
            render={<a href={`/api/fiches/${fiche.id}/pdf`} />}
            variant="ghost"
            size="sm"
          >
            PDF
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export function FicheProjetGroup({
  courante,
  historisees,
}: {
  courante: Fiche;
  historisees: Fiche[];
}) {
  const [deplie, setDeplie] = useState(false);
  const aDeHistorique = historisees.length > 0;

  return (
    <>
      <FicheRow
        fiche={courante}
        readOnly={false}
        toggle={
          aDeHistorique ? (
            <button
              type="button"
              onClick={() => setDeplie((v) => !v)}
              aria-expanded={deplie}
              aria-label={
                deplie
                  ? "Masquer les fiches historisées"
                  : `Afficher les ${historisees.length} fiche(s) historisée(s)`
              }
              className="flex size-5 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {deplie ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
            </button>
          ) : undefined
        }
      />
      {deplie &&
        historisees.map((fiche) => (
          <FicheRow key={fiche.id} fiche={fiche} readOnly />
        ))}
    </>
  );
}
