import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects, createProject, updateProject, deleteProject } from '@/lib/services';
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
      start_date: project.start_date,
      featured_image: project.featured_image,
      created_at: project.created_at,
      updated_at: project.updated_at,
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

export async function POST(request: NextRequest) {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Transform the data to match database schema
    const projectData = {
      title: body.title,
      description: body.description,
      location: body.location || null,
      status: body.status || 'planning',
      progress: Number(body.progress) || 0,
      budget: body.budget ? Number(body.budget) : null,
      raised: Number(body.raised) || 0,
      beneficiaries: body.beneficiaries ? Number(body.beneficiaries) : null,
      start_date: body.start_date ? new Date(body.start_date) : null,
      featured_image: body.featureImage || body.featured_image || null,
    };

    const newProject = await createProject(projectData);
    
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Transform the data to match database schema
    const projectData: any = {};
    if (updateData.title !== undefined) projectData.title = updateData.title;
    if (updateData.description !== undefined) projectData.description = updateData.description;
    if (updateData.location !== undefined) projectData.location = updateData.location;
    if (updateData.status !== undefined) projectData.status = updateData.status;
    if (updateData.progress !== undefined) projectData.progress = Number(updateData.progress);
    if (updateData.budget !== undefined) projectData.budget = updateData.budget ? Number(updateData.budget) : null;
    if (updateData.raised !== undefined) projectData.raised = Number(updateData.raised);
    if (updateData.beneficiaries !== undefined) projectData.beneficiaries = updateData.beneficiaries ? Number(updateData.beneficiaries) : null;
    if (updateData.start_date !== undefined) projectData.start_date = updateData.start_date ? new Date(updateData.start_date) : null;
    if (updateData.featureImage !== undefined || updateData.featured_image !== undefined) {
      projectData.featured_image = updateData.featureImage || updateData.featured_image;
    }

    const updatedProject = await updateProject(id, projectData);
    
    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Database connection failed' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    await deleteProject(Number(id));
    
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
