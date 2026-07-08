export type Palier = "essentiel" | "pro";
export type StatutPublication =
  | "recu"
  | "redige"
  | "en_attente_validation"
  | "publie"
  | "echec";

export interface Publication {
  id: string;
  recu_le: string;
  statut: StatutPublication;
  legende_finale: string | null;
  reseaux_cibles: string[];
  erreur: string | null;
}

export interface ProfilRedaction {
  ton: string;
  emojis: boolean;
  signature: string | null;
  consignes: string | null;
}
