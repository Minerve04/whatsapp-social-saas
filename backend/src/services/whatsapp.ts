import { config, liveMode } from "../config.js";
import { logger } from "../lib/logger.js";
import type { MessageEntrant } from "../types.js";

// Extrait le message utile d'un payload webhook du BSP.
// Le format ci-dessous suit la structure WhatsApp Cloud API / 360dialog.
// TODO: aligner précisément sur le format de TON BSP (peut varier légèrement).
export function parseWebhook(payload: any): MessageEntrant | null {
  try {
    const msg = payload?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!msg) return null;

    const numeroExpediteur = "+" + String(msg.from).replace(/^\+/, "");

    if (msg.type === "image") {
      return {
        numeroExpediteur,
        legendeBrute: msg.image?.caption ?? "",
        mediaUrl: msg.image?.id ?? null, // id de média à télécharger ensuite
      };
    }
    if (msg.type === "text") {
      // Message texte seul (ex. réponse "ok" à une validation).
      return { numeroExpediteur, legendeBrute: msg.text?.body ?? "", mediaUrl: null };
    }
    return null;
  } catch (e) {
    logger.error("parseWebhook a échoué", { erreur: String(e) });
    return null;
  }
}

// Récupère une URL exploitable pour un média reçu (les BSP renvoient un id
// qu'il faut résoudre en URL téléchargeable, souvent en deux appels).
// TODO: implémenter selon l'API du BSP. Ici on renvoie l'id tel quel en dry-run.
export async function resoudreMediaUrl(mediaId: string | null): Promise<string | null> {
  if (!mediaId) return null;
  if (!liveMode) return `https://dry-run.local/media/${mediaId}`;
  // Exemple (à adapter) :
  // const r = await fetch(`${config.whatsapp.baseUrl}/media/${mediaId}`, {
  //   headers: { "D360-API-KEY": config.whatsapp.apiKey } });
  // return (await r.json()).url;
  return `${config.whatsapp.baseUrl}/media/${mediaId}`;
}

// Envoie un message texte au commerçant (dans la fenêtre gratuite de 24 h).
export async function envoyerMessage(numeroE164: string, texte: string): Promise<void> {
  if (!liveMode) {
    logger.info("WhatsApp dry-run → message non envoyé", { numeroE164, texte });
    return;
  }
  const res = await fetch(`${config.whatsapp.baseUrl}/messages`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "D360-API-KEY": config.whatsapp.apiKey, // TODO: header selon le BSP
    },
    body: JSON.stringify({
      to: numeroE164.replace(/^\+/, ""),
      type: "text",
      text: { body: texte },
    }),
  });
  if (!res.ok) {
    logger.error("Échec envoi WhatsApp", { numeroE164, status: res.status });
  }
}
