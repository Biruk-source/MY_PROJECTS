import { NextResponse } from 'next/server';
import { db } from 'cosmic-database';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = (searchParams.get('roomId') || '').trim().toUpperCase();
    const limitParam = parseInt(searchParams.get('limit') || '100', 10);
    const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 200) : 100;

    if (!roomId) return NextResponse.json({ error: 'roomId required' }, { status: 400 });

    const col = db.collection(`chat_${roomId}_messages`);
    const snapshot = await col.orderBy('createdAt').limit(limit).get();

    const messages = snapshot.docs.map((doc) => {
      const d = doc.data() as Record<string, unknown>;
      const createdAt: unknown = d.createdAt;
      let createdAtISO: string | null = null;
      // @ts-expect-error Firestore server timestamp type is not known at compile time
      if (createdAt && typeof createdAt.toDate === 'function') {
        // @ts-expect-error Firestore server timestamp toDate presence is runtime-checked
        createdAtISO = createdAt.toDate().toISOString();
      } else if (typeof createdAt === 'string') {
        createdAtISO = createdAt;
      } else {
        createdAtISO = null;
      }
      return {
        id: doc.id,
        text: (d.text as string) || '',
        sender: (d.sender as string) || 'Unknown',
        createdAt: createdAtISO,
      };
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Fetch messages error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
