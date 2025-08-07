import { NextRequest, NextResponse } from 'next/server';
import { getAllSponsors, getSponsorById, createSponsor, updateSponsor, deleteSponsor } from '@/lib/services';
import { testConnection } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
      const sponsor = await getSponsorById(Number(id));
      return NextResponse.json(sponsor || {}, { status: sponsor ? 200 : 404 });
    }
    const sponsors = await getAllSponsors();
    return NextResponse.json(sponsors, { status: 200 });
  } catch (error) {
    console.error('Error fetching sponsors:', error);
    return NextResponse.json({ error: 'Failed to fetch sponsors' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
    
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: 'Missing required field: name' }, { status: 400 });
    }
    
    console.log('Creating sponsor with data:', body);
    
    // Create sponsor in database
    try {
      const newSponsor = await createSponsor({
        name: body.name,
        logo: body.logo ?? null,
        website: body.website ?? null,
      });
      return NextResponse.json(newSponsor, { status: 201 });
    } catch (dbError: any) {
      console.error('Database error creating sponsor:', dbError);
      return NextResponse.json({ 
        error: 'Database error creating sponsor', 
        message: dbError.message || 'Unknown database error'
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Unexpected error creating sponsor:', error);
    return NextResponse.json({ 
      error: 'Failed to create sponsor',
      message: error.message || 'Unknown error'
    }, { status: 500 });
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
      return NextResponse.json({ error: 'Sponsor ID is required' }, { status: 400 });
    }
    const updated = await updateSponsor(id, updateFields);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('Error updating sponsor:', error);
    return NextResponse.json({ error: 'Failed to update sponsor' }, { status: 500 });
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
      return NextResponse.json({ error: 'Missing sponsor id' }, { status: 400 });
    }
    await deleteSponsor(Number(id));
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting sponsor:', error);
    return NextResponse.json({ error: 'Failed to delete sponsor' }, { status: 500 });
  }
}
