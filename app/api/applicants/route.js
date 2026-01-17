import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

// Helper for resume upload
async function handleResumeUpload(formData) {
  const file = formData.get('resume');
  if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${uuidv4()}-${safeName}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      fs.writeFileSync(path.join(uploadDir, fileName), buffer);
      return `/uploads/${fileName}`;
  }
  return '';
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20'); // Pagination added
    const skip = (page - 1) * limit;

    const collection = await getCollection('applicants');
    const query = jobId ? { jobId } : {};
    
    // Adding pagination logic
    const total = await collection.countDocuments(query);
    const applicants = await collection.find(query)
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      data: applicants,
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
    let formData;
    try {
      formData = await request.formData();
    } catch (error) {
      return NextResponse.json({ error: 'Invalid multipart form data' }, { status: 400 });
    }

    const resumeUrl = await handleResumeUpload(formData);
    const collection = await getCollection('applicants');
    
    const applicant = {
      id: uuidv4(),
      jobId: formData.get('jobId'),
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone') || '',
      coverLetter: formData.get('coverLetter') || '',
      resumeUrl,
      status: 'New',
      appliedAt: new Date().toISOString()
    };

    await collection.insertOne(applicant);
    return NextResponse.json(applicant, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
