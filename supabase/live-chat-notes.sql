-- 2heartsdating live chat notes
-- This file is optional if you already ran schema.sql after the live chat update.

alter publication supabase_realtime add table public.messages;

create index if not exists messages_match_id_created_at_idx on public.messages(match_id, created_at);
create index if not exists matches_user1_id_idx on public.matches(user1_id);
create index if not exists matches_user2_id_idx on public.matches(user2_id);
