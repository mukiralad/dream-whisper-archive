-- Enable Storage
create extension if not exists "uuid-ossp";

-- Create a secure bucket for user uploads
insert into storage.buckets (id, name, public) 
values ('user_uploads', 'user_uploads', false);

-- Policy for inserting objects: only authenticated users can upload
create policy "Authenticated users can upload files"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'user_uploads' AND
  auth.role() = 'authenticated'
);

-- Policy for selecting objects: only authenticated users can view
create policy "Authenticated users can view files"
on storage.objects for select
to authenticated
using (
  bucket_id = 'user_uploads' AND
  auth.role() = 'authenticated'
);

-- Policy for updating objects: users can only update their own files
create policy "Users can update own files"
on storage.objects for update
to authenticated
using (
  bucket_id = 'user_uploads' AND
  owner = auth.uid()
)
with check (
  bucket_id = 'user_uploads' AND
  owner = auth.uid()
);

-- Policy for deleting objects: users can only delete their own files
create policy "Users can delete own files"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'user_uploads' AND
  owner = auth.uid()
); 