-- Final Alignment for High-Fidelity Admissions Document
ALTER TABLE public.applications
ADD COLUMN IF NOT EXISTS highest_grade_passed TEXT,
ADD COLUMN IF NOT EXISTS year_passed TEXT,
ADD COLUMN IF NOT EXISTS other_names TEXT,
ADD COLUMN IF NOT EXISTS grade_1_pre_primary TEXT,
ADD COLUMN IF NOT EXISTS learner_cell TEXT,
ADD COLUMN IF NOT EXISTS parent_signature TEXT;

-- Ensure intake_year is flexible
ALTER TABLE public.applications 
ALTER COLUMN intake_year TYPE TEXT;
