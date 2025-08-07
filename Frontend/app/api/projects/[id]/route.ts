import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'obadiah_db',
  port: parseInt(process.env.DB_PORT || '3306'),
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let connection;

  try {
    // Await params to comply with Next.js 15
    const { id } = await params;
    
    // Create database connection
    connection = await mysql.createConnection(dbConfig);

    // Get project by ID
    const [rows] = await connection.execute(
      `SELECT 
        id, 
        title, 
        description, 
        location, 
        status, 
        progress, 
        budget, 
        raised, 
        beneficiaries, 
        start_date, 
        featured_image, 
        created_at, 
        updated_at 
      FROM projects 
      WHERE id = ?`,
      [id]
    );

    const projects = rows as any[];

    if (projects.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    const project = projects[0];

    // Parse images JSON if it exists (projects table doesn't have images column, so we'll use an empty array)
    project.images = [];

    // Format dates
    project.start_date = project.start_date ? new Date(project.start_date).toISOString() : null;
    project.created_at = project.created_at ? new Date(project.created_at).toISOString() : null;
    project.updated_at = project.updated_at ? new Date(project.updated_at).toISOString() : null;

    // Ensure beneficiaries is a number
    project.beneficiaries = parseInt(project.beneficiaries) || 0;

    return NextResponse.json(project);

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project from database' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
