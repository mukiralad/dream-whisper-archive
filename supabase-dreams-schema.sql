-- Add user_id column to dreams table
ALTER TABLE dreams ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Update existing records (if any) to have a default user_id
-- You may want to handle this differently depending on your needs
UPDATE dreams SET user_id = (SELECT id FROM auth.users LIMIT 1) WHERE user_id IS NULL;

-- Make user_id required
ALTER TABLE dreams ALTER COLUMN user_id SET NOT NULL;

-- Enable Row Level Security
ALTER TABLE dreams ENABLE ROW LEVEL SECURITY;

-- Create policy for users to select only their own dreams
CREATE POLICY "Users can view their own dreams"
ON dreams FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create policy for users to insert their own dreams
CREATE POLICY "Users can insert their own dreams"
ON dreams FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Create policy for users to update their own dreams
CREATE POLICY "Users can update their own dreams"
ON dreams FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create policy for users to delete their own dreams
CREATE POLICY "Users can delete their own dreams"
ON dreams FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Update storage bucket policies to include user_id in path
CREATE POLICY "Users can upload their own dream recordings"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'dreams' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their own dream recordings"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'dreams' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own dream recordings"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'dreams' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'dreams' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own dream recordings"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'dreams' AND
  (storage.foldername(name))[1] = auth.uid()::text
); 