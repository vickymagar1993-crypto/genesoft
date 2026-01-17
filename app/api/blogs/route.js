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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const collection = await getCollection('blogs');
    const query = status ? { status } : {};
    
    const blogs = await collection.find(query).sort({ createdAt: -1 }).toArray();
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    const collection = await getCollection('blogs');
    let blogData = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const coverImageUrl = await handleImageUpload(formData, 'coverImage', 'blogs');
      
      const title = formData.get('title');
      const content = formData.get('content');
      const excerpt = formData.get('excerpt');
      const author = formData.get('author');
      const tags = formData.get('tags');
      const status = formData.get('status');

      blogData = {
        id: uuidv4(),
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        content,
        excerpt: excerpt || content.substring(0, 160) + '...',
        coverImageUrl: coverImageUrl || '',
        author: author || 'Admin',
        tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        status: status || 'Draft',
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    } else {
      const body = await request.json();
      blogData = {
        id: uuidv4(),
        title: body.title,
        slug: body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        content: body.content,
        excerpt: body.excerpt || body.content.substring(0, 160) + '...',
        coverImageUrl: body.coverImageUrl || '',
        author: body.author || 'Admin',
        tags: body.tags || [],
        status: body.status || 'Draft',
        views: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    
    await collection.insertOne(blogData);
    return NextResponse.json(blogData, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
