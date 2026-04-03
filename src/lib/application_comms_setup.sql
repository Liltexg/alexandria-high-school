-- Communication Log Table for Application Responses
-- Tracks all SMT communications with applicants

create table public.application_comms (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references public.applications(id) on delete cascade not null,
  method varchar(20) not null check (method in ('email', 'call')),
  template_used varchar(50),
  smt_user_id uuid references auth.users(id),
  note text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.application_comms enable row level security;

-- SMT can view all communication logs
create policy "SMT can view all communication logs"
on public.application_comms for select
using (auth.role() = 'authenticated');

-- SMT can insert communication logs
create policy "SMT can insert communication logs"
on public.application_comms for insert
with check (auth.role() = 'authenticated');

-- Index for faster queries
create index application_comms_application_id_idx on public.application_comms (application_id);
create index application_comms_created_at_idx on public.application_comms (created_at desc);
