import { NextRequest, NextResponse } from 'next/server';
import { getAllTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from '@/lib/services';
export async function POST(request: NextRequest) {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
    const body = await request.json();
    // Validate required fields
    if (!body.name || !body.role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const newMember = await createTeamMember({
      name: body.name,
      role: body.role,
      bio: body.bio ?? null,
      image: body.image ?? null,
      email: body.email ?? null,
      linkedin: body.linkedin ?? null,
      twitter: body.twitter ?? null,
      order_index: body.order_index ?? 0,
      active: body.active ?? true,
    });
    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
    const body = await request.json();
    const { id, ...updateFields } = body;
    if (!id) {
      return NextResponse.json({ error: 'Team member ID is required' }, { status: 400 });
    }
    const updated = await updateTeamMember(id, updateFields);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json({ error: 'Failed to update team member' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing team member id' }, { status: 400 });
    }
    await deleteTeamMember(Number(id));
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 });
  }
}
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

    // Fetch team members from database
    const teamMembers = await getAllTeamMembers();

    // Transform data to match frontend expectations
    const transformedMembers = teamMembers.map(member => ({
      id: member.id,
      name: member.name,
      role: member.role,
      image: member.image || "/placeholder.svg?height=300&width=300",
      bio: member.bio || `${member.name} is a dedicated member of our team working towards our mission of empowering girls.`,
      email: member.email || 'info@bidiigirls.org',
      linkedin: member.linkedin || '#',
      twitter: member.twitter || '#',
      order_index: member.order_index,
      active: member.active,
    }));

    return NextResponse.json(transformedMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}
