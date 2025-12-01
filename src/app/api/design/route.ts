import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth/jwt';
import { getAllDesignSettings, updateDesignSetting } from '@/lib/db/queries';

export async function GET() {
  try {
    const settings = getAllDesignSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching design settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { setting_key, setting_value } = body;

    updateDesignSetting(setting_key, setting_value);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating design setting:', error);
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}
