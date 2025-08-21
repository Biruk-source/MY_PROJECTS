import { NextResponse } from 'next/server';
import { db } from 'cosmic-database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = (searchParams.get('roomId') || '').trim().toUpperCase();
    if (!roomId) return NextResponse.json({ error: 'roomId required' }, { status: 400 });

    const doc = await db.collection('rooms').doc(roomId).get();
    if (!doc.exists) return NextResponse.json({ error: 'Room not found' }, { status: 404 });

    const data = doc.data() as Record<string, unknown>;
    return NextResponse.json({
      roomId,
      status: data.status,
      hostUsername: data.hostUsername || null,
      guestUsername: data.guestUsername || null,
      joinHandle: data.joinHandle || null,
    });
  } catch (error) {
    console.error('Status error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
