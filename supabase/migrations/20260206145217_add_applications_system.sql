-- Alexandria High Enrollment System (AHES) Schema

-- 1. Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_number TEXT UNIQUE,
    intake_year INTEGER DEFAULT extract(year from now())::integer + 1,
    grade_applying_for TEXT NOT NULL,
    
    -- Learner Info
    learner_first_name TEXT NOT NULL,
    learner_surname TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    gender TEXT NOT NULL,
    id_number TEXT NOT NULL,
    home_language TEXT NOT NULL,
    additional_language TEXT,
    race TEXT,
    
    -- School Info
    current_school_name TEXT,
    current_grade TEXT,
    province_of_current_school TEXT,
    reason_for_transfer TEXT,
    
    -- Parent Info
    parent_primary_name TEXT NOT NULL,
    parent_primary_relationship TEXT NOT NULL,
    parent_primary_id TEXT NOT NULL,
    parent_primary_contact TEXT NOT NULL,
    parent_primary_email TEXT NOT NULL,
    parent_secondary_name TEXT,
    parent_secondary_contact TEXT,
    parent_secondary_email TEXT,
    
    -- Address
    address_street TEXT NOT NULL,
    address_suburb TEXT NOT NULL,
    address_city TEXT NOT NULL,
    address_postal_code TEXT NOT NULL,
    address_province TEXT NOT NULL,
    
    -- Emergency
    emergency_contact_name TEXT NOT NULL,
    emergency_contact_relationship TEXT NOT NULL,
    emergency_contact_number TEXT NOT NULL,
    
    -- Academic
    has_repeated_grade BOOLEAN DEFAULT false,
    receives_support BOOLEAN DEFAULT false,
    special_needs TEXT,
    
    -- Metadata
    documents JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'Submitted',
    smt_notes TEXT,
    reviewed_by UUID REFERENCES auth.users(id),
    decision_date TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Reference Number Generation
CREATE SEQUENCE IF NOT EXISTS application_ref_seq START 1;

CREATE OR REPLACE FUNCTION generate_application_ref() 
RETURNS TRIGGER AS $$
DECLARE
    year_val TEXT;
    seq_val INTEGER;
BEGIN
    year_val := extract(year from now())::text;
    seq_val := nextval('application_ref_seq');
    NEW.reference_number := 'AHS-' || year_val || '-' || LPAD(seq_val::text, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_application_ref
BEFORE INSERT ON public.applications
FOR EACH ROW
WHEN (NEW.reference_number IS NULL)
EXECUTE FUNCTION generate_application_ref();

-- 3. Row Level Security (RLS)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an application"
ON public.applications FOR INSERT
WITH CHECK (true);

CREATE POLICY "SMT members can view all applications"
ON public.applications FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "SMT members can update applications"
ON public.applications FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 4. Storage Configuration
-- Note: Bucket creation sometimes requires manual intervention via UI if SQL is restricted, 
-- but this is the standard SQL way.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('application-documents', 'application-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Public can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'application-documents');

CREATE POLICY "SMT and system can view application documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'application-documents');
