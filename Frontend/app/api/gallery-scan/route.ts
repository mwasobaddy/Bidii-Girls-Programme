import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    
    // Define the folders to scan
    const folders = [
      'authors',
      'blog', 
      'campaigns',
      'projects',
      'stories',
      'team',
      'sponsors',
      'gallery',
      'uploads'
    ];
    
    const images: any[] = [];
    
    // Scan each folder for images
    for (const folder of folders) {
      // Skip if filtering by category and this isn't the requested category
      if (category && category !== 'all' && category !== folder) {
        continue;
      }
      
      const folderPath = path.join(uploadsDir, folder);
      
      try {
        // Check if folder exists
        await fs.access(folderPath);
        
        // Read folder contents
        const files = await fs.readdir(folderPath);
        
        // Filter for image files
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
        const imageFiles = files.filter(file => 
          imageExtensions.some(ext => file.toLowerCase().endsWith(ext))
        );
        
        // Get file stats and create image objects
        for (const file of imageFiles) {
          const filePath = path.join(folderPath, file);
          const stats = await fs.stat(filePath);
          
          images.push({
            name: file,
            url: `/uploads/${folder}/${file}`,
            category: folder,
            size: stats.size,
            lastModified: stats.mtime,
          });
        }
      } catch (error) {
        // Folder doesn't exist or can't be read - skip it
        console.log(`Folder ${folder} not accessible:`, error);
        continue;
      }
    }
    
    // Sort by last modified date (newest first)
    images.sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
    
    return NextResponse.json(images);
  } catch (error) {
    console.error('Error scanning gallery images:', error);
    return NextResponse.json(
      { error: 'Failed to scan gallery images' },
      { status: 500 }
    );
  }
}
