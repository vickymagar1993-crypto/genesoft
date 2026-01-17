import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const body = await request.json();
    const leadsCollection = await getCollection('leads');
    const settingsCollection = await getCollection('settings');
    
    // Create lead for download tracking
    const lead = {
      id: uuidv4(),
      name: body.name,
      email: body.email,
      company: body.company || '',
      source: 'media-kit',
      status: 'New',
      createdAt: new Date().toISOString()
    };
    await leadsCollection.insertOne(lead);
    
    // Get media kit URL
    const settings = await settingsCollection.findOne({ type: 'site' }); // Fallback to 'site' type if migrated
    const generalSettings = await settingsCollection.findOne({ type: 'general' });
    
    return NextResponse.json({ 
      success: true, 
      downloadUrl: generalSettings?.mediaKitUrl || settings?.mediaKitUrl || null,
      lead 
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
