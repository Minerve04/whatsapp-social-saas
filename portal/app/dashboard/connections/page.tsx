import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

// Connexions : numéro WhatsApp enregistré + réseaux liés via Metricool.
// C'est ici que se joue l'onboarding (le vrai mur : compte Instagram pro).
export default async function ConnectionsPage() {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: canal } = await supabase
    .from("canaux_whatsapp")
    .select("numero_e164, actif")
    .maybeSingle();

  const { data: metricool } = await supabase
    .from("connexions_metricool")
    .select("blog_id, reseaux_actifs")
    .maybeSingle();

  const reseaux: string[] = (metricool?.reseaux_actifs as string[]) ?? [];

  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold">Connexions</h1>

      <section className="mb-6 rounded-lg border border-neutral-200 bg-white p-5">
        <h2 className="font-semibold">Numéro WhatsApp</h2>
        <p className="mt-1 text-sm text-neutral-600">
          C&apos;est depuis ce numéro que vous nous envoyez vos photos.
        </p>
        <p className="mt-3 font-mono text-lg">
          {canal?.numero_e164 ?? "— non enregistré —"}
        </p>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white p-5">
        <h2 className="font-semibold">Réseaux sociaux</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Connectés via Metricool. Instagram requiert un compte Professionnel lié à
          une Page Facebook — on s&apos;en occupe avec vous.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {reseaux.length ? (
            reseaux.map((r) => (
              <span
                key={r}
                className="rounded-full bg-neutral-100 px-3 py-1 text-sm capitalize"
              >
                {r}
              </span>
            ))
          ) : (
            <span className="text-sm text-neutral-500">Aucun réseau connecté</span>
          )}
        </div>
        <button className="mt-4 rounded-lg border border-clay px-4 py-2 text-sm font-semibold text-clay hover:bg-orange-50">
          Connecter un réseau {/* TODO: lancer le flux OAuth Metricool */}
        </button>
      </section>
    </main>
  );
}
