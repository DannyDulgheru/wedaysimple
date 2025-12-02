import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth/jwt';

export const dynamic = 'force-dynamic';

// GET - Fetch all wedding party members
export async function GET() {
  try {
    const db = getDatabase();
    const members = db
      .prepare('SELECT * FROM wedding_party WHERE is_visible = 1 ORDER BY display_order ASC')
      .all();

    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}

// PUT - Bulk update/create members
export async function PUT(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { members } = await request.json();
    const db = getDatabase();

    // Delete all existing members and recreate
    db.prepare('DELETE FROM wedding_party').run();

    const stmt = db.prepare(`
      INSERT INTO wedding_party (name, role, category, photo_url, description, display_order)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    members.forEach((member: any, index: number) => {
      stmt.run(
        member.name,
        member.role,
        member.category || 'nasi',
        member.photo_url || '',
        member.description || '',
        index + 1
      );
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating members:', error);
    return NextResponse.json({ error: 'Failed to update members' }, { status: 500 });
  }
}
