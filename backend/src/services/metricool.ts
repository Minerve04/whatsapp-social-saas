import { config, liveMode } from "../config.js";
import { logger } from "../lib/logger.js";
import type { ClientContext } from "../types.js";

export interface ResultatPublication {
  ok: boolean;
  ref?: string; // id de post Metricool
  reseaux: string[];
  erreur?: string;
}

// Publie (ou planifie) via l'API Metricool pour la "brand" = blogId du client.
//
// ⚠️ IMPORTANT : les chemins/paramètres exacts de l'API Metricool doivent être
// confirmés dans leur documentation officielle (ils évoluent). Le point clé,
// stable, est le modèle : UN token utilisateur + le blogId identifie la brand.
// On isole ici tout le contrat d'API pour n'avoir qu'un seul endroit à ajuster.
export async function publierViaMetricool(
  ctx: ClientContext,
  legende: string,
  mediaUrl: string | null
): Promise<ResultatPublication> {
  if (!liveMode || !config.metricool.userToken) {
    logger.warn("Metricool en dry-run (pas de token)", {
      clientId: ctx.clientId,
      blogId: ctx.blogId,
    });
    return { ok: true, ref: `dryrun_${Date.now()}`, reseaux: ctx.reseauxActifs };
  }

  // publier immédiatement = planifier à "maintenant".
  const publicationDate = new Date().toISOString();

  const url =
    `${config.metricool.baseUrl}/v2/scheduler/posts` +
    `?userId=${encodeURIComponent(config.metricool.userId)}` +
    `&blogId=${encodeURIComponent(ctx.blogId)}`;

  const body = {
    // Mapping vers les réseaux activés pour ce client.
    providers: ctx.reseauxActifs.map((r) => ({ network: r })),
    text: legende,
    media: mediaUrl ? [mediaUrl] : [],
    publicationDate,
    autoPublish: true,
    // TODO: confirmer le nom des champs (providers/media/publicationDate)
    //       auprès de la doc Metricool avant la mise en prod.
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-Mc-Auth": config.metricool.userToken, // TODO: confirmer le header d'auth
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const erreur = `Metricool ${res.status}: ${await res.text()}`;
    logger.error("Échec publication Metricool", { clientId: ctx.clientId, erreur });
    return { ok: false, reseaux: ctx.reseauxActifs, erreur };
  }

  const data = (await res.json()) as { id?: string | number };
  return {
    ok: true,
    ref: data.id != null ? String(data.id) : undefined,
    reseaux: ctx.reseauxActifs,
  };
}
