import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/database';
import { executeQuery } from '@/lib/database';

export async function GET() {
  try {
    // Test basic connection
    const isConnected = await testConnection();
    
    if (!isConnected) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: 'Failed to connect to database',
          connection: false 
        },
        { status: 500 }
      );
    }

    // Test table access
    const tableTests = await Promise.all([
      executeQuery('SELECT COUNT(*) as count FROM projects'),
      executeQuery('SELECT COUNT(*) as count FROM blog_posts'),
      executeQuery('SELECT COUNT(*) as count FROM team_members'),
    ]);

    const [projects, blogPosts, teamMembers] = tableTests;

    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      connection: true,
      tableData: {
        projects: projects[0]?.count || 0,
        blogPosts: blogPosts[0]?.count || 0,
        teamMembers: teamMembers[0]?.count || 0,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Database test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        connection: false 
      },
      { status: 500 }
    );
  }
}
