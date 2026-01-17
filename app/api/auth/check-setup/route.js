import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';

export async function GET() {
  try {
    const collection = await getCollection('settings');
    const settings = await collection.findOne({ type: 'general' });
    
    // If no settings or password is default/empty, setup is needed
    // Checking for 'admin123' as default based on previous logic, but in prod ideally checking strict match
    const isSetupNeeded = !settings || !settings.adminPassword || settings.adminPassword === 'admin123';
    
    return NextResponse.json({ isSetupNeeded });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
