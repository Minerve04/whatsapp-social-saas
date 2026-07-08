-- =====================================================================
-- Schéma multi-tenant — WhatsApp → Social
-- Postgres 14+. Idempotent (ré-exécutable).
--
-- Principe : une logique unique, des données par client.
-- Le numéro WhatsApp entrant identifie le client -> son blogId Metricool.
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- gen_random_uuid()

-- ── Types ────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE palier_abo AS ENUM ('essentiel', 'pro');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE statut_client AS ENUM ('actif', 'suspendu', 'annule');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE statut_publication AS ENUM ('recu', 'redige', 'en_attente_validation', 'publie', 'echec');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- ── clients ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom_commerce       TEXT        NOT NULL,
  secteur            TEXT,                         -- ex. 'boulangerie', 'immobilier'
  email              TEXT        NOT NULL UNIQUE,
  stripe_customer_id TEXT        UNIQUE,
  palier             palier_abo  NOT NULL DEFAULT 'essentiel',
  statut             statut_client NOT NULL DEFAULT 'actif',
  cree_le            TIMESTAMPTZ NOT NULL DEFAULT now(),
  maj_le             TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ── canaux_whatsapp ──────────────────────────────────────────────────
-- Le numéro depuis lequel le commerçant écrit. C'est la clé d'identification.
CREATE TABLE IF NOT EXISTS canaux_whatsapp (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  numero_e164 TEXT NOT NULL UNIQUE,                -- format international, ex. +33612345678
  actif       BOOLEAN NOT NULL DEFAULT true,
  cree_le     TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Recherche O(1) du client à la réception d'un message.
CREATE INDEX IF NOT EXISTS idx_canaux_numero ON canaux_whatsapp (numero_e164);


-- ── connexions_metricool ─────────────────────────────────────────────
-- Un blogId Metricool = une "brand" = un client.
CREATE TABLE IF NOT EXISTS connexions_metricool (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id           UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  blog_id             TEXT NOT NULL UNIQUE,        -- identifiant "brand" chez Metricool
  reseaux_actifs      JSONB NOT NULL DEFAULT '[]', -- ex. ["instagram","facebook","linkedin"]
  validation_requise  BOOLEAN NOT NULL DEFAULT false, -- boucle d'approbation WhatsApp avant publication
  cree_le             TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_metricool_client ON connexions_metricool (client_id);


-- ── profil_redaction ─────────────────────────────────────────────────
-- Contexte injecté dans le prompt du LLM. C'est la verticalisation.
CREATE TABLE IF NOT EXISTS profil_redaction (
  client_id   UUID PRIMARY KEY REFERENCES clients(id) ON DELETE CASCADE,
  ton         TEXT NOT NULL DEFAULT 'chaleureux',  -- chaleureux | sobre | promo | ...
  emojis      BOOLEAN NOT NULL DEFAULT true,
  signature   TEXT,                                -- ex. "— La Boulangerie du Coin"
  consignes   TEXT,                                -- consignes libres du commerçant
  exemples    JSONB NOT NULL DEFAULT '[]',         -- quelques posts modèles
  maj_le      TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ── quotas ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotas (
  client_id           UUID PRIMARY KEY REFERENCES clients(id) ON DELETE CASCADE,
  publications_mois   INTEGER NOT NULL DEFAULT 0,   -- compteur du mois courant
  limite_mois         INTEGER NOT NULL DEFAULT 30,  -- selon le palier
  reset_le            DATE NOT NULL DEFAULT date_trunc('month', now())::date
);


-- ── publications (journal / supervision) ─────────────────────────────
CREATE TABLE IF NOT EXISTS publications (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id      UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  recu_le        TIMESTAMPTZ NOT NULL DEFAULT now(),
  statut         statut_publication NOT NULL DEFAULT 'recu',
  media_url      TEXT,                              -- URL du média reçu via WhatsApp
  legende_brute  TEXT,                              -- ce que le commerçant a tapé
  legende_finale TEXT,                              -- ce que le LLM a produit
  reseaux_cibles JSONB NOT NULL DEFAULT '[]',
  metricool_ref  TEXT,                              -- id de post renvoyé par Metricool
  erreur         TEXT,                              -- message d'erreur si statut = echec
  maj_le         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pub_client_date ON publications (client_id, recu_le DESC);
CREATE INDEX IF NOT EXISTS idx_pub_statut ON publications (statut);


-- ── maj_le automatique ───────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_maj_le() RETURNS trigger AS $$
BEGIN
  NEW.maj_le = now();
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_clients_maj ON clients;
CREATE TRIGGER trg_clients_maj BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION set_maj_le();

DROP TRIGGER IF EXISTS trg_pub_maj ON publications;
CREATE TRIGGER trg_pub_maj BEFORE UPDATE ON publications
  FOR EACH ROW EXECUTE FUNCTION set_maj_le();
