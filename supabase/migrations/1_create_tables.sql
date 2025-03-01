-- Supabase migration file to set up tables for CCO project - Part 1: Table Creation
-- Run this in the Supabase SQL Editor first

---------------------------------------------------------------------------
-- PROFILES
---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cco_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  role VARCHAR(50),
  preferences JSONB DEFAULT '{"notification_frequency": "daily", "data_privacy": "private", "ai_suggestions": true, "theme": "system"}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

---------------------------------------------------------------------------
-- NOTIFICATIONS
---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cco_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('meeting', 'document', 'action', 'project', 'system')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  link TEXT,
  related_item_id UUID,
  related_item_type VARCHAR(50),
  icon TEXT
);

---------------------------------------------------------------------------
-- PROJECTS
---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cco_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  client_id UUID REFERENCES auth.users(id),
  vibecoder_id UUID REFERENCES auth.users(id),
  status VARCHAR(50) NOT NULL CHECK (status IN ('new', 'active', 'paused', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  tags TEXT[]
);

---------------------------------------------------------------------------
-- MEETINGS
---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cco_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  project_id UUID REFERENCES cco_projects(id) ON DELETE CASCADE,
  recording_url TEXT,
  transcript_url TEXT,
  status VARCHAR(50) NOT NULL CHECK (status IN ('scheduled', 'completed', 'canceled')),
  summary TEXT,
  key_highlights TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

---------------------------------------------------------------------------
-- MEETING PARTICIPANTS
---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cco_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES cco_meetings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(meeting_id, user_id)
);

---------------------------------------------------------------------------
-- ACTION ITEMS
---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cco_action_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  assigned_to UUID REFERENCES auth.users(id),
  meeting_id UUID REFERENCES cco_meetings(id) ON DELETE CASCADE,
  due_date TIMESTAMPTZ,
  status VARCHAR(50) NOT NULL CHECK (status IN ('open', 'in-progress', 'completed')),
  priority VARCHAR(50) NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

---------------------------------------------------------------------------
-- DOCUMENTS
---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cco_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('prd', 'meeting_notes', 'code_scaffold', 'requirements', 'other')),
  content TEXT,
  project_id UUID REFERENCES cco_projects(id) ON DELETE CASCADE,
  meeting_id UUID REFERENCES cco_meetings(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  tags TEXT[],
  status VARCHAR(50) NOT NULL CHECK (status IN ('draft', 'review', 'final'))
);

---------------------------------------------------------------------------
-- TEST CONNECTION TABLE
---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS _test_connection (
  id SERIAL PRIMARY KEY,
  test_value TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO _test_connection (test_value)
SELECT 'Connection successful'
WHERE NOT EXISTS (SELECT 1 FROM _test_connection); 