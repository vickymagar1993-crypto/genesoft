import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
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

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const collection = await getCollection('services');
    const service = await collection.findOne({ $or: [{ id: id }, { slug: id }] });
    
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    
    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
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
        ...(imageUrl && { imageUrl }),
      };
    } else {
      body = await request.json();
    }

    const collection = await getCollection('services');
    const updateData = { ...body, updatedAt: new Date().toISOString() };
    delete updateData.id;

    const result = await collection.findOneAndUpdate(
      { id },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const collection = await getCollection('services');
    const result = await collection.deleteOne({ id });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
