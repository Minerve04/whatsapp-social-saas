import Link from "next/link";

// Landing page — version riche. Server component, aucune dépendance externe,
// uniquement des utilitaires Tailwind core + SVG inline.

export const metadata = {
  title: "Postly · Publiez partout en envoyant une photo",
  description:
    "Envoyez une photo sur WhatsApp, une IA rédige la légende et publie sur tous vos réseaux. Pensé pour les commerçants et indépendants.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <Nav />
      <Hero />
      <TrustStrip />
      <HowItWorks />
      <Benefits />
      <Pricing />
      <Testimonials />
      <Faq />
      <FinalCta />
      <Footer />
    </div>
  );
}

/* ─────────────────────────── Navigation ─────────────────────────── */
function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-clay text-white">P</span>
          <span>Postly</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-neutral-600 md:flex">
          <a href="#how" className="hover:text-neutral-900">Comment ça marche</a>
          <a href="#pricing" className="hover:text-neutral-900">Tarifs</a>
          <a href="#faq" className="hover:text-neutral-900">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-neutral-700 hover:text-neutral-900">
            Connexion
          </Link>
          <Link
            href="/login"
            className="rounded-lg bg-clay px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Essayer
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────────────── Hero ───────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-clay">
            <span className="h-1.5 w-1.5 rounded-full bg-clay" /> Pour les commerçants &amp; indépendants
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            Envoyez une photo sur WhatsApp.
            <span className="block text-clay">C&apos;est publié partout.</span>
          </h1>
          <p className="mt-5 max-w-md text-lg text-neutral-600">
            Une photo, une phrase, et c&apos;est en ligne sur Instagram, Facebook,
            LinkedIn… Une IA rédige la légende au ton de votre métier. Zéro
            dashboard, aucune app à installer.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-xl bg-clay px-6 py-3 font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              Commencer maintenant
            </Link>
            <a
              href="#how"
              className="rounded-xl border border-neutral-300 px-6 py-3 font-semibold text-neutral-800 transition hover:bg-neutral-50"
            >
              Voir comment ça marche
            </a>
          </div>
          <p className="mt-4 text-sm text-neutral-500">
            À partir de 39 €/mois · sans engagement · installation en 10 minutes
          </p>
        </div>

        <PhoneMockup />
      </div>
    </section>
  );
}

// Mockup d'une conversation WhatsApp (pièce visuelle centrale).
function PhoneMockup() {
  return (
    <div className="relative mx-auto w-full max-w-sm">
      <div className="rounded-[2rem] border-8 border-neutral-900 bg-neutral-900 shadow-2xl">
        <div className="rounded-[1.5rem] bg-[#e5ddd5] p-4">
          <div className="mb-3 flex items-center gap-3 rounded-lg bg-emerald-600 px-3 py-2 text-white">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-white/20 text-sm font-bold">P</div>
            <div className="text-sm font-semibold">Postly</div>
          </div>

          {/* message entrant : le commerçant */}
          <div className="mb-2 ml-auto max-w-[80%] rounded-lg rounded-tr-none bg-[#dcf8c6] p-2 shadow">
            <div className="mb-2 h-24 w-full rounded-md bg-gradient-to-br from-orange-200 to-amber-300" />
            <p className="text-sm text-neutral-800">Fournée de pains au levain 🔥</p>
            <div className="mt-1 text-right text-[10px] text-neutral-500">09:12 ✓✓</div>
          </div>

          {/* réponse : l'assistant */}
          <div className="max-w-[85%] rounded-lg rounded-tl-none bg-white p-2 shadow">
            <p className="text-sm text-neutral-800">
              ✅ Publié sur Instagram et Facebook !
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              « Fournée de pains au levain tout juste sortie du four 🔥 Venez tant
              qu&apos;il en reste ! #faitmaison #boulangerie »
            </p>
            <div className="mt-1 text-right text-[10px] text-neutral-400">09:12</div>
          </div>
        </div>
      </div>
      <div className="absolute -right-4 -top-4 hidden rotate-6 rounded-xl bg-white px-3 py-2 text-xs font-semibold shadow-lg md:block">
        ⚡ Publié en quelques secondes
      </div>
    </div>
  );
}

/* ──────────────────────────── Trust strip ───────────────────────── */
function TrustStrip() {
  const reseaux = ["Instagram", "Facebook", "LinkedIn", "TikTok", "X", "Google Business"];
  return (
    <div className="border-y border-neutral-200 bg-neutral-50">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-6 text-sm font-medium text-neutral-500">
        <span className="text-neutral-400">Publie sur&nbsp;:</span>
        {reseaux.map((r) => (
          <span key={r}>{r}</span>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────── Comment ça marche ───────────────────── */
function HowItWorks() {
  const steps = [
    {
      title: "Prenez une photo",
      text: "Un plat, une vitrine, un chantier terminé. Ajoutez une phrase, comme un SMS à un ami.",
      icon: IconCamera,
    },
    {
      title: "Envoyez-la sur WhatsApp",
      text: "À votre numéro dédié, depuis votre WhatsApp habituel. Rien à installer.",
      icon: IconSend,
    },
    {
      title: "C'est publié, au bon ton",
      text: "Une IA rédige la légende au style de votre métier et publie sur tous vos réseaux.",
      icon: IconCheck,
    },
  ];
  return (
    <section id="how" className="mx-auto max-w-6xl px-6 py-20">
      <SectionTitle
        kicker="Comment ça marche"
        title="Trois gestes, et vous êtes partout"
        subtitle="Le temps de prendre une photo, votre publication est en ligne sur tous vos réseaux."
      />
      <div className="mt-14 grid gap-8 md:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s.title} className="relative rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm">
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-orange-100 text-clay">
              <s.icon />
            </div>
            <div className="absolute right-6 top-6 text-5xl font-black text-neutral-100">{i + 1}</div>
            <h3 className="text-lg font-bold">{s.title}</h3>
            <p className="mt-2 text-neutral-600">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── Bénéfices par métier ─────────────────── */
function Benefits() {
  const metiers = [
    { emoji: "🥖", title: "Boulangers & restaurateurs", text: "Montrez la fournée du jour ou le plat du midi sans quitter votre labo." },
    { emoji: "🏠", title: "Agents immobiliers", text: "Un nouveau bien ? Une photo et l'annonce est diffusée partout, au bon ton." },
    { emoji: "💇", title: "Coiffeurs & instituts", text: "Partagez vos réalisations avant/après en un instant, entre deux clients." },
    { emoji: "🔧", title: "Artisans & indépendants", text: "Un chantier terminé, un produit livré : votre vitrine se remplit toute seule." },
  ];
  return (
    <section className="bg-neutral-50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle
          kicker="Pour votre métier"
          title="Pensé pour ceux qui n'ont pas le temps"
          subtitle="Pas de community manager, pas de dashboard : juste votre téléphone et vos photos."
        />
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metiers.map((m) => (
            <div key={m.title} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="text-3xl">{m.emoji}</div>
              <h3 className="mt-4 font-bold">{m.title}</h3>
              <p className="mt-2 text-sm text-neutral-600">{m.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────── Pricing ───────────────────────── */
function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-20">
      <SectionTitle
        kicker="Tarifs"
        title="Un prix simple, tout compris"
        subtitle="Sans engagement. Changez de formule ou arrêtez quand vous voulez."
      />
      <div className="mt-14 grid gap-8 md:grid-cols-2">
        <PlanCard
          name="Essentiel"
          price="39"
          tagline="Pour se lancer, sans prise de tête."
          features={[
            "Publication illimitée depuis WhatsApp",
            "Rédaction IA au ton de votre métier",
            "Jusqu'à 3 réseaux connectés",
            "Support par email",
          ]}
        />
        <PlanCard
          name="Pro"
          price="49"
          highlighted
          tagline="On s'occupe de tout, vous n'y pensez plus."
          features={[
            "Tout l'Essentiel, sans limite de réseaux",
            "Onboarding assisté (compte Instagram pro inclus)",
            "Rapport de performance mensuel",
            "Support prioritaire",
          ]}
        />
      </div>
    </section>
  );
}

function PlanCard({
  name,
  price,
  tagline,
  features,
  highlighted = false,
}: {
  name: string;
  price: string;
  tagline: string;
  features: string[];
  highlighted?: boolean;
}) {
  return (
    <div
      className={
        "relative rounded-2xl border p-8 " +
        (highlighted
          ? "border-clay bg-gradient-to-br from-orange-50 to-white shadow-lg"
          : "border-neutral-200 bg-white shadow-sm")
      }
    >
      {highlighted && (
        <span className="absolute -top-3 left-8 rounded-full bg-clay px-3 py-1 text-xs font-semibold text-white">
          Le plus choisi
        </span>
      )}
      <h3 className="text-lg font-bold">{name}</h3>
      <p className="mt-1 text-sm text-neutral-500">{tagline}</p>
      <div className="mt-5 flex items-end gap-1">
        <span className="text-4xl font-extrabold">{price}&nbsp;€</span>
        <span className="mb-1 text-neutral-500">/ mois</span>
      </div>
      <ul className="mt-6 space-y-3 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="mt-0.5 text-clay"><IconCheck small /></span>
            <span className="text-neutral-700">{f}</span>
          </li>
        ))}
      </ul>
      <Link
        href="/login"
        className={
          "mt-8 block rounded-xl px-5 py-3 text-center font-semibold transition " +
          (highlighted
            ? "bg-clay text-white hover:opacity-90"
            : "border border-neutral-300 text-neutral-800 hover:bg-neutral-50")
        }
      >
        Choisir {name}
      </Link>
    </div>
  );
}

/* ──────────────────────────── Témoignages ───────────────────────── */
function Testimonials() {
  const quotes = [
    {
      quote: "Je poste tous les jours maintenant, alors qu'avant j'oubliais des semaines entières. Je prends la photo, j'envoie, c'est fini.",
      name: "Camille",
      role: "Boulangerie du Coin",
    },
    {
      quote: "Le compte Instagram pro me faisait peur. Ils l'ont configuré pour moi, je n'ai eu qu'à envoyer mes photos.",
      name: "Karim",
      role: "Agent immobilier",
    },
  ];
  return (
    <section className="bg-neutral-900 py-20 text-white">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-8 md:grid-cols-2">
          {quotes.map((q) => (
            <figure key={q.name} className="rounded-2xl bg-neutral-800 p-8">
              <blockquote className="text-lg leading-relaxed text-neutral-100">« {q.quote} »</blockquote>
              <figcaption className="mt-5 text-sm text-neutral-400">
                <span className="font-semibold text-white">{q.name}</span> — {q.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────── FAQ ────────────────────────────── */
function Faq() {
  const items = [
    { q: "Faut-il une app spéciale ?", a: "Non. Un WhatsApp classique suffit. Vous envoyez vos photos à votre numéro dédié comme à n'importe quel contact." },
    { q: "Sur quels réseaux ça publie ?", a: "Instagram, Facebook, LinkedIn, TikTok, X et Google Business Profile, selon ce que vous connectez." },
    { q: "Et si je n'ai pas de compte Instagram pro ?", a: "Avec la formule Pro, on s'occupe de la mise en conformité de votre compte pour vous." },
    { q: "Puis-je relire avant publication ?", a: "Oui, la validation avant envoi est activable : l'assistant vous propose la légende, vous répondez « ok »." },
  ];
  return (
    <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
      <SectionTitle kicker="FAQ" title="Les questions fréquentes" />
      <div className="mt-10 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
        {items.map((it) => (
          <details key={it.q} className="group px-6 py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
              {it.q}
              <span className="text-clay transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm text-neutral-600">{it.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────── CTA final ──────────────────────────── */
function FinalCta() {
  return (
    <section className="bg-gradient-to-br from-clay to-orange-700 py-16 text-white">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-extrabold md:text-4xl">Votre prochaine publication part d&apos;une photo.</h2>
        <p className="mt-4 text-lg text-orange-50">
          Rejoignez les commerçants qui ne se soucient plus de leurs réseaux sociaux.
        </p>
        <Link
          href="/login"
          className="mt-8 inline-block rounded-xl bg-white px-8 py-3 font-semibold text-clay shadow-sm transition hover:bg-orange-50"
        >
          Commencer — 39 €/mois
        </Link>
      </div>
    </section>
  );
}

/* ─────────────────────────────── Footer ─────────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-neutral-500 md:flex-row">
        <span>© {new Date().getFullYear()} Postly</span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-neutral-800">Mentions légales</a>
          <a href="#" className="hover:text-neutral-800">Confidentialité</a>
          <a href="#" className="hover:text-neutral-800">Contact</a>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────── Petits helpers ─────────────────────── */
function SectionTitle({ kicker, title, subtitle }: { kicker: string; title: string; subtitle?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-clay">{kicker}</p>
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-neutral-600">{subtitle}</p>}
    </div>
  );
}

function IconCamera() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}
function IconSend() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}
function IconCheck({ small = false }: { small?: boolean }) {
  const s = small ? 16 : 22;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
