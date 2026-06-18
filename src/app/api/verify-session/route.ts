import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2026-05-27.dahlia',
  });

  try {
    const { session_id } = await req.json();

    if (!session_id) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Ensure the session is actually paid
    if (session.payment_status === 'paid') {
      return NextResponse.json({ status: 'paid', customer_email: session.customer_details?.email });
    } else {
      return NextResponse.json({ status: 'unpaid' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Verify Session Error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
