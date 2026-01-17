import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

// Helper for image upload processing
async function handleImageUpload(formData, fieldName, subDir) {
  const imageFile = formData.get(fieldName);
  if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      // Clean filename
      const safeName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${fieldName.replace('Image', '')}-${Date.now()}-${safeName}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', subDir);
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);
      return `/uploads/${subDir}/${fileName}`;
  }
  return null;
}

export async function GET() {
  try {
    const collection = await getCollection('services');
    const services = await collection.find({}).sort({ sortOrder: 1 }).toArray();
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let body;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const imageUrl = await handleImageUpload(formData, 'serviceImage', 'services');

      body = {
        title: formData.get('title'),
        description: formData.get('description'),
        shortDescription: formData.get('shortDescription'),
        iconName: formData.get('iconName') || 'Briefcase',
        features: formData.get('features') ? formData.get('features').split(',').map(f => f.trim()).filter(f => f) : [],
        isFeatured: formData.get('isFeatured') === 'true',
        imageUrl: imageUrl || '',
      };
    } else {
      body = await request.json();
    }

    const collection = await getCollection('services');
    const service = {
      id: uuidv4(),
      title: body.title,
      slug: body.slug || body.title.toLowerCase().replace(/\s+/g, '-'),
      description: body.description,
      shortDescription: body.shortDescription || '',
      iconName: body.iconName || 'Briefcase',
      features: body.features || [],
      imageUrl: body.imageUrl || '',
      animationConfig: body.animationConfig || JSON.stringify({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } }),
      sortOrder: body.sortOrder || 0,
      isActive: body.isActive !== false,
      isFeatured: body.isFeatured || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await collection.insertOne(service);
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
