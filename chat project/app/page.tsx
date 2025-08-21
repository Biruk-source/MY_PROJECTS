'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ChatUI from '@/app/components/ChatUI';
import Lobby from '@/app/components/Lobby';

function QueryHandler() {
  const params = useSearchParams();
  const roomId = (params.get('room') || '').trim().toUpperCase();
  if (roomId) {
    return <ChatUI roomId={roomId} />;
  }
  return <Lobby />;
}

export default function Home() {
  return (
    <div
      className="min-h-screen w-full text-white"
      style={{
        backgroundImage:
          'linear-gradient(111.4deg, rgba(7,7,9,1) 6.5%, rgba(27,24,113,1) 93.2%)',
      }}
    >
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-20 sm:pt-24">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-medium opacity-95">Chat, instantly.</h1>
          <p className="mt-2 text-sm text-white/70">Create a room, share a link or handle, or let us pair you with someone at random.</p>
        </div>
        <div className="mt-8">
          <Suspense fallback={<div className="text-center text-white/70">Loading…</div>}>
            <QueryHandler />
          </Suspense>
        </div>
      </div>
    </div>
  );
}