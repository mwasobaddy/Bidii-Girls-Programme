import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects } from '@/lib/services';
import { testConnection } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Fetch projects from database
    const projects = await getAllProjects();

    // Transform data to match frontend expectations
    const transformedProjects = projects.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      image: project.featured_image || "/placeholder.svg?height=300&width=400",
      status: project.status,
      location: project.location,
      beneficiaries: project.beneficiaries,
      startDate: project.start_date ? new Date(project.start_date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      }) : 'TBD',
      progress: project.progress,
      budget: project.budget,
      raised: project.raised,
      blogId: project.id, // For now, using project ID as blog ID
    }));

    return NextResponse.json(transformedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
