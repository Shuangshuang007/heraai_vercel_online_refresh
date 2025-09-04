import { NextRequest, NextResponse } from 'next/server';
import { upsertUserProfile } from '@/services/profileDatabaseService';

export async function POST(request: NextRequest) {
  try {
    const { email, registeredEmail, firstName, lastName, jobTitle, location } = await request.json();
    
    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, firstName, and lastName are required' },
        { status: 400 }
      );
    }

    const success = await upsertUserProfile({
      email,
      registeredEmail: registeredEmail || email, // 如果没有提供registeredEmail，使用email作为默认值
      firstName,
      lastName,
      jobTitle,
      location
    });

    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Profile saved successfully' 
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to save profile' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('[Profile Save API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
