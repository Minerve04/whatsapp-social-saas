// Chargement et validation centralisés des variables d'environnement.
// Un seul endroit qui lit process.env : le reste du code importe `config`.

function required(name: string): string {
  const v = process.env[name];
  if (!v || v.startsWith("REMPLACER")) {
    // En dev on tolère les placeholders (le flux tourne en mode "dry run"),
    // mais on prévient bruyamment.
    console.warn(`[config] ${name} non configuré — fonctionnalité limitée / dry-run.`);
    return v ?? "";
  }
  return v;
}

export const config = {
  port: Number(process.env.PORT ?? 8080),
  databaseUrl: process.env.DATABASE_URL ?? "postgres://saas:saas@localhost:5432/saas",

  whatsapp: {
    baseUrl: process.env.WHATSAPP_BSP_BASE_URL ?? "",
    apiKey: required("WHATSAPP_API_KEY"),
    verifyToken: required("WHATSAPP_WEBHOOK_VERIFY_TOKEN"),
  },

  llm: {
    apiKey: required("LLM_API_KEY"),
    model: process.env.LLM_MODEL ?? "claude-sonnet-4-5",
    apiUrl: process.env.LLM_API_URL ?? "https://api.anthropic.com/v1/messages",
  },

  metricool: {
    baseUrl: process.env.METRICOOL_BASE_URL ?? "https://app.metricool.com/api",
    userToken: required("METRICOOL_USER_TOKEN"),
    userId: process.env.METRICOOL_USER_ID ?? "",
  },
};

// Vrai si toutes les clés externes sont présentes. Sinon on tourne en dry-run
// (utile pour développer le flux sans compte payant).
export const liveMode =
  !!config.whatsapp.apiKey && !!config.llm.apiKey && !!config.metricool.userToken;
