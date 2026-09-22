import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin") ?? req.nextUrl.origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: 1900,
            product_data: {
              name: "Audit Fantômes — abonnements oubliés",
              description:
                "Analyse de ton relevé bancaire et lettres de résiliation prêtes à envoyer.",
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/`,
    });

    if (!session.url) {
      throw new Error("Stripe n'a pas renvoyé d'URL de paiement");
    }

    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    console.error("Erreur création session Stripe", error);
    return NextResponse.redirect(`${origin}/?erreur=paiement`, 303);
  }
}
