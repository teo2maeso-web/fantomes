import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err) {
    console.error("Signature webhook invalide", err);
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Confirmation côté serveur — c'est la seule source fiable, jamais la
    // page de succès seule. Pour l'instant la livraison est manuelle :
    // va voir ce paiement dans le dashboard Stripe (Paiements > le trouver
    // par email) et envoie l'audit à la main à cette adresse.
    console.log("Paiement confirmé", {
      email: session.customer_details?.email,
      montant_centimes: session.amount_total,
      session_id: session.id,
    });
  }

  return NextResponse.json({ received: true });
}
