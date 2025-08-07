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

    // Get campaign by ID
    const [rows] = await connection.execute(
      `SELECT 
        id, 
        title, 
        description, 
        location,
        urgency,
        beneficiaries,
        linked_blog,
        feature_image, 
        start_date, 
        end_date, 
        created_at, 
        updated_at 
      FROM campaigns 
      WHERE id = ?`,
      [id]
    );

    const campaigns = rows as any[];

    if (campaigns.length === 0) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    const campaign = campaigns[0];

    // Parse images JSON if it exists (campaigns table doesn't have images column, so we'll use an empty array)
    campaign.images = [];

    // Set default values for missing columns
    campaign.content = null;
    campaign.status = campaign.urgency || 'active';
    campaign.goal_amount = 0;
    campaign.raised_amount = 0;

    // Format dates
    campaign.start_date = campaign.start_date ? new Date(campaign.start_date).toISOString() : null;
    campaign.end_date = campaign.end_date ? new Date(campaign.end_date).toISOString() : null;
    campaign.created_at = campaign.created_at ? new Date(campaign.created_at).toISOString() : null;
    campaign.updated_at = campaign.updated_at ? new Date(campaign.updated_at).toISOString() : null;

    return NextResponse.json(campaign);

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign from database' },
      { status: 500 }
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
