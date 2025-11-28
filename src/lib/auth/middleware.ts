import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from './jwt';

export async function withAuth(handler: (request: NextRequest) => Promise<NextResponse> | NextResponse) {
  return async (request: NextRequest) => {
    const authenticated = await isAuthenticated();

    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return handler(request);
  };
}
