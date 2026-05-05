import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');
  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing webhook configuration' }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);

    // Add SUPABASE_SERVICE_ROLE_KEY only on Vercel server env, never in frontend code.
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (serviceKey && supabaseUrl && event.type === 'checkout.session.completed') {
      const session: any = event.data.object;
      const admin = createClient(supabaseUrl, serviceKey);
      // Optional: map Stripe customer email to auth user/profile before updating subscriptions.
      await admin.from('subscriptions').insert({ stripe_customer_id: session.customer, stripe_subscription_id: session.subscription, status: 'active', plan: 'premium' });
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
