-- Add Afrikaans body column to support bilingual side-by-side notices
ALTER TABLE public.notices ADD COLUMN IF NOT EXISTS body_afrikaans text;
