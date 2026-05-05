import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY in .env.local" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeSecretKey);

    const { plan } = await request.json();

    const priceMap: Record<string, string | undefined> = {
      basic: process.env.STRIPE_BASIC_PRICE_ID,
      gold: process.env.STRIPE_GOLD_PRICE_ID,
      platinum: process.env.STRIPE_PLATINUM_PRICE_ID,
    };

    const priceId = priceMap[plan];

    if (!priceId) {
      return NextResponse.json(
        {
          error: `Missing Stripe price ID for plan: ${plan}. Check .env.local and restart npm run dev.`,
        },
        { status: 400 }
      );
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/subscription/success`,
      cancel_url: `${siteUrl}/pricing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Stripe checkout failed" },
      { status: 500 }
    );
  }
}
