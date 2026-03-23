-- Add column for delivery photo
ALTER TABLE packages ADD COLUMN IF NOT EXISTS foto_entrega_url TEXT;

-- Create RLS policy for the new column (same as other fields)
-- The existing policies already cover all operations