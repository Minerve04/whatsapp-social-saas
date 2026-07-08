import type { FastifyInstance } from "fastify";
import { config } from "../config.js";
import { logger } from "../lib/logger.js";
import {
  chargerContexteParNumero,
  creerPublication,
  majPublication,
  incrementerQuota,
} from "../services/clients.js";
import { redigerLegende } from "../services/llm.js";
import { publierViaMetricool } from "../services/metricool.js";
import { parseWebhook, resoudreMediaUrl, envoyerMessage } from "../services/whatsapp.js";

export async function whatsappWebhookRoutes(app: FastifyInstance) {
  // 1) Vérification du webhook (handshake exigé par la plupart des BSP/Meta).
  app.get("/webhook/whatsapp", async (req, reply) => {
    const q = req.query as Record<string, string>;
    if (
      q["hub.mode"] === "subscribe" &&
      q["hub.verify_token"] === config.whatsapp.verifyToken
    ) {
      return reply.send(q["hub.challenge"]);
    }
    return reply.code(403).send("Vérification échouée");
  });

  // 2) Réception des messages entrants → orchestration du flux.
  app.post("/webhook/whatsapp", async (req, reply) => {
    // On répond 200 immédiatement : le traitement se fait en tâche de fond
    // pour ne pas faire expirer le webhook du BSP.
    reply.code(200).send({ received: true });
    traiterMessage(req.body).catch((e) =>
      logger.error("traiterMessage a levé une exception", { erreur: String(e) })
    );
  });
}

// ── Le flux unique, piloté par les données (multi-tenant) ──────────────
async function traiterMessage(payload: unknown): Promise<void> {
  const msg = parseWebhook(payload);
  if (!msg) return; // statut, accusé de lecture, type non géré, etc.

  // a) Identifier le client par son numéro.
  const ctx = await chargerContexteParNumero(msg.numeroExpediteur);
  if (!ctx) {
    await envoyerMessage(
      msg.numeroExpediteur,
      "Bonjour 👋 Je ne reconnais pas ce numéro. Êtes-vous bien inscrit sur la plateforme ?"
    );
    return;
  }
  if (ctx.statut !== "actif") {
    await envoyerMessage(
      msg.numeroExpediteur,
      "Votre abonnement est actuellement suspendu. Contactez-nous pour le réactiver."
    );
    return;
  }
  if (ctx.quotaRestant <= 0) {
    await envoyerMessage(
      msg.numeroExpediteur,
      "Vous avez atteint votre quota de publications ce mois-ci. 🗓️"
    );
    return;
  }

  // b) Journaliser + résoudre le média.
  const pubId = await creerPublication(ctx.clientId, msg.legendeBrute, msg.mediaUrl);
  const mediaUrl = await resoudreMediaUrl(msg.mediaUrl);

  try {
    // c) Rédiger la légende (ton métier).
    const legende = await redigerLegende(ctx, msg.legendeBrute);
    await majPublication(pubId, { statut: "redige", legende_finale: legende });

    // c-bis) Boucle de validation optionnelle par client.
    if (ctx.validationRequise) {
      await majPublication(pubId, { statut: "en_attente_validation" });
      await envoyerMessage(
        msg.numeroExpediteur,
        `Voici la légende proposée :\n\n${legende}\n\nRépondez "ok" pour publier, ou envoyez une correction.`
      );
      // Le "ok" arrivera comme un nouveau message texte → à gérer dans une
      // évolution (rapprochement avec la dernière publication en attente).
      return;
    }

    // d) Publier via Metricool (blogId du client).
    const res = await publierViaMetricool(ctx, legende, mediaUrl);
    if (!res.ok) {
      await majPublication(pubId, { statut: "echec", erreur: res.erreur });
      await envoyerMessage(
        msg.numeroExpediteur,
        "Aïe, la publication a échoué de notre côté. Nous regardons ça. 🛠️"
      );
      return;
    }

    // e) Finaliser : quota + journal + confirmation.
    await majPublication(pubId, {
      statut: "publie",
      reseaux_cibles: res.reseaux,
      metricool_ref: res.ref,
    });
    await incrementerQuota(ctx.clientId);
    await envoyerMessage(
      msg.numeroExpediteur,
      `✅ Publié sur ${res.reseaux.join(", ")} ! (${ctx.quotaRestant - 1} publications restantes ce mois-ci)`
    );
  } catch (e) {
    await majPublication(pubId, { statut: "echec", erreur: String(e) });
    logger.error("Flux en échec", { clientId: ctx.clientId, pubId, erreur: String(e) });
    await envoyerMessage(
      msg.numeroExpediteur,
      "Un problème est survenu lors du traitement. Nous avons été alertés. 🙏"
    );
  }
}
