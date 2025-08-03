
import { NextResponse } from 'next/server';
import { getAllCampaigns, getCampaignById, createCampaign, updateCampaign, deleteCampaign } from '@/lib/services';
import { testConnection } from '@/lib/database';

export async function GET(request: Request) {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
      const campaign = await getCampaignById(Number(id));
      return NextResponse.json(campaign || {}, { status: campaign ? 200 : 404 });
    }
    const campaigns = await getAllCampaigns();
    // Optionally transform campaigns for frontend here
    return NextResponse.json(campaigns, { status: 200 });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
    const body = await request.json();
    // Validate required fields
    if (!body.title || !body.description || !body.location || !body.urgency || !body.beneficiaries) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const newCampaign = await createCampaign(body);
    return NextResponse.json(newCampaign, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error('PUT /api/campaigns: Database connection failed');
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
    const body = await request.json();
    const { id, ...updateFields } = body;
    if (!id) {
      console.error('PUT /api/campaigns: Missing campaign ID');
      return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 });
    }
    try {
      const updatedCampaign = await updateCampaign(id, updateFields);
      return NextResponse.json(updatedCampaign, { status: 200 });
    } catch (dbError: any) {
      console.error('PUT /api/campaigns: DB error', dbError);
      return NextResponse.json({ error: dbError?.message || 'Failed to update campaign' }, { status: 500 });
    }
  } catch (error) {
    console.error('PUT /api/campaigns: Unexpected error', error);
    return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing campaign id' }, { status: 400 });
    }
    await deleteCampaign(Number(id));
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 });
  }
}
