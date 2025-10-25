import { NextRequest, NextResponse } from 'next/server';
import { getUserSubscriptionStatus } from '@/services/profileDatabaseService';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const status = await getUserSubscriptionStatus(email);
    return NextResponse.json(status);
  } catch (error) {
    console.error('[Subscription] Error getting status:', error);
    return NextResponse.json(
      { error: 'Failed to get subscription status' },
      { status: 500 }
    );
  }
}
