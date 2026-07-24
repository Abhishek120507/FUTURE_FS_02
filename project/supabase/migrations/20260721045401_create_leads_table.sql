/*
# Create leads table (multi-user, owner-scoped CRM)

1. New Tables
- `leads`
  - `id` (uuid, primary key)
  - `name` (text, not null) — lead's full name
  - `email` (text) — lead's email
  - `phone` (text) — lead's phone number
  - `company` (text) — lead's company
  - `source` (text) — acquisition source (Website, Referral, Cold Call, Email Campaign, Social Media, Event)
  - `status` (text) — pipeline status (New, Contacted, Qualified, Proposal Sent, Won, Lost)
  - `priority` (text) — lead priority (Low, Medium, High)
  - `notes` (text) — freeform notes
  - `user_id` (uuid, not null, defaults to authenticated user) — owner
  - `created_at` (timestamptz, default now())
2. Security
- Enable RLS on `leads`.
- Owner-scoped CRUD: each authenticated user can only access leads they own.
3. Indexes
- Index on `user_id` for ownership filtering.
- Index on `status` for status filtering.
- Index on `created_at` desc for recent-first ordering.
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  company text,
  source text NOT NULL DEFAULT 'Website',
  status text NOT NULL DEFAULT 'New',
  priority text NOT NULL DEFAULT 'Medium',
  notes text DEFAULT '',
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_leads" ON leads;
CREATE POLICY "select_own_leads" ON leads FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_leads" ON leads;
CREATE POLICY "insert_own_leads" ON leads FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_leads" ON leads;
CREATE POLICY "update_own_leads" ON leads FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_leads" ON leads;
CREATE POLICY "delete_own_leads" ON leads FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
