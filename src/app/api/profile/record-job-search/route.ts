import { NextRequest, NextResponse } from 'next/server';
import { addJobSearchToProfile } from '@/services/profileDatabaseService';

export async function POST(request: NextRequest) {
  try {
    const { email, jobTitle, location } = await request.json();
    
    if (!email || !jobTitle || !location) {
      return NextResponse.json(
        { success: false, error: 'Email, jobTitle, and location are required' },
        { status: 400 }
      );
    }

    const success = await addJobSearchToProfile(email, {
      jobTitle,
      location
    });

    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Job search recorded successfully' 
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to record job search' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[Record Job Search API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}




