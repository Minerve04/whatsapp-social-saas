import { saveProfil } from "../actions";

// Réglage du "ton métier". Formulaire posté vers une Server Action.
export default function SettingsPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold">Ton &amp; réglages</h1>
      <form action={saveProfil} className="flex flex-col gap-5">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Ton des publications</span>
          <select name="ton" className="rounded-lg border border-neutral-300 px-3 py-2">
            <option value="chaleureux">Chaleureux</option>
            <option value="sobre">Sobre / professionnel</option>
            <option value="promo">Promotionnel / punchy</option>
          </select>
        </label>

        <label className="flex items-center gap-2">
          <input type="checkbox" name="emojis" defaultChecked />
          <span className="text-sm">Utiliser des emojis</span>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Signature (optionnelle)</span>
          <input
            name="signature"
            placeholder="— La Boulangerie du Coin"
            className="rounded-lg border border-neutral-300 px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Consignes libres</span>
          <textarea
            name="consignes"
            rows={4}
            placeholder="Ex. : toujours préciser que tout est fait maison, éviter le jargon…"
            className="rounded-lg border border-neutral-300 px-3 py-2"
          />
        </label>

        <button
          type="submit"
          className="self-start rounded-lg bg-clay px-5 py-2.5 font-semibold text-white hover:opacity-90"
        >
          Enregistrer
        </button>
      </form>
    </main>
  );
}
