import Link from "next/link";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";
import type { Publication } from "@/lib/types";

export const dynamic = "force-dynamic";

// Tableau de bord : le commerçant y vient rarement (tout se passe sur WhatsApp),
// mais il peut suivre ses dernières publications et son quota.
export default async function Dashboard() {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // NB : les tables métier vivent dans le même Postgres (Supabase). L'accès est
  // filtré par RLS sur le client lié à l'utilisateur connecté.
  const { data: publications } = await supabase
    .from("publications")
    .select("id, recu_le, statut, legende_finale, reseaux_cibles, erreur")
    .order("recu_le", { ascending: false })
    .limit(20);

  const rows = (publications ?? []) as Publication[];

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mon espace</h1>
        <nav className="flex gap-4 text-sm">
          <Link href="/dashboard/connections" className="text-clay hover:underline">
            Connexions
          </Link>
          <Link href="/dashboard/settings" className="text-clay hover:underline">
            Ton &amp; réglages
          </Link>
        </nav>
      </header>

      <section>
        <h2 className="mb-3 font-semibold">Dernières publications</h2>
        {rows.length === 0 ? (
          <p className="rounded-lg border border-dashed border-neutral-300 p-6 text-center text-neutral-500">
            Aucune publication pour l&apos;instant. Envoyez une photo sur WhatsApp
            pour démarrer. 📸
          </p>
        ) : (
          <ul className="divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
            {rows.map((p) => (
              <li key={p.id} className="flex items-start justify-between gap-4 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm">
                    {p.legende_finale ?? <em className="text-neutral-400">en cours…</em>}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {new Date(p.recu_le).toLocaleString("fr-FR")} ·{" "}
                    {p.reseaux_cibles?.join(", ") || "—"}
                  </p>
                </div>
                <StatutBadge statut={p.statut} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

function StatutBadge({ statut }: { statut: Publication["statut"] }) {
  const map: Record<Publication["statut"], string> = {
    recu: "bg-neutral-100 text-neutral-700",
    redige: "bg-blue-100 text-blue-700",
    en_attente_validation: "bg-amber-100 text-amber-700",
    publie: "bg-green-100 text-green-700",
    echec: "bg-red-100 text-red-700",
  };
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${map[statut]}`}>
      {statut.replace(/_/g, " ")}
    </span>
  );
}
