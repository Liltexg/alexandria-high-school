-- Add category column to news table to support newspaper themes
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS category varchar(50) DEFAULT 'news';
