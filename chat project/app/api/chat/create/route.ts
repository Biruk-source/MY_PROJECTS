import { NextResponse } from 'next/server';
import { db } from 'cosmic-database';

interface CreateBody {
  username?: string;
  handle?: string | null;
  clientKey?: string | null;
}

function generateRoomId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = '';
  for (let i = 0; i < 6; i += 1) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as CreateBody;
    const username = (data.username || '').trim().slice(0, 24) || 'Host';
    const clientKey = (data.clientKey || '').trim().slice(0, 64) || null;
    const handleRaw = (data.handle || '').trim().toLowerCase();
    const handle = handleRaw ? handleRaw.replace(/[^a-z0-9_-]/g, '').slice(0, 24) : null;

    // If handle is provided, ensure uniqueness
    if (handle) {
      const handleSnap = await db.collection('rooms')
        .where('joinHandle', '==', handle)
        .limit(1)
        .get();
      if (!handleSnap.empty) {
        return NextResponse.json({ error: 'Handle already in use' }, { status: 400 });
      }
    }

    const roomId = generateRoomId();
    await db.collection('rooms').doc(roomId).set({
      roomId,
      status: 'waiting',
      hostUsername: username,
      guestUsername: null,
      joinHandle: handle ?? null,
      hostKey: clientKey ?? null,
      createdAt: db.FieldValue.serverTimestamp(),
      updatedAt: db.FieldValue.serverTimestamp(),
    });

    const joinUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/?room=${roomId}`;

    return NextResponse.json({ success: true, roomId, joinUrl });
  } catch (error) {
    console.error('Create room error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
