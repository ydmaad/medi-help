import { NextRequest, NextResponse } from 'next/server';

const alerts: { time: string; description: string }[] = [];

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const path = url.pathname;

  if (path.endsWith('/alerts')) {
    return NextResponse.json({ alerts });
  }
  return NextResponse.json({ error: 'Invalid endpoint' }, { status: 404 });
}
