import { NextRequest, NextResponse } from 'next/server';
import { addOriginalResumeToProfile } from '@/services/profileDatabaseService';

export async function POST(request: NextRequest) {
  try {
    const { email, resumeData } = await request.json();
    
    if (!email || !resumeData) {
      return NextResponse.json(
        { success: false, error: 'Email and resume data are required' },
        { status: 400 }
      );
    }

    const success = await addOriginalResumeToProfile(email, {
      id: resumeData.id,
      name: resumeData.name,
      pdfUrl: resumeData.pdfUrl
    });

    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Resume saved to profile successfully' 
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to save resume to profile' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[Save Resume API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
