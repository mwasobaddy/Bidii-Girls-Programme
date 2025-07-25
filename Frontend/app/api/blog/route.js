import { executeQuery } from '../../../../Backend/config/database.js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const published = searchParams.get('published');
    
    let query = 'SELECT * FROM blog_posts';
    let params = [];
    
    if (published !== null) {
      query += ' WHERE published = ?';
      params.push(published === 'true');
    }
    
    query += ' ORDER BY created_at DESC';
    
    const posts = await executeQuery(query, params);
    
    return NextResponse.json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Blog API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch blog posts',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, category, author, featured_image, published } = body;
    
    const query = `
      INSERT INTO blog_posts (title, slug, excerpt, content, category, author, featured_image, published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [title, slug, excerpt, content, category, author, featured_image, published || false];
    const result = await executeQuery(query, params);
    
    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Blog POST Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create blog post',
      error: error.message
    }, { status: 500 });
  }
}
