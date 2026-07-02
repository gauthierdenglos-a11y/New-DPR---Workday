export function debutDuMois(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

export function moisSuivant(periode: Date): Date {
  return new Date(Date.UTC(periode.getUTCFullYear(), periode.getUTCMonth() + 1, 1));
}

export function formatPeriodeFr(periode: Date): string {
  return periode.toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

// Une fiche est historisée dès que sa période est antérieure au mois en
// cours : le mois courant est passé, elle devient consultable en lecture
// seule (le mois en cours reste modifiable jusqu'à la prochaine clôture).
export function estHistorisee(periode: Date, now: Date = new Date()): boolean {
  return periode.getTime() < debutDuMois(now).getTime();
}
