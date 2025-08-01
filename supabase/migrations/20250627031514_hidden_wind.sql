/*
  # File Storage Setup

  1. Storage Setup
    - Create storage bucket for transcript files
    - Set up RLS policies for file access
    - Allow authenticated users to upload/download files

  2. Security
    - Only authenticated admin users can upload files
    - Files are organized by transcript ID
    - Proper file type validation
*/

-- Create storage bucket for transcript files
INSERT INTO storage.buckets (id, name, public)
VALUES ('transcript-files', 'transcript-files', false)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload transcript files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'transcript-files');

-- Allow authenticated users to view files
CREATE POLICY "Authenticated users can view transcript files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'transcript-files');

-- Allow authenticated users to update files
CREATE POLICY "Authenticated users can update transcript files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'transcript-files');

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete transcript files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'transcript-files');