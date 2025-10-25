import { NextRequest, NextResponse } from 'next/server';
import { getUserProfile } from '@/services/profileDatabaseService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const profile = await getUserProfile(email);
    
    if (profile) {
      return NextResponse.json({ 
        success: true, 
        profile 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Profile not found' 
      });
    }

  } catch (error) {
    console.error('[Profile Get API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
