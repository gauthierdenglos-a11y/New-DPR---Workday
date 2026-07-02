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
