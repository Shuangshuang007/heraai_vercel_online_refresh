import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent } from '@/services/stripeService';
import { updateUserSubscription } from '@/services/profileDatabaseService';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    console.log('[Webhook] Received webhook request');
    console.log('[Webhook] Body length:', body.length);
    console.log('[Webhook] Signature present:', !!signature);

    if (!signature) {
      console.error('[Webhook] Missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event;
    try {
      event = await constructWebhookEvent(body, signature);
      console.log('[Webhook] Event constructed successfully:', event.type);
      console.log('[Webhook] Event data:', JSON.stringify(event.data, null, 2));
    } catch (err) {
      console.error('[Webhook] Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    // 处理checkout.session.completed事件
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('[Webhook] Processing checkout.session.completed:', {
        sessionId: session.id,
        customerEmail: session.customer_email,
        plan: session.metadata?.plan,
        amount: session.amount_total,
        metadata: session.metadata
      });

      const email = session.metadata?.email;
      const plan = session.metadata?.plan;
      const expiresAt = session.metadata?.expiresAt;

      if (!email || !plan) {
        console.error('[Webhook] Missing email or plan in session metadata');
        console.error('[Webhook] Email:', email);
        console.error('[Webhook] Plan:', plan);
        console.error('[Webhook] All metadata:', session.metadata);
        return NextResponse.json(
          { error: 'Missing required metadata' },
          { status: 400 }
        );
      }

      try {
        console.log('[Webhook] Attempting to update subscription for:', email);
        console.log('[Webhook] Plan:', plan);
        console.log('[Webhook] ExpiresAt:', expiresAt);
        
        // 更新用户订阅状态
        const success = await updateUserSubscription(email, {
          plan: plan as 'daily' | 'weekly' | 'monthly',
          expiresAt: expiresAt ? new Date(expiresAt) : undefined,
          active: true,
          stripeSessionId: session.id,
          updatedAt: new Date()
        });

        if (success) {
          console.log('[Webhook] Successfully updated subscription for:', email);
          return NextResponse.json({ success: true });
        } else {
          console.error('[Webhook] Failed to update subscription for:', email);
          return NextResponse.json(
            { error: 'Failed to update subscription' },
            { status: 500 }
          );
        }
      } catch (dbError) {
        console.error('[Webhook] Database error updating subscription:', dbError);
        return NextResponse.json(
          { error: 'Database error' },
          { status: 500 }
        );
      }
    }

    // 处理其他事件类型
    console.log('[Webhook] Unhandled event type:', event.type);
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('[Webhook] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
