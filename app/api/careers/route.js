import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request) {
  try {
    const collection = await getCollection('careers');
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const query = status ? { status } : {};
    
    // Sort by createdAt desc
    const careers = await collection.find(query).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(careers);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const collection = await getCollection('careers');
    
    const job = {
      id: uuidv4(),
      jobTitle: body.jobTitle,
      department: body.department || 'General',
      location: body.location || 'Remote',
      type: body.type || 'Full-time',
      description: body.description,
      requirements: body.requirements || [],
      responsibilities: body.responsibilities || [],
      salary: body.salary || '',
      status: body.status || 'Open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await collection.insertOne(job);
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
