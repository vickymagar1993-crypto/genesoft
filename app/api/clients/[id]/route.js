import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const collection = await getCollection('clients');
    const result = await collection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
