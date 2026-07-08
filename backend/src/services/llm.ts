import { config, liveMode } from "../config.js";
import { logger } from "../lib/logger.js";
import type { ClientContext } from "../types.js";

// Construit le prompt verticalisé à partir du profil du commerçant.
// C'est ICI que se joue la qualité perçue et la différenciation métier.
function construirePrompt(ctx: ClientContext, legendeBrute: string): string {
  const parts = [
    `Tu es le community manager de "${ctx.nomCommerce}"${
      ctx.secteur ? `, un commerce du secteur : ${ctx.secteur}` : ""
    }.`,
    `Rédige une légende de publication pour les réseaux sociaux à partir de la note brute du commerçant.`,
    `Ton souhaité : ${ctx.ton}.`,
    ctx.emojis ? `Utilise quelques emojis pertinents.` : `N'utilise aucun emoji.`,
    ctx.consignes ? `Consignes du commerçant : ${ctx.consignes}` : "",
    ctx.exemples.length
      ? `Exemples de posts qui correspondent à sa voix :\n- ${ctx.exemples.join("\n- ")}`
      : "",
    ctx.signature ? `Termine par la signature : "${ctx.signature}".` : "",
    `Réseaux cibles : ${ctx.reseauxActifs.join(", ") || "génériques"}.`,
    `Réponds UNIQUEMENT par la légende finale, sans commentaire.`,
    ``,
    `Note brute du commerçant : "${legendeBrute}"`,
  ];
  return parts.filter(Boolean).join("\n");
}

// Appel LLM (format API Anthropic Messages par défaut).
// TODO: adapter le parsing si tu changes de fournisseur (OpenAI, etc.).
export async function redigerLegende(
  ctx: ClientContext,
  legendeBrute: string
): Promise<string> {
  const prompt = construirePrompt(ctx, legendeBrute);

  if (!liveMode || !config.llm.apiKey) {
    // Mode dry-run : pas de clé → on renvoie une légende factice mais réaliste.
    logger.warn("LLM en dry-run (pas de clé)", { clientId: ctx.clientId });
    const emo = ctx.emojis ? " ✨" : "";
    return `${legendeBrute}${emo}${ctx.signature ? `\n${ctx.signature}` : ""}`;
  }

  const res = await fetch(config.llm.apiUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": config.llm.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: config.llm.model,
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    throw new Error(`LLM error ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as { content?: Array<{ text?: string }> };
  const texte = data.content?.[0]?.text?.trim();
  if (!texte) throw new Error("Réponse LLM vide");
  return texte;
}
