import MatchInbox from '@/components/MatchInbox';

export default function Messages() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-4xl font-black text-navy">Messages</h1>
      <p className="mt-3 text-slate-600">Chat privately with members after you match.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-[360px_1fr]">
        <MatchInbox />
        <div className="card p-8">
          <h2 className="text-2xl font-black text-navy">Select a conversation</h2>
          <p className="mt-3 text-slate-600">Open a match to begin live chat. Messages are protected by Supabase Row Level Security so only matched users can read or send them.</p>
        </div>
      </div>
    </main>
  );
}
