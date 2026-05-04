'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Profile = {
  id: string;
  full_name: string;
  profile_photo_url?: string | null;
};

type Message = {
  id: string;
  match_id: string;
  sender_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
  sender?: Profile | null;
};

export default function LiveChat({ matchId }: { matchId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadChat() {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id ?? null;
      setCurrentUserId(userId);

      const { data, error } = await supabase
        .from('messages')
        .select('*, sender:profiles(id, full_name, profile_photo_url)')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true });

      if (!error && data) setMessages(data as Message[]);
      setLoading(false);
    }

    loadChat();

    const channel = supabase
      .channel(`live-chat-${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        async (payload) => {
          const inserted = payload.new as Message;
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, full_name, profile_photo_url')
            .eq('id', inserted.sender_id)
            .single();

          setMessages((current) => [
            ...current,
            { ...inserted, sender: profile as Profile },
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    const text = newMessage.trim();
    if (!text || !currentUserId) return;

    setNewMessage('');

    const { error } = await supabase.from('messages').insert({
      match_id: matchId,
      sender_id: currentUserId,
      message: text,
    });

    if (error) {
      setNewMessage(text);
      alert(error.message);
    }
  }

  if (loading) {
    return <div className="card p-6">Loading live chat...</div>;
  }

  return (
    <section className="card flex min-h-[620px] flex-col overflow-hidden">
      <div className="border-b border-slate-100 p-5">
        <h1 className="text-2xl font-black text-navy">Live chat</h1>
        <p className="text-sm text-slate-500">Messages update instantly between matched users.</p>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-softPink/40 p-5">
        {messages.length === 0 && (
          <div className="rounded-2xl bg-white p-5 text-center text-slate-500">
            No messages yet. Send the first message to begin the conversation.
          </div>
        )}

        {messages.map((item) => {
          const mine = item.sender_id === currentUserId;
          return (
            <div key={item.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-3xl px-5 py-3 shadow-sm ${mine ? 'bg-rose text-white' : 'bg-white text-navy'}`}>
                {!mine && <p className="mb-1 text-xs font-bold opacity-70">{item.sender?.full_name ?? 'Member'}</p>}
                <p>{item.message}</p>
                <p className={`mt-2 text-[11px] ${mine ? 'text-white/70' : 'text-slate-400'}`}>
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={sendMessage} className="flex gap-3 border-t border-slate-100 bg-white p-4">
        <input
          className="input flex-1"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Write a kind message..."
        />
        <button className="btn" type="submit">Send</button>
      </form>
    </section>
  );
}
