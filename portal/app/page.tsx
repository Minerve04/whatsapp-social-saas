import Link from "next/link";

// Landing minimale — la promesse en une phrase.
export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-8 px-6">
      <div>
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-clay">
          WhatsApp → Réseaux sociaux
        </p>
        <h1 className="text-4xl font-bold leading-tight">
          Envoyez une photo sur WhatsApp.<br />C&apos;est publié partout.
        </h1>
        <p className="mt-4 text-lg text-neutral-600">
          Pas de dashboard, pas d&apos;app à installer. Vous envoyez une photo et une
          phrase ; une IA rédige la légende et publie sur Instagram, Facebook,
          LinkedIn… au ton de votre métier.
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          href="/login"
          className="rounded-lg bg-clay px-5 py-3 font-semibold text-white hover:opacity-90"
        >
          Commencer
        </Link>
        <Link
          href="/dashboard"
          className="rounded-lg border border-neutral-300 px-5 py-3 font-semibold hover:bg-neutral-100"
        >
          Mon espace
        </Link>
      </div>
      <p className="text-sm text-neutral-500">
        39 € / mois · 49 € avec onboarding assisté et rapport mensuel.
      </p>
    </main>
  );
}
