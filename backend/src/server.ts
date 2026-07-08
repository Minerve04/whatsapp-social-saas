import Fastify from "fastify";
import { config, liveMode } from "./config.js";
import { logger } from "./lib/logger.js";
import { whatsappWebhookRoutes } from "./routes/whatsapp-webhook.js";

const app = Fastify({ logger: false });

// Santé (pour les probes / uptime).
app.get("/health", async () => ({ ok: true, liveMode }));

app.register(whatsappWebhookRoutes);

app
  .listen({ port: config.port, host: "0.0.0.0" })
  .then(() => {
    logger.info("Backend démarré", { port: config.port, liveMode });
    if (!liveMode) {
      logger.warn(
        "Mode DRY-RUN : clés externes absentes. Le flux tourne mais ne publie/envoie rien réellement."
      );
    }
  })
  .catch((e) => {
    logger.error("Impossible de démarrer le serveur", { erreur: String(e) });
    process.exit(1);
  });
