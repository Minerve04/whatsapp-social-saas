"use server";
import { revalidatePath } from "next/cache";
import { supabaseServer } from "@/lib/supabaseServer";

// Server Action : sauvegarde le profil de rédaction (le "ton métier").
// Ces champs alimentent directement le prompt du LLM côté backend.
export async function saveProfil(formData: FormData) {
  const supabase = supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const patch = {
    ton: String(formData.get("ton") ?? "chaleureux"),
    emojis: formData.get("emojis") === "on",
    signature: (formData.get("signature") as string) || null,
    consignes: (formData.get("consignes") as string) || null,
  };

  // upsert sur profil_redaction lié au client de l'utilisateur.
  // NB : la résolution client_id ↔ user se fait via RLS / une fonction SQL.
  const { error } = await supabase.from("profil_redaction").update(patch).eq("client_id",
    // TODO: remplacer par la vraie résolution du client_id (RLS ou claim JWT).
    user.id
  );
  if (error) throw error;

  revalidatePath("/dashboard/settings");
}
