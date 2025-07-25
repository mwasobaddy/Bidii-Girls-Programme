import { executeQuery } from '../../../../Backend/config/database.js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const query = 'SELECT * FROM projects ORDER BY created_at DESC';
    const projects = await executeQuery(query);
    
    return NextResponse.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Projects API Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      title, 
      description, 
      location, 
      status, 
      progress, 
      budget, 
      raised, 
      beneficiaries, 
      start_date, 
      featured_image 
    } = body;
    
    const query = `
      INSERT INTO projects (
        title, description, location, status, progress, 
        budget, raised, beneficiaries, start_date, featured_image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      title, description, location, status || 'planning', 
      progress || 0, budget, raised || 0, beneficiaries, 
      start_date, featured_image
    ];
    
    const result = await executeQuery(query, params);
    
    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Projects POST Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    }, { status: 500 });
  }
}
