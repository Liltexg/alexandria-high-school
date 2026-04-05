-- Create audit_logs table for SMT activity tracking
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- SMT can view all logs
CREATE POLICY "SMT can view all audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (true);

-- System/SMT can insert logs
CREATE POLICY "SMT can insert audit logs"
ON public.audit_logs FOR INSERT
TO authenticated
WITH CHECK (true);
