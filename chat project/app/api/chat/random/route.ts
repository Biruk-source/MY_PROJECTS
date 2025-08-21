import { NextResponse } from 'next/server';
import { db } from 'cosmic-database';

interface RandomBody {
  username?: string | null;
  clientKey?: string | null;
}

interface RoomCandidate {
  id: string;
  joinHandle?: string | null;
  hostKey?: string | null;
  status?: string;
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as RandomBody;
    const username = (data.username || '').trim().slice(0, 24) || 'User';
    const clientKey = (data.clientKey || '').trim().slice(0, 64) || '';

    // Try to find an existing waiting room (no handle) not created by same clientKey
    const snap = await db.collection('rooms')
      .where('status', '==', 'waiting')
      .limit(10)
      .get();

    const candidates: RoomCandidate[] = snap.docs
      .map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) }))
      .map((d) => ({
        id: d.id as string,
        joinHandle: (d as Record<string, unknown>).joinHandle as string | null | undefined,
        hostKey: (d as Record<string, unknown>).hostKey as string | null | undefined,
        status: (d as Record<string, unknown>).status as string | undefined,
      }));

    const filtered = candidates.filter((d) => !d.joinHandle && (!d.hostKey || d.hostKey !== clientKey));

    if (filtered.length > 0) {
      const pick = filtered[Math.floor(Math.random() * filtered.length)];
      const ref = db.collection('rooms').doc(pick.id);

      // Double-check status
      const latest = await ref.get();
      if (latest.exists && (latest.data() as Record<string, unknown>).status === 'waiting') {
        await ref.update({
          guestUsername: username,
          status: 'active',
          updatedAt: db.FieldValue.serverTimestamp(),
        });
        return NextResponse.json({ success: true, roomId: pick.id, status: 'active' });
      }
    }

    // Otherwise create a new waiting room
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let roomId = '';
    for (let i = 0; i < 6; i += 1) roomId += chars[Math.floor(Math.random() * chars.length)];

    await db.collection('rooms').doc(roomId).set({
      roomId,
      status: 'waiting',
      hostUsername: username,
      guestUsername: null,
      joinHandle: null,
      hostKey: clientKey || null,
      createdAt: db.FieldValue.serverTimestamp(),
      updatedAt: db.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, roomId, status: 'waiting' });
  } catch (error) {
    console.error('Random match error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
