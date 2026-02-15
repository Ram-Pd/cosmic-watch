import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || '';

export function ChatWidget({ userName }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const url = SOCKET_URL || window.location.origin;
    const socket = io(url, { path: '/socket.io', transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('messages', (msgs) => setMessages(Array.isArray(msgs) ? msgs : []));
    socket.on('message', (msg) => setMessages((prev) => [...prev, msg]));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [messages]);

  function send() {
    const text = input.trim();
    if (!text || !socketRef.current) return;
    socketRef.current.emit('message', { user: userName, text });
    setInput('');
  }

  return (
    <div className="border border-cosmic-border rounded overflow-hidden flex flex-col max-h-96">
      <div className="px-4 py-2 border-b border-cosmic-border flex items-center justify-between">
        <span className="text-cosmic-muted text-sm uppercase tracking-wider">Asteroid room</span>
        <span className={`text-xs ${connected ? 'text-emerald-400' : 'text-cosmic-muted'}`}>
          {connected ? 'Live' : 'Connecting...'}
        </span>
      </div>
      <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-2 min-h-[200px]">
        {messages.length === 0 && (
          <p className="text-cosmic-muted text-sm">No messages yet. Say hello.</p>
        )}
        {messages.map((m, i) => (
          <div key={m.id || i} className="text-sm">
            <span className="text-cosmic-muted font-medium">{m.user}:</span>{' '}
            <span className="text-white">{m.text}</span>
          </div>
        ))}
      </div>
      <div className="flex border-t border-cosmic-border p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Type a message..."
          className="flex-1 bg-cosmic-gray border border-cosmic-border px-3 py-2 text-white text-sm focus:outline-none focus:border-white"
        />
        <button
          type="button"
          onClick={send}
          disabled={!connected}
          className="ml-2 px-4 py-2 border border-cosmic-border text-sm uppercase tracking-wider hover:border-white disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
