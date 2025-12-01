import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth/jwt';
import { getAllSections, updateSection, toggleSectionVisibility } from '@/lib/db/queries';

export async function GET() {
  try {
    const sections = getAllSections();
    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error fetching sections:', error);
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, action, ...data } = body;

    if (action === 'toggle') {
      toggleSectionVisibility(id, data.is_visible);
    } else {
      updateSection(id, data);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating section:', error);
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 });
  }
}
