import { NextResponse } from 'next/server';
import { db } from 'cosmic-database';

interface SendBody {
  roomId: string;
  sender: string;
  text: string;
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as SendBody;
    const roomId = (data.roomId || '').trim().toUpperCase();
    const sender = (data.sender || '').trim().slice(0, 24) || 'User';
    const text = (data.text || '').toString().slice(0, 1000);

    if (!roomId || !text) {
      return NextResponse.json({ error: 'roomId and text required' }, { status: 400 });
    }

    // Ensure room exists
    const roomRef = db.collection('rooms').doc(roomId);
    const roomDoc = await roomRef.get();
    if (!roomDoc.exists) return NextResponse.json({ error: 'Room not found' }, { status: 404 });

    // Write message to room-specific collection to avoid composite indexes
    await db.collection(`chat_${roomId}_messages`).add({
      roomId,
      sender,
      text,
      createdAt: db.FieldValue.serverTimestamp(),
      updatedAt: db.FieldValue.serverTimestamp(),
    });

    // Update room activity timestamp
    await roomRef.update({ updatedAt: db.FieldValue.serverTimestamp() });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Send message error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
