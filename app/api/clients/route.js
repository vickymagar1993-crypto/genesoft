import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

// Helper to handle client logo upload
async function handleLogoUpload(formData) {
  const file = formData.get('logo');
  if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${uuidv4()}-${safeName}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'logos');
      
      if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      fs.writeFileSync(path.join(uploadDir, fileName), buffer);
      return `/uploads/logos/${fileName}`;
  }
  return '';
}

export async function GET() {
  try {
    const collection = await getCollection('clients');
    const clients = await collection.find({}).sort({ sortOrder: 1 }).toArray();
    return NextResponse.json(clients);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    const collection = await getCollection('clients');
    let clientData = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const logoUrl = await handleLogoUpload(formData);
      
      clientData = {
        id: uuidv4(),
        companyName: formData.get('companyName'),
        logoUrl,
        website: formData.get('website') || '',
        sortOrder: 0,
        isActive: true,
        createdAt: new Date().toISOString()
      };
    } else {
      const body = await request.json();
      clientData = {
        id: uuidv4(),
        companyName: body.companyName,
        logoUrl: body.logoUrl || '',
        website: body.website || '',
        sortOrder: body.sortOrder || 0,
        isActive: body.isActive !== false,
        createdAt: new Date().toISOString()
      };
    }

    await collection.insertOne(clientData);
    return NextResponse.json(clientData, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
