import { NextRequest, NextResponse } from 'next/server';
import { getAllTeamMembers } from '@/lib/services';
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
