import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth/jwt';

export const dynamic = 'force-dynamic';

// GET - Fetch all timeline events
export async function GET() {
  try {
    const db = getDatabase();
    const events = db
      .prepare('SELECT * FROM timeline_events WHERE is_visible = 1 ORDER BY display_order ASC')
      .all();

    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch timeline events' }, { status: 500 });
  }
}

// PUT - Bulk update/create timeline events
export async function PUT(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { events } = await request.json();
    const db = getDatabase();

    // Delete all existing events and recreate
    db.prepare('DELETE FROM timeline_events').run();

    const stmt = db.prepare(`
      INSERT INTO timeline_events (event_title, event_date, event_description, display_order)
      VALUES (?, ?, ?, ?)
    `);

    for (const event of events) {
      stmt.run(
        event.event_title,
        event.event_date,
        event.event_description,
        event.display_order
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating timeline events:', error);
    return NextResponse.json({ error: 'Failed to update timeline events' }, { status: 500 });
  }
}
