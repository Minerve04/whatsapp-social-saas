import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

// apiVersion omise volontairement : on laisse le SDK utiliser la version par
// défaut du compte, ce qui évite de coupler le code à une version figée.
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "");

// Webhook Stripe : met à jour le statut/palier du client selon les événements
// d'abonnement. La signature est vérifiée pour authentifier l'appel.
export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const body = await req.text();

  if (!sig || !secret) {
    return NextResponse.json({ error: "Signature ou secret manquant" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    return NextResponse.json(
      { error: `Signature invalide : ${(err as Error).message}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed":
      // TODO: créer/activer le client, stocker stripe_customer_id, définir le palier.
      break;
    case "customer.subscription.updated":
      // TODO: mettre à jour palier + limite de quota.
      break;
    case "customer.subscription.deleted":
      // TODO: passer le client en statut 'suspendu' ou 'annule'.
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
