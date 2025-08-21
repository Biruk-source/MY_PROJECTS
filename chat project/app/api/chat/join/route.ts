import { NextResponse } from 'next/server';
import { db } from 'cosmic-database';

interface JoinBody {
  roomId?: string | null;
  handle?: string | null;
  username?: string | null;
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as JoinBody;
    const username = (data.username || '').trim().slice(0, 24) || 'Guest';
    const roomIdParam = (data.roomId || '').trim().toUpperCase();
    const handleParam = (data.handle || '').trim().toLowerCase();

    let roomId = roomIdParam || '';

    if (!roomId && !handleParam) {
      return NextResponse.json({ error: 'Provide roomId or handle' }, { status: 400 });
    }

    if (!roomId && handleParam) {
      const snap = await db.collection('rooms')
        .where('joinHandle', '==', handleParam)
        .limit(1)
        .get();
      if (snap.empty) {
        return NextResponse.json({ error: 'Room not found for handle' }, { status: 404 });
      }
      roomId = snap.docs[0].id;
    }

    const docRef = db.collection('rooms').doc(roomId);
    const roomDoc = await docRef.get();
    if (!roomDoc.exists) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const room = roomDoc.data() as Record<string, unknown>;
    const status = (room.status as string) || 'waiting';
    if (status === 'active') {
      // Allow rejoin; just return status without overwriting names
      return NextResponse.json({ success: true, roomId, status: 'active' });
    }

    await docRef.update({
      guestUsername: username,
      status: 'active',
      updatedAt: db.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, roomId, status: 'active' });
  } catch (error) {
    console.error('Join room error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
