-- Site Settings table for dynamic configuration
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access for site settings" ON public.site_settings
    FOR SELECT USING (true);

-- Authenticated write access (SMT only)
CREATE POLICY "SMT write access for site settings" ON public.site_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Initial seeds
INSERT INTO public.site_settings (key, value, description)
VALUES 
    ('admissions_phase', 'Open', 'Current status of school admissions (Open, Closed, Waitlist Only)'),
    ('intake_year', '2027', 'The target academic year for new applications')
ON CONFLICT (key) DO NOTHING;
