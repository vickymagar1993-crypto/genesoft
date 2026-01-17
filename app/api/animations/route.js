import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const collection = await getCollection('animations');
    const animations = await collection.find({}).toArray();
    return NextResponse.json(animations);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const collection = await getCollection('animations');
    
    const animation = {
      id: uuidv4(),
      name: body.name,
      elementType: body.elementType,
      config: body.config,
      isGlobal: body.isGlobal || false,
      createdAt: new Date().toISOString()
    };
    
    await collection.insertOne(animation);
    return NextResponse.json(animation, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
