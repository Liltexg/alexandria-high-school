-- ==========================================
-- Alexandria High School - System Setup Script
-- ==========================================

-- 1. ENUM TYPES
-- Define strict types to enforce data consistency
create type public.target_group as enum ('Learners', 'Parents', 'Staff', 'Public');
create type public.notice_status as enum ('draft', 'active', 'archived');

-- 2. NOTICES TABLE
-- Ephemeral content: High turnover, strictly managed lifecycle
create table public.notices (
  id uuid primary key default gen_random_uuid(),
  title varchar(100) not null,
  body text not null,
  target_group public.target_group not null,
  status public.notice_status not null default 'draft',
  publish_at timestamptz not null,
  expire_at timestamptz not null,
  created_by uuid references auth.users(id) default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. NEWS TABLE
-- Permanent content: Institutional record, curated
create table public.news (
  id uuid primary key default gen_random_uuid(),
  title varchar(120) not null,
  summary text not null,
  content text not null,
  published_at timestamptz not null,
  is_published boolean default false,
  author_id uuid references auth.users(id) default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. ROW LEVEL SECURITY (RLS)
-- Enable RLS on all tables immediately
alter table public.notices enable row level security;
alter table public.news enable row level security;

-- 5. POLICIES: NOTICES

-- Public Read: Only Active AND Past Publish Date
create policy "Public notices are viewable by everyone"
on public.notices for select
using (
  status = 'active'
  and publish_at <= now()
);

-- SMT Read: All content
create policy "SMT can view all notices"
on public.notices for select
using (
  auth.role() = 'authenticated'
);

-- SMT Write: Authenticated users only
create policy "SMT can insert notices"
on public.notices for insert
with check (auth.role() = 'authenticated');

create policy "SMT can update notices"
on public.notices for update
using (auth.role() = 'authenticated');

-- 6. POLICIES: NEWS

-- Public Read: Only Published
create policy "Public news is viewable by everyone"
on public.news for select
using (
  is_published = true
);

-- SMT Read: All content
create policy "SMT can view all news drafts"
on public.news for select
using (
  auth.role() = 'authenticated'
);

-- SMT Write: Authenticated users only
create policy "SMT can insert news"
on public.news for insert
with check (auth.role() = 'authenticated');

create policy "SMT can update news"
on public.news for update
using (auth.role() = 'authenticated');

-- 7. AUTOMATION HELPER (Optional)
-- Function to auto-expire notices (can be called by cron or edge function)
create or replace function handle_notice_expiry()
returns void as $$
begin
  update public.notices
  set status = 'archived'
  where status = 'active'
  and expire_at < now();
end;
$$ language plpgsql;

-- 8. INDEXES
-- Optimize for common public queries
create index notices_status_publish_idx on public.notices (status, publish_at);
create index news_published_idx on public.news (is_published);
