'use client';

import { useEffect, useMemo, useState } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Lobby() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [handle, setHandle] = useState('');
  const [roomOrLink, setRoomOrLink] = useState('');
  const [joinHandle, setJoinHandle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = (typeof window !== 'undefined' && window.localStorage.getItem('chat_username')) || '';
    if (saved) setUsername(saved);
  }, []);

  const clientKey = useMemo(() => {
    if (typeof window === 'undefined') return '';
    let key = window.localStorage.getItem('chat_client_key');
    if (!key) {
      key = Math.random().toString(36).slice(2) + Date.now().toString(36);
      window.localStorage.setItem('chat_client_key', key);
    }
    return key;
  }, []);

  const normalizeRoomId = (val: string) => {
    try {
      const url = new URL(val);
      const param = url.searchParams.get('room');
      if (param) return param.toUpperCase();
    } catch {
      // not a URL
    }
    return val.trim().toUpperCase();
  };

  const createRoom = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/chat/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() || 'Host', handle: handle.trim() || null, clientKey }),
      });
      const data = await res.json();
      if (res.ok) {
        window.localStorage.setItem('chat_username', username.trim() || 'Host');
        router.push(`/?room=${encodeURIComponent(data.roomId)}`);
      } else {
        alert(data.error || 'Failed to create room');
      }
    } catch {
      alert('Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  const joinByRoomOrLink = async () => {
    const id = normalizeRoomId(roomOrLink);
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch('/api/chat/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId: id, username: username.trim() || 'Guest' }),
      });
      const data = await res.json();
      if (res.ok) {
        window.localStorage.setItem('chat_username', username.trim() || 'Guest');
        router.push(`/?room=${encodeURIComponent(data.roomId)}`);
      } else {
        alert(data.error || 'Failed to join');
      }
    } catch {
      alert('Failed to join');
    } finally {
      setLoading(false);
    }
  };

  const joinByHandle = async () => {
    if (!joinHandle.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/chat/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle: joinHandle.trim().toLowerCase(), username: username.trim() || 'Guest' }),
      });
      const data = await res.json();
      if (res.ok) {
        window.localStorage.setItem('chat_username', username.trim() || 'Guest');
        router.push(`/?room=${encodeURIComponent(data.roomId)}`);
      } else {
        alert(data.error || 'Failed to join');
      }
    } catch {
      alert('Failed to join');
    } finally {
      setLoading(false);
    }
  };

  const randomMatch = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/chat/random', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() || 'User', clientKey }),
      });
      const data = await res.json();
      if (res.ok) {
        window.localStorage.setItem('chat_username', username.trim() || 'User');
        router.push(`/?room=${encodeURIComponent(data.roomId)}`);
      } else {
        alert(data.error || 'Failed to start');
      }
    } catch {
      alert('Failed to start');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 text-white shadow-[0_10px_40px_rgba(0,0,0,0.25)]"
      >
        <div className="flex items-center gap-2 text-white/90">
          <Icon icon="material-symbols:chat-rounded" className="text-cyan-300" width={22} height={22} />
          <h2 className="text-lg sm:text-xl font-medium">Instant Chat</h2>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4">
          <div className="flex items-center gap-2">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your display name"
              className="flex-1 text-sm bg-white/10 focus:bg-white/15 border border-white/10 rounded-md px-3 py-2 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="col-span-1 sm:col-span-3">
              <div className="text-xs text-white/70 mb-2">Create a room</div>
              <div className="flex items-center gap-2">
                <input
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="Custom handle (optional) e.g. alex-room"
                  className="flex-1 text-sm bg-white/10 focus:bg-white/15 border border-white/10 rounded-md px-3 py-2 outline-none"
                />
                <button onClick={createRoom} disabled={loading} className="px-3 py-2 rounded-md bg-cyan-400/80 hover:bg-cyan-400 text-slate-900 text-sm transition-colors disabled:opacity-50">Create</button>
              </div>
            </div>

            <div className="col-span-1 sm:col-span-3">
              <div className="text-xs text-white/70 mb-2">Join with link or Room ID</div>
              <div className="flex items-center gap-2">
                <input
                  value={roomOrLink}
                  onChange={(e) => setRoomOrLink(e.target.value)}
                  placeholder="Paste link or enter Room ID"
                  className="flex-1 text-sm bg-white/10 focus:bg-white/15 border border-white/10 rounded-md px-3 py-2 outline-none"
                />
                <button onClick={joinByRoomOrLink} disabled={loading} className="px-3 py-2 rounded-md bg-white/15 hover:bg-white/25 text-white text-sm transition-colors disabled:opacity-50">Join</button>
              </div>
            </div>

            <div className="col-span-1 sm:col-span-3">
              <div className="text-xs text-white/70 mb-2">Join by handle</div>
              <div className="flex items-center gap-2">
                <input
                  value={joinHandle}
                  onChange={(e) => setJoinHandle(e.target.value)}
                  placeholder="Enter friend&apos;s handle"
                  className="flex-1 text-sm bg-white/10 focus:bg-white/15 border border-white/10 rounded-md px-3 py-2 outline-none"
                />
                <button onClick={joinByHandle} disabled={loading} className="px-3 py-2 rounded-md bg-white/15 hover:bg-white/25 text-white text-sm transition-colors disabled:opacity-50">Join</button>
              </div>
            </div>

            <div className="col-span-1 sm:col-span-3">
              <div className="text-xs text-white/70 mb-2">Or get a random match</div>
              <button onClick={randomMatch} disabled={loading} className="w-full px-3 py-2 rounded-md bg-emerald-400/80 hover:bg-emerald-400 text-slate-900 text-sm transition-colors disabled:opacity-50">Find someone to chat</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
