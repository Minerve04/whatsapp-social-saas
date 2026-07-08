// Types métier partagés dans le backend.

export interface ClientContext {
  clientId: string;
  nomCommerce: string;
  secteur: string | null;
  statut: "actif" | "suspendu" | "annule";
  // Metricool
  blogId: string;
  reseauxActifs: string[];
  validationRequise: boolean;
  // Rédaction
  ton: string;
  emojis: boolean;
  signature: string | null;
  consignes: string | null;
  exemples: string[];
  // Quota
  quotaRestant: number;
}

export interface MessageEntrant {
  numeroExpediteur: string; // E.164
  legendeBrute: string;
  mediaUrl: string | null; // URL/ID du média WhatsApp
}
