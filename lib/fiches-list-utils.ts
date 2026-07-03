import type { FicheGroupe } from "@/lib/actions/fiche";

export type FichesFilters = {
  search: string;
  client: string;
  responsable: string;
  typeProjet: string;
  phase: string;
  statutGlobal: string;
  statut: string;
};

export const DEFAULT_FICHES_FILTERS: FichesFilters = {
  search: "",
  client: "all",
  responsable: "all",
  typeProjet: "all",
  phase: "all",
  statutGlobal: "all",
  statut: "all",
};

export type FichesSort =
  | "periode_desc"
  | "periode_asc"
  | "projet_asc"
  | "projet_desc"
  | "client_asc"
  | "updatedAt_desc"
  | "statutGlobal_priorite";

export const DEFAULT_FICHES_SORT: FichesSort = "periode_desc";

export const FICHES_SORT_LABELS: Record<FichesSort, string> = {
  periode_desc: "Période (récent → ancien)",
  periode_asc: "Période (ancien → récent)",
  projet_asc: "Projet (A → Z)",
  projet_desc: "Projet (Z → A)",
  client_asc: "Client (A → Z)",
  updatedAt_desc: "Dernière modification (récent → ancien)",
  statutGlobal_priorite: "Statut global (criticité)",
};

// Ordre du plus urgent au plus rassurant, pour le tri "criticité".
const STATUT_GLOBAL_PRIORITE = ["CRITIQUE", "WARNING", "SOUS_CONTROLE", "OK"] as const;

export type FichesFilterOptions = {
  clients: string[];
  responsables: string[];
};

export function computeFichesFilterOptions(groupes: FicheGroupe[]): FichesFilterOptions {
  return {
    clients: Array.from(new Set(groupes.map((g) => g.courante.client))).sort(),
    responsables: Array.from(
      new Set(groupes.map((g) => g.courante.responsablePilotage)),
    ).sort(),
  };
}

export function applyFichesFilters(
  groupes: FicheGroupe[],
  filters: FichesFilters,
): FicheGroupe[] {
  const search = filters.search.trim().toLowerCase();
  return groupes.filter(({ courante }) => {
    if (search) {
      const haystack = `${courante.projet} ${courante.client}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return (
      (filters.client === "all" || courante.client === filters.client) &&
      (filters.responsable === "all" ||
        courante.responsablePilotage === filters.responsable) &&
      (filters.typeProjet === "all" || courante.typeProjet === filters.typeProjet) &&
      (filters.phase === "all" || courante.phaseActuelle === filters.phase) &&
      (filters.statutGlobal === "all" || courante.statutGlobal === filters.statutGlobal) &&
      (filters.statut === "all" || courante.statut === filters.statut)
    );
  });
}

export function sortFicheGroupes(groupes: FicheGroupe[], sort: FichesSort): FicheGroupe[] {
  const sorted = [...groupes];
  switch (sort) {
    case "periode_asc":
      return sorted.sort(
        (a, b) => a.courante.periode.getTime() - b.courante.periode.getTime(),
      );
    case "projet_asc":
      return sorted.sort((a, b) => a.courante.projet.localeCompare(b.courante.projet));
    case "projet_desc":
      return sorted.sort((a, b) => b.courante.projet.localeCompare(a.courante.projet));
    case "client_asc":
      return sorted.sort((a, b) => a.courante.client.localeCompare(b.courante.client));
    case "updatedAt_desc":
      return sorted.sort(
        (a, b) => b.courante.updatedAt.getTime() - a.courante.updatedAt.getTime(),
      );
    case "statutGlobal_priorite":
      return sorted.sort(
        (a, b) =>
          STATUT_GLOBAL_PRIORITE.indexOf(a.courante.statutGlobal) -
          STATUT_GLOBAL_PRIORITE.indexOf(b.courante.statutGlobal),
      );
    case "periode_desc":
    default:
      return sorted.sort(
        (a, b) => b.courante.periode.getTime() - a.courante.periode.getTime(),
      );
  }
}
