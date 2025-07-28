import { NextResponse } from 'next/server';
import pool from '@/lib/database';

export async function GET() {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM gallery_images ORDER BY order_index ASC'
    );

    const galleryImages = rows as Array<{
      id: number;
      title: string;
      description: string;
      category: string;
      image_url: string;
      alt_text: string;
      order_index: number;
    }>;

    return NextResponse.json(galleryImages);

  } catch (error) {
    console.error('Gallery API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    );
  }
}
