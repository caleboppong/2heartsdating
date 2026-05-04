insert into storage.buckets (id, name, public) values ('profile-photos', 'profile-photos', true) on conflict (id) do nothing;

create policy "Users upload profile photos" on storage.objects for insert with check (bucket_id = 'profile-photos' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users read profile photos" on storage.objects for select using (bucket_id = 'profile-photos');
create policy "Users update own profile photos" on storage.objects for update using (bucket_id = 'profile-photos' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "Users delete own profile photos" on storage.objects for delete using (bucket_id = 'profile-photos' and auth.uid()::text = (storage.foldername(name))[1]);
