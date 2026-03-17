# Task 02 — Supabase Schema (Database Setup)

## Context
This task is a **manual step** that the user performs in the Supabase web dashboard.
No code is written in this task. The sub-agent should present these instructions clearly to the user.

## Prerequisites
- User must have a Supabase account at https://supabase.com
- User must have created a project in Supabase

## What the user must do

### Step 1: Get credentials
Go to Supabase Dashboard → Your Project → **Settings → API**

Copy these two values:
- `Project URL` → This is `VITE_SUPABASE_URL`
- `anon public` key → This is `VITE_SUPABASE_ANON_KEY`

Update the `.env` file at `/Users/magupe/Documents/proyects/ResiControl/.env`:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxxxxx...
```

### Step 2: Create the packages table
Go to Supabase Dashboard → Your Project → **SQL Editor** → Click "New query"

Paste and run this SQL:

```sql
-- Create the packages table
CREATE TABLE packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tower TEXT NOT NULL,
  apartment TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add a constraint to only allow valid status values
ALTER TABLE packages
  ADD CONSTRAINT packages_status_check
  CHECK (status IN ('pending', 'delivered'));

-- Enable Row Level Security (RLS) but keep it open for MVP
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

-- Allow all operations for MVP (no auth required)
CREATE POLICY "Allow all for MVP"
  ON packages
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

Click **Run** and confirm the table was created successfully.

### Step 3: Verify
Go to **Table Editor** in Supabase → You should see the `packages` table with these columns:
- `id` (uuid)
- `tower` (text)
- `apartment` (text)
- `status` (text, default: 'pending')
- `created_at` (timestamptz)

## Success Criteria
- [ ] `packages` table exists in Supabase
- [ ] `.env` file updated with real URL and anon key
- [ ] SQL ran without errors

## Notes for sub-agent
- This task requires human action in a browser
- Do NOT skip RLS setup — it must be enabled even for MVP
- The policy `"Allow all for MVP"` is intentionally permissive for now
- No code files are created in this task
