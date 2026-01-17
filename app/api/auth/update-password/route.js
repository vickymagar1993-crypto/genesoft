import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';

export async function POST(request) {
  try {
    const { currentPassword, newPassword } = await request.json();
    
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
    }
    
    const collection = await getCollection('settings');
    const settings = await collection.findOne({ type: 'general' });
    
    // Verify current password
    if (!settings || settings.adminPassword !== currentPassword) {
      return NextResponse.json({ error: 'Incorrect current password' }, { status: 401 });
    }
    
    // Update password
    await collection.updateOne(
      { type: 'general' },
      { 
        $set: { 
          adminPassword: newPassword,
          updatedAt: new Date().toISOString()
        } 
      }
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
