import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2026-05-27.dahlia',
  });

  const origin = req.headers.get('origin') || 'http://localhost:3000';
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'azn',
            product_data: {
              name: 'ASRALI PRO Paket (Aylıq)',
              description: 'Bütün modullara limitsiz giriş və avtomatlaşdırma',
            },
            unit_amount: 5782, // 57.82 AZN in qəpik
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/erp/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/erp/upgrade/checkout`,
    });

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
