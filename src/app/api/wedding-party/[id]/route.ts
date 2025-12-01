import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { isAuthenticated } from '@/lib/auth/jwt';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// DELETE - Remove wedding party member
export async function DELETE(request: NextRequest, context: RouteContext) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const db = getDatabase();
    
    db.prepare('DELETE FROM wedding_party WHERE id = ?').run(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
  }
}
