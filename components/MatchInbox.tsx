'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Match = {
  id: string;
  user1_id: string;
  user2_id: string;
  matched_at: string;
};

export default function MatchInbox() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
        .order('matched_at', { ascending: false });

      if (!error && data) setMatches(data as Match[]);
      setLoading(false);
    }

    loadMatches();
  }, []);

  if (loading) return <div className="card p-6">Loading conversations...</div>;

  return (
    <div className="card p-6">
      <h2 className="text-xl font-black text-navy">Conversations</h2>
      <div className="mt-5 space-y-3">
        {matches.length === 0 && <p className="text-slate-500">No matches yet. Like another approved member to start matching.</p>}
        {matches.map((match) => (
          <Link key={match.id} href={`/messages/${match.id}`} className="block rounded-2xl border border-slate-100 p-4 hover:border-rose">
            <p className="font-bold text-navy">Match conversation</p>
            <p className="text-xs text-slate-500">Matched {new Date(match.matched_at).toLocaleDateString()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
