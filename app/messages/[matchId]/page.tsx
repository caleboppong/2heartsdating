import Link from 'next/link';
import LiveChat from '@/components/LiveChat';

export default function ChatPage({ params }: { params: { matchId: string } }) {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link href="/messages" className="text-sm font-bold text-rose">← Back to messages</Link>
      <div className="mt-6">
        <LiveChat matchId={params.matchId} />
      </div>
    </main>
  );
}
