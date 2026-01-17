import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const { password } = await request.json();
    
    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    
    const collection = await getCollection('settings');
    
    // Create default settings if needed
    const settings = {
      type: 'general',
      adminPassword: password,
      updatedAt: new Date().toISOString()
    };
    
    await collection.updateOne(
      { type: 'general' },
      { 
        $set: settings,
        $setOnInsert: {
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          // Defaults
          companyEmail: 'info@genesoftinfotech.com',
          companyAddress: '9701 Wilshire Boulevard, 10th Floor Beverly Hills, California 90212',
          foundingYear: 2021,
          statsYearsExperience: '3+', 
          statsProjectsDelivered: '200+',
          statsClientSatisfaction: '98%',
          statsDataPoints: '50M+'
        }
      },
      { upsert: true }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
