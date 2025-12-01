import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth/jwt';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{
    sectionKey: string;
  }>;
}

// GET - Fetch section by key
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { sectionKey } = await context.params;
    const db = getDatabase();
    
    const section = db
      .prepare('SELECT * FROM sections WHERE section_key = ?')
      .get(sectionKey);

    if (!section) {
      return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    }

    return NextResponse.json(section);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch section' }, { status: 500 });
  }
}

// PUT - Update section
export async function PUT(request: NextRequest, context: RouteContext) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { sectionKey } = await context.params;
    const body = await request.json();
    const db = getDatabase();

    const updateFields: string[] = [];
    const values: any[] = [];

    if (body.content_json !== undefined) {
      updateFields.push('content_json = ?');
      values.push(body.content_json);
    }

    if (body.is_visible !== undefined) {
      updateFields.push('is_visible = ?');
      values.push(body.is_visible ? 1 : 0);
    }

    if (body.section_title !== undefined) {
      updateFields.push('section_title = ?');
      values.push(body.section_title);
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(sectionKey);

    const query = `
      UPDATE sections 
      SET ${updateFields.join(', ')} 
      WHERE section_key = ?
    `;

    db.prepare(query).run(...values);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating section:', error);
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 });
  }
}

// PATCH - Partial update (e.g., toggle visibility)
export async function PATCH(request: NextRequest, context: RouteContext) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { sectionKey } = await context.params;
    const body = await request.json();
    const db = getDatabase();

    if (body.is_visible !== undefined) {
      db.prepare('UPDATE sections SET is_visible = ?, updated_at = CURRENT_TIMESTAMP WHERE section_key = ?')
        .run(body.is_visible ? 1 : 0, sectionKey);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 });
  }
}
