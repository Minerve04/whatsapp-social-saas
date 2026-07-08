-- =====================================================================
-- Données de démonstration — un client fictif "La Boulangerie du Coin"
-- Permet de tester le flux backend de bout en bout en local.
-- =====================================================================

WITH nouveau_client AS (
  INSERT INTO clients (nom_commerce, secteur, email, palier, statut)
  VALUES ('La Boulangerie du Coin', 'boulangerie', 'demo@boulangerie.test', 'pro', 'actif')
  ON CONFLICT (email) DO UPDATE SET nom_commerce = EXCLUDED.nom_commerce
  RETURNING id
)
INSERT INTO canaux_whatsapp (client_id, numero_e164)
SELECT id, '+33612345678' FROM nouveau_client
ON CONFLICT (numero_e164) DO NOTHING;

-- Connexion Metricool (blogId de démo)
INSERT INTO connexions_metricool (client_id, blog_id, reseaux_actifs, validation_requise)
SELECT c.id, 'demo_blog_0001', '["instagram","facebook"]'::jsonb, false
FROM clients c WHERE c.email = 'demo@boulangerie.test'
ON CONFLICT (client_id) DO NOTHING;

-- Profil de rédaction
INSERT INTO profil_redaction (client_id, ton, emojis, signature, consignes, exemples)
SELECT c.id, 'chaleureux', true, '— La Boulangerie du Coin',
       'Toujours mentionner que tout est fait maison. Éviter le jargon marketing.',
       '["Fournée de pains au levain tout juste sortie du four 🔥 Venez tant qu''il en reste !"]'::jsonb
FROM clients c WHERE c.email = 'demo@boulangerie.test'
ON CONFLICT (client_id) DO NOTHING;

-- Quota (palier pro = 60 publications/mois par ex.)
INSERT INTO quotas (client_id, limite_mois)
SELECT c.id, 60 FROM clients c WHERE c.email = 'demo@boulangerie.test'
ON CONFLICT (client_id) DO NOTHING;
