-- Add updated_at column to news table if it doesn't exist
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
