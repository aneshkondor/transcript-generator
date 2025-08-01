/*
  # Create admin users and transcripts tables (Fixed)

  1. New Tables
    - `admin_users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password_hash` (text)
      - `name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `transcripts`
      - `id` (uuid, primary key)
      - `name` (text)
      - `student_name` (text)
      - `student_ssn` (text)
      - `data` (jsonb)
      - `created_by` (uuid, foreign key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for admin authentication and transcript management
    - Create secure password hashing functions

  3. Functions
    - Password hashing and verification
    - Admin user creation and authentication
    - Automatic timestamp updates
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transcripts table
CREATE TABLE IF NOT EXISTS transcripts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  student_name text,
  student_ssn text,
  data jsonb NOT NULL DEFAULT '{}',
  created_by uuid REFERENCES admin_users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcripts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin users can read their own data" ON admin_users;
DROP POLICY IF EXISTS "Admin users can update their own data" ON admin_users;
DROP POLICY IF EXISTS "Admin users can read all transcripts" ON transcripts;
DROP POLICY IF EXISTS "Admin users can create transcripts" ON transcripts;
DROP POLICY IF EXISTS "Admin users can update transcripts they created" ON transcripts;
DROP POLICY IF EXISTS "Admin users can delete transcripts they created" ON transcripts;

-- Create policies for admin_users
CREATE POLICY "Admin users can read their own data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Admin users can update their own data"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Create policies for transcripts
CREATE POLICY "Admin users can read all transcripts"
  ON transcripts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can create transcripts"
  ON transcripts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = created_by::text);

CREATE POLICY "Admin users can update transcripts they created"
  ON transcripts
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = created_by::text);

CREATE POLICY "Admin users can delete transcripts they created"
  ON transcripts
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = created_by::text);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_transcripts_student_ssn ON transcripts(student_ssn);
CREATE INDEX IF NOT EXISTS idx_transcripts_created_by ON transcripts(created_by);
CREATE INDEX IF NOT EXISTS idx_transcripts_created_at ON transcripts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Drop existing functions if they exist to avoid parameter conflicts
DROP FUNCTION IF EXISTS hash_password(text);
DROP FUNCTION IF EXISTS verify_password(text, text);
DROP FUNCTION IF EXISTS create_admin_user(text, text, text);
DROP FUNCTION IF EXISTS authenticate_admin(text, text);
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Function to hash passwords
CREATE OR REPLACE FUNCTION hash_password(password text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN crypt(password, gen_salt('bf'));
END;
$$;

-- Function to verify passwords
CREATE OR REPLACE FUNCTION verify_password(password text, hash text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN crypt(password, hash) = hash;
END;
$$;

-- Function to create admin user
CREATE OR REPLACE FUNCTION create_admin_user(
  p_email text,
  p_password text,
  p_name text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
BEGIN
  INSERT INTO admin_users (email, password_hash, name)
  VALUES (p_email, hash_password(p_password), p_name)
  RETURNING id INTO new_user_id;
  
  RETURN new_user_id;
END;
$$;

-- Function to authenticate admin user
CREATE OR REPLACE FUNCTION authenticate_admin(
  p_email text,
  p_password text
)
RETURNS TABLE(user_id uuid, user_name text, user_email text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_record admin_users%ROWTYPE;
BEGIN
  SELECT * INTO user_record
  FROM admin_users
  WHERE email = p_email;
  
  IF user_record.id IS NULL THEN
    RETURN;
  END IF;
  
  IF verify_password(p_password, user_record.password_hash) THEN
    RETURN QUERY SELECT user_record.id, user_record.name, user_record.email;
  END IF;
END;
$$;

-- Insert default admin user
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM admin_users WHERE email = 'admin@transcript.com') THEN
    PERFORM create_admin_user('admin@transcript.com', 'transcript2025', 'System Administrator');
  END IF;
END $$;

-- Update function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
DROP TRIGGER IF EXISTS update_transcripts_updated_at ON transcripts;

-- Create triggers for updated_at
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transcripts_updated_at
  BEFORE UPDATE ON transcripts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();