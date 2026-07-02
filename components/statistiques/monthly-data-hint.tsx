export function MonthlyDataHint({ monthCount }: { monthCount: number }) {
  if (monthCount >= 2) return null;
  return (
    <p className="mt-2 text-xs text-muted-foreground">
      Historique insuffisant pour une courbe d&apos;évolution ({monthCount} mois de données
      disponible{monthCount > 1 ? "s" : ""}). La tendance s&apos;affinera au fil des prochaines
      fiches.
    </p>
  );
}
