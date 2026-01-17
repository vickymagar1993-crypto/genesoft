import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20'); // Pagination added
    const skip = (page - 1) * limit;

    const collection = await getCollection('leads');
    
    // Adding pagination logic
    const total = await collection.countDocuments();
    const leads = await collection.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
        data: leads,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const collection = await getCollection('leads');
    
    const lead = {
      id: uuidv4(),
      name: body.name,
      email: body.email,
      company: body.company || '',
      phone: body.phone || '',
      message: body.message || '',
      serviceInterest: body.serviceInterest || '',
      source: body.source || 'contact',
      status: 'New',
      createdAt: new Date().toISOString()
    };
    
    await collection.insertOne(lead);
    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
