import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/db';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

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
    const collection = await getCollection('blogs');
    const blog = await collection.findOne({ $or: [{ id: id }, { slug: id }] });
    
    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    // Increment views
    await collection.updateOne({ id: blog.id }, { $inc: { views: 1 } });
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const contentType = request.headers.get('content-type') || '';
    const collection = await getCollection('blogs');
    let updateData = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const coverImageUrl = await handleImageUpload(formData, 'coverImage', 'blogs');
      
      updateData = {
        title: formData.get('title'),
        content: formData.get('content'),
        excerpt: formData.get('excerpt'),
        author: formData.get('author'),
        tags: formData.get('tags') ? formData.get('tags').split(',').map(t => t.trim()).filter(Boolean) : [],
        status: formData.get('status'),
        updatedAt: new Date().toISOString()
      };
      
      if (updateData.title) {
          updateData.slug = updateData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }

      if (coverImageUrl) {
          updateData.coverImageUrl = coverImageUrl;
      }
      
      // Clean undefined
      Object.keys(updateData).forEach(key => {
          if (updateData[key] === null || updateData[key] === undefined || updateData[key] === '') {
            delete updateData[key];
          }
      });
    } else {
      const body = await request.json();
      updateData = { ...body, updatedAt: new Date().toISOString() };
      if (body.title) {
          updateData.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      delete updateData.id;
    }

    const result = await collection.findOneAndUpdate(
      { id },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    
    if (!result) {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const collection = await getCollection('blogs');
    const result = await collection.deleteOne({ id });
    
    if (result.deletedCount === 0) {
        return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
