import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * File upload handler for Next.js
 * 
 * This handler saves the actual file to the filesystem in the public/uploads folder
 * so that the images can be served statically.
 */
export async function POST(request: NextRequest) {
  try {
    console.log('Upload API received request');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string;
    
    if (!file) {
      console.error('No file received');
      return NextResponse.json({ error: 'No file received' }, { status: 400 });
    }
    
    if (!folder) {
      console.error('Missing folder field');
      return NextResponse.json({ error: 'Missing required field: folder' }, { status: 400 });
    }
    
    // Validate folder name
    const allowedFolders = ['sponsors', 'projects', 'campaigns', 'blog', 'stories', 'team', 'gallery', 'authors', 'uploads'];
    if (!allowedFolders.includes(folder)) {
      console.error(`Invalid folder: ${folder}`);
      return NextResponse.json({ error: 'Invalid folder' }, { status: 400 });
    }
    
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 9);
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const extension = originalName.split('.').pop() || 'jpg';
    const filename = `${timestamp}_${randomStr}.${extension}`;
    
    // Create directory path
    const uploadDir = join(process.cwd(), 'public', 'uploads', folder);
    console.log(`Saving to directory: ${uploadDir}`);
    
    // Check if directory exists, if not create it
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    // Full path for the file
    const filePath = join(uploadDir, filename);
    
    // Write the file
    await writeFile(filePath, buffer);
    console.log(`File saved to: ${filePath}`);
    
    // Create a public URL path
    const publicUrl = `/uploads/${folder}/${filename}`;
    console.log(`Public URL: ${publicUrl}`);
    
    // Return the URL that can be used in the frontend
    return NextResponse.json({ 
      success: true,
      url: publicUrl 
    }, { status: 201 });
  } catch (error) {
    console.error('Error in upload handler:', error);
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      error: 'Server error processing upload',
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
