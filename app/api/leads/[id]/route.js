import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const collection = await getCollection('leads');
    
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: body },
      { returnDocument: 'after' }
    );
    
    if (!result) {
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const collection = await getCollection('leads');
    const result = await collection.deleteOne({ id });
    
    if (result.deletedCount === 0) {
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
