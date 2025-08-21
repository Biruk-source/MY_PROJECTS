'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: string;
  createdAt: string | null;
}

interface ChatUIProps {
  roomId: string;
  initialUsername?: string;
}

export default function ChatUI({ roomId, initialUsername }: ChatUIProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState<string>('');
  const [partner, setPartner] = useState<string | null>(null);
  const [status, setStatus] = useState<'waiting' | 'active' | 'closed' | 'unknown'>('unknown');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Load username from localStorage or initial
  useEffect(() => {
    const saved = (typeof window !== 'undefined' && window.localStorage.getItem('chat_username')) || '';
    const name = (initialUsername || saved || '').trim();
    setUsername(name);
  }, [initialUsername]);

  useEffect(() => {
    if (!roomId) return;

    let mounted = true;

    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/chat/status?roomId=${encodeURIComponent(roomId)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        setStatus((data.status as 'waiting' | 'active' | 'closed') || 'unknown');
        const otherName = data.hostUsername && username && data.hostUsername === username ? data.guestUsername : data.hostUsername;
        setPartner((otherName as string) || null);
      } catch {
        // noop
      }
    };

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat/messages?roomId=${encodeURIComponent(roomId)}&limit=200`);
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        const list = (data.messages as Message[]) || [];
        // Ensure sorted by createdAt ascending
        list.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
        setMessages(list);
        setLoading(false);
      } catch {
        // noop
      }
    };

    fetchStatus();
    fetchMessages();

    const statusTimer = setInterval(fetchStatus, 3000);
    const msgTimer = setInterval(fetchMessages, 1500);

    return () => {
      mounted = false;
      clearInterval(statusTimer);
      clearInterval(msgTimer);
    };
  }, [roomId, username]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const joinUrl = useMemo(() => `${window.location.origin}/?room=${encodeURIComponent(roomId)}`, [roomId]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    const name = username.trim() || 'You';
    window.localStorage.setItem('chat_username', name);

    setInput('');
    try {
      await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, sender: name, text }),
      });
    } catch {
      // noop
    }
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
    } catch {
      // noop
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
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm sm:text-base opacity-90">
            <Icon icon="material-symbols:chat-rounded" className="text-cyan-300" width={20} height={20} />
            <span>Room {roomId}</span>
            <span className={`ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${status === 'active' ? 'bg-emerald-500/20 text-emerald-200' : 'bg-yellow-500/20 text-yellow-200'}`}>{status === 'active' ? 'Connected' : 'Waiting'}</span>
          </div>
          <button onClick={onCopy} className="text-xs sm:text-sm px-3 py-1 rounded-md bg-white/10 hover:bg-white/15 transition-colors">Copy link</button>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your display name"
            className="w-48 sm:w-64 text-sm bg-white/10 focus:bg-white/15 border border-white/10 rounded-md px-2 py-1 outline-none"
          />
          <div className="text-xs text-white/70">Partner: {partner || (status === 'active' ? 'Connected' : '—')}</div>
        </div>

        <div className="mt-4 h-[52vh] sm:h-[58vh] overflow-y-auto pr-2" style={{ scrollBehavior: 'smooth' }}>
          <div className="flex flex-col gap-2">
            {loading && <div className="text-white/60 text-sm">Loading messages…</div>}
            {!loading && messages.length === 0 && (
              <div className="text-white/60 text-sm">Say hi! This chat is empty.</div>
            )}
            {messages.map((m) => {
              const fromMe = username && m.sender === username;
              return (
                <div key={m.id} className={`flex ${fromMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] sm:max-w-[70%] rounded-lg px-3 py-2 text-sm backdrop-blur ${fromMe ? 'bg-cyan-500/20 text-cyan-50' : 'bg-white/10 text-white'}`}>
                    <div className="text-[10px] uppercase tracking-wide opacity-60 mb-1">{fromMe ? 'You' : m.sender}</div>
                    <div className="leading-relaxed">{m.text}</div>
                    {m.createdAt && <div className="mt-1 text-[10px] opacity-50">{new Date(m.createdAt).toLocaleTimeString()}</div>}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
            placeholder="Type your message…"
            className="flex-1 text-sm bg-white/10 focus:bg-white/15 border border-white/10 rounded-md px-3 py-2 outline-none"
          />
          <button onClick={sendMessage} className="px-3 py-2 rounded-md bg-cyan-400/80 hover:bg-cyan-400 text-slate-900 text-sm transition-colors">Send</button>
        </div>
      </motion.div>
    </div>
  );
}
