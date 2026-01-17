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
    const collection = await getCollection('settings');
    let settings = await collection.findOne({ type: 'general' });
    
    if (!settings) {
      // Check for old settings and migrate
      const oldSettings = await collection.findOne({ type: 'site' });
      
      // Calculate years of experience from 2021
      const foundingYear = 2021;
      const currentYear = new Date().getFullYear();
      const yearsOfExperience = currentYear - foundingYear;
      
      // Create or migrate settings
      settings = {
        id: uuidv4(),
        type: 'general',
        headerLogo: oldSettings?.logoUrl || '',
        footerLogo: oldSettings?.logoUrl || '',
        companyAddress: '9701 Wilshire Boulevard, 10th Floor Beverly Hills, California 90212',
        companyPhone: '',
        companyEmail: 'info@genesoftinfotech.com',
        adminPassword: 'admin123', // Still needed for initial setup/migration logic, but will address security later
        foundingYear: 2021,
        statsYearsExperience: yearsOfExperience + '+',
        statsProjectsDelivered: '200+',
        statsClientSatisfaction: '98%',
        statsDataPoints: '50M+',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await collection.insertOne(settings);
    }
    
    // Don't send password in response
    const { adminPassword, _id, ...settingsWithoutPassword } = settings;
    return NextResponse.json(settingsWithoutPassword);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    const collection = await getCollection('settings');
    
    let updateData = {};
    
    // Handle multipart/form-data (file uploads)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      
      updateData = {
        companyEmail: formData.get('companyEmail') || '',
        companyPhone: formData.get('companyPhone') || '',
        companyAddress: formData.get('companyAddress') || '',
        foundingYear: formData.get('foundingYear') || 2021,
        statsYearsExperience: formData.get('statsYearsExperience') || '',
        statsProjectsDelivered: formData.get('statsProjectsDelivered') || '',
        statsClientSatisfaction: formData.get('statsClientSatisfaction') || '',
        statsDataPoints: formData.get('statsDataPoints') || '',
        updatedAt: new Date().toISOString()
      };
      
      // Handle admin password if provided
      const adminPassword = formData.get('adminPassword');
      if (adminPassword) {
        updateData.adminPassword = adminPassword;
      }
      
      const headerLogoUrl = await handleImageUpload(formData, 'headerLogo', 'logos');
      if (headerLogoUrl) updateData.headerLogo = headerLogoUrl;

      const footerLogoUrl = await handleImageUpload(formData, 'footerLogo', 'logos');
      if (footerLogoUrl) updateData.footerLogo = footerLogoUrl;

      const faviconUrl = await handleImageUpload(formData, 'favicon', 'site');
      if (faviconUrl) updateData.favicon = faviconUrl;

      const mediaKitFile = formData.get('mediaKit');
      if (mediaKitFile && mediaKitFile.size > 0) {
          const bytes = await mediaKitFile.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const fileName = `mediakit-${Date.now()}-${mediaKitFile.name}`;
          const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'mediakit');
          if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
          fs.writeFileSync(path.join(uploadDir, fileName), buffer);
          updateData.mediaKitUrl = `/uploads/mediakit/${fileName}`;
          updateData.mediaKitName = mediaKitFile.name;
      }
    } else {
      // Handle JSON (URL-based updates)
      const body = await request.json();
      updateData = {
        headerLogo: body.headerLogo,
        footerLogo: body.footerLogo,
        companyAddress: body.companyAddress,
        companyPhone: body.companyPhone,
        companyEmail: body.companyEmail,
        foundingYear: body.foundingYear,
        statsYearsExperience: body.statsYearsExperience,
        statsProjectsDelivered: body.statsProjectsDelivered,
        statsClientSatisfaction: body.statsClientSatisfaction,
        statsDataPoints: body.statsDataPoints,
        updatedAt: new Date().toISOString()
      };
      
      // Only update password if provided
      if (body.adminPassword) {
        updateData.adminPassword = body.adminPassword;
      }
    }
    
    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) delete updateData[key];
    });
    
    const result = await collection.findOneAndUpdate(
      { type: 'general' },
      { $set: updateData },
      { returnDocument: 'after', upsert: true }
    );
    
    const { adminPassword, _id, ...settingsWithoutPassword } = result;
    return NextResponse.json(settingsWithoutPassword);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
