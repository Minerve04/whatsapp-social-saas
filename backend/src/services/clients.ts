import { query } from "../db.js";
import type { ClientContext } from "../types.js";

// Cœur du multi-tenant : à partir du numéro WhatsApp, on reconstitue tout le
// contexte du client en une seule requête. Aucune logique n'est spécifique à
// un client — seules les DONNÉES le sont.
export async function chargerContexteParNumero(
  numeroE164: string
): Promise<ClientContext | null> {
  const rows = await query<{
    client_id: string;
    nom_commerce: string;
    secteur: string | null;
    statut: ClientContext["statut"];
    blog_id: string | null;
    reseaux_actifs: string[] | null;
    validation_requise: boolean | null;
    ton: string | null;
    emojis: boolean | null;
    signature: string | null;
    consignes: string | null;
    exemples: string[] | null;
    limite_mois: number | null;
    publications_mois: number | null;
  }>(
    `SELECT c.id AS client_id, c.nom_commerce, c.secteur, c.statut,
            m.blog_id, m.reseaux_actifs, m.validation_requise,
            p.ton, p.emojis, p.signature, p.consignes, p.exemples,
            q.limite_mois, q.publications_mois
       FROM canaux_whatsapp w
       JOIN clients c              ON c.id = w.client_id
       LEFT JOIN connexions_metricool m ON m.client_id = c.id
       LEFT JOIN profil_redaction  p ON p.client_id = c.id
       LEFT JOIN quotas            q ON q.client_id = c.id
      WHERE w.numero_e164 = $1 AND w.actif = true
      LIMIT 1`,
    [numeroE164]
  );

  const r = rows[0];
  if (!r || !r.blog_id) return null;

  return {
    clientId: r.client_id,
    nomCommerce: r.nom_commerce,
    secteur: r.secteur,
    statut: r.statut,
    blogId: r.blog_id,
    reseauxActifs: r.reseaux_actifs ?? [],
    validationRequise: r.validation_requise ?? false,
    ton: r.ton ?? "chaleureux",
    emojis: r.emojis ?? true,
    signature: r.signature,
    consignes: r.consignes,
    exemples: r.exemples ?? [],
    quotaRestant: (r.limite_mois ?? 0) - (r.publications_mois ?? 0),
  };
}

// Journalise une publication et renvoie son id (pour la supervision).
export async function creerPublication(
  clientId: string,
  legendeBrute: string,
  mediaUrl: string | null
): Promise<string> {
  const rows = await query<{ id: string }>(
    `INSERT INTO publications (client_id, statut, media_url, legende_brute)
     VALUES ($1, 'recu', $2, $3) RETURNING id`,
    [clientId, mediaUrl, legendeBrute]
  );
  return rows[0].id;
}

export async function majPublication(
  id: string,
  patch: {
    statut?: string;
    legende_finale?: string;
    reseaux_cibles?: string[];
    metricool_ref?: string;
    erreur?: string;
  }
): Promise<void> {
  const sets: string[] = [];
  const vals: unknown[] = [];
  let i = 1;
  for (const [k, v] of Object.entries(patch)) {
    sets.push(`${k} = $${i++}`);
    vals.push(k === "reseaux_cibles" ? JSON.stringify(v) : v);
  }
  if (sets.length === 0) return;
  vals.push(id);
  await query(`UPDATE publications SET ${sets.join(", ")} WHERE id = $${i}`, vals);
}

// Incrémente le compteur mensuel (avec reset simple en début de mois).
export async function incrementerQuota(clientId: string): Promise<void> {
  await query(
    `UPDATE quotas
        SET publications_mois = CASE
              WHEN reset_le < date_trunc('month', now())::date THEN 1
              ELSE publications_mois + 1 END,
            reset_le = date_trunc('month', now())::date
      WHERE client_id = $1`,
    [clientId]
  );
}
