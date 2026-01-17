import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    const collection = await getCollection('settings');
    const settings = await collection.findOne({ type: 'general' });
    
    // Simple password check (should be hashed in production!)
    if (settings && settings.adminPassword === password) {
       // In a real app, return a JWT token or set a session cookie
       return NextResponse.json({ success: true, token: 'fake-jwt-token' });
    }
    
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
