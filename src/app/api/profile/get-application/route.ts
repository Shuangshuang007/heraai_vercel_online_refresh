import { NextRequest, NextResponse } from 'next/server';
import { connectToProfileDB } from '@/services/profileDatabaseService';

export async function POST(request: NextRequest) {
  try {
    const { email, jobId } = await request.json();
    
    if (!email || !jobId) {
      return NextResponse.json(
        { error: 'Email and jobId are required' },
        { status: 400 }
      );
    }

    const { db } = await connectToProfileDB();
    const collection = db.collection('profiles');
    
    // 查询特定job的application数据
    const profile = await collection.findOne(
      { 
        email, 
        'applications.jobId': jobId 
      },
      { 
        projection: {
          'applications.$': 1,
          email: 1
        }
      }
    );

    if (!profile || !profile.applications || profile.applications.length === 0) {
      return NextResponse.json({
        success: true,
        application: null
      });
    }

    const application = profile.applications[0];
    
    return NextResponse.json({
      success: true,
      application
    });

  } catch (error) {
    console.error('[Get Application] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get application data' 
      },
      { status: 500 }
    );
  }
}



