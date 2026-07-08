"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

// Auth par lien magique (email) — simple et sans mot de passe à gérer.
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [envoye, setEnvoye] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErreur(null);
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/dashboard` },
    });
    if (error) setErreur(error.message);
    else setEnvoye(true);
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="mb-6 text-2xl font-bold">Connexion</h1>
      {envoye ? (
        <p className="rounded-lg bg-green-50 p-4 text-green-800">
          Lien de connexion envoyé à <strong>{email}</strong>. Vérifiez votre boîte mail.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="vous@commerce.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-neutral-300 px-4 py-3"
          />
          <button
            type="submit"
            className="rounded-lg bg-clay px-4 py-3 font-semibold text-white hover:opacity-90"
          >
            Recevoir un lien de connexion
          </button>
          {erreur && <p className="text-sm text-red-600">{erreur}</p>}
        </form>
      )}
    </main>
  );
}
