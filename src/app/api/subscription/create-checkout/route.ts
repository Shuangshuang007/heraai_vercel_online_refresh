import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/services/stripeService';

export async function POST(request: NextRequest) {
  try {
    const { email, plan, successUrl, cancelUrl } = await request.json();

    if (!email || !plan || !successUrl || !cancelUrl) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const session = await createCheckoutSession({
      email,
      plan,
      successUrl,
      cancelUrl
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('[Subscription] Error creating checkout:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
