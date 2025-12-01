import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth/jwt';
import { getAllRSVPs, createRSVP, deleteRSVP, getRSVPStats } from '@/lib/db/queries';
import { rsvpSchema } from '@/lib/validations/rsvp';

export async function GET(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    if (action === 'stats') {
      const stats = getRSVPStats();
      return NextResponse.json(stats);
    }

    const rsvps = getAllRSVPs();
    return NextResponse.json(rsvps);
  } catch (error) {
    console.error('Error fetching RSVPs:', error);
    return NextResponse.json({ error: 'Failed to fetch RSVPs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = rsvpSchema.parse(body);

    // Get IP address
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Create RSVP
    const result = createRSVP({
      ...validatedData,
      ip_address: ip,
    });

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error: any) {
    console.error('Error creating RSVP:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid form data', details: error.errors }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to submit RSVP' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    deleteRSVP(parseInt(id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting RSVP:', error);
    return NextResponse.json({ error: 'Failed to delete RSVP' }, { status: 500 });
  }
}
