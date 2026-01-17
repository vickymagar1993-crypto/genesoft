import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const collection = await getCollection('animations');
    
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: body },
      { returnDocument: 'after' }
    );
    
    if (!result) {
        return NextResponse.json({ error: 'Animation config not found' }, { status: 404 });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
