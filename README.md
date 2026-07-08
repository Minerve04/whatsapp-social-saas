# WhatsApp → Social — squelette du SaaS

Publier sur tous les réseaux d'un commerçant en lui faisant simplement **envoyer une photo + une phrase sur WhatsApp**. Une IA rédige la légende, Metricool publie.

Ce dépôt est le **squelette** de la plateforme : structure complète, code réel, mais avec des `TODO` et des clés d'API en placeholders. Rien n'est prêt pour la production tel quel — c'est une base saine pour démarrer.

## Architecture en une phrase

```
Commerçant (WhatsApp normal)
      │  photo + légende brute
      ▼
WhatsApp Business Platform (BSP: 360dialog)  ──webhook──►  backend/  (flux)
                                                              │ 1. identifie le client par son numéro
                                                              │ 2. LLM rédige la légende (ton métier)
                                                              │ 3. appelle l'API Metricool avec le blogId du client
                                                              │ 4. renvoie « ✅ publié » sur WhatsApp
                                                              ▼
                                                     Réseaux sociaux (IG, FB, LinkedIn, …)

portal/  (Next.js)  ── inscription, connexion réseaux, réglage du ton, quotas, facturation Stripe
db/      (Postgres) ── mapping numéro WhatsApp → client → blogId, profils, journal des publications
```

Voir `architecture-plateforme-whatsapp.md` (dossier parent) pour le détail complet.

## Structure du monorepo

```
whatsapp-social-saas/
├── db/           Schéma Postgres + données de démo
├── backend/      Service Node/Fastify — le flux de publication (webhook → LLM → Metricool)
├── portal/       Next.js — le portail client (le socle que tu possèdes)
├── docker-compose.yml   Postgres local
├── .env.example         Toutes les variables d'environnement, documentées
└── package.json         Workspace npm (scripts globaux)
```

## Démarrage rapide (dev local)

Prérequis : Node 20+, npm 10+, Docker (pour Postgres).

```bash
# 1. Cloner les variables d'environnement
cp .env.example .env
cp backend/.env.example backend/.env
cp portal/.env.example portal/.env.local

# 2. Lancer Postgres et charger le schéma
docker compose up -d
npm run db:setup          # applique db/schema.sql puis db/seed.sql

# 3. Installer les dépendances
npm install               # installe les workspaces (portal + backend)

# 4. Lancer les deux services
npm run dev               # portal sur :3000, backend sur :8080
```

Pour recevoir les webhooks WhatsApp en local, expose le backend avec un tunnel (ex. `ngrok http 8080`) et renseigne l'URL dans la config de ton BSP.

## Ce qu'il reste à brancher (les `TODO` du code)

1. **BSP WhatsApp** (360dialog ou équivalent) : numéro pro + clé API + URL de webhook.
2. **Metricool** : compte plan Advanced, token API, un `blogId` par client.
3. **LLM** : clé API (Anthropic par défaut dans `backend/src/services/llm.ts`).
4. **Supabase** : projet (auth + Postgres géré) pour le portail.
5. **Stripe** : produits/prix des paliers 39 € / 49 €, webhook.

Chaque intégration est isolée dans un fichier `services/` (backend) ou `lib/` (portail) : tu remplaces le placeholder à un seul endroit.

## Modèle multi-tenant (le point crucial)

Un **seul** scénario/flux, piloté par les données. Tous les clients écrivent au **même** numéro WhatsApp ; le backend les distingue par leur numéro d'expéditeur et retrouve leur `blogId` en base. **Ne jamais dupliquer la logique par client.**
