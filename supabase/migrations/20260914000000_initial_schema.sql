-- JobTrackr initial schema for Supabase / PostgreSQL
create extension if not exists "pgcrypto";

create type public.company_scale as enum ('Startup', 'Scale-up', 'Corporate');
create type public.location_type as enum ('Remote', 'Hybrid', 'WFO');
create type public.application_status as enum (
  'Wishlist', 'Applied', 'HR Screening', 'Assessment', 'HR Interview',
  'User Interview', 'Final Interview', 'Offering', 'Hired', 'Rejected', 'Ghosted'
);

create table public.companies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name varchar(180) not null,
  industry varchar(120),
  scale public.company_scale,
  location_type public.location_type,
  summary text,
  culture_notes text,
  website_url varchar(2048),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint companies_name_not_blank check (length(trim(name)) > 0),
  constraint companies_website_url_valid check (website_url is null or website_url ~* '^https?://'),
  unique (id, user_id)
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  company_id uuid not null,
  position_title varchar(180) not null,
  source varchar(100),
  current_status public.application_status not null default 'Wishlist',
  expected_salary numeric(15, 2),
  benefits_notes text,
  cv_version_used varchar(120),
  cover_letter_notes text,
  applied_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint applications_position_not_blank check (length(trim(position_title)) > 0),
  constraint applications_salary_nonnegative check (expected_salary is null or expected_salary >= 0),
  constraint applications_applied_date_required check (current_status = 'Wishlist' or applied_date is not null),
  constraint applications_company_owner_fk
    foreign key (company_id, user_id)
    references public.companies(id, user_id)
    on delete restrict,
  unique (id, user_id)
);

create table public.application_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  application_id uuid not null,
  log_date date not null default current_date,
  status_stage public.application_status not null,
  notes text,
  pic_name varchar(150),
  pic_contact varchar(255),
  created_at timestamptz not null default now(),
  constraint application_logs_application_owner_fk
    foreign key (application_id, user_id)
    references public.applications(id, user_id)
    on delete cascade
);

create index companies_user_id_idx on public.companies(user_id);
create index applications_user_status_idx on public.applications(user_id, current_status);
create index applications_company_id_idx on public.applications(company_id);
create index applications_applied_date_idx on public.applications(applied_date desc);
create index application_logs_application_date_idx on public.application_logs(application_id, log_date desc, created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger companies_set_updated_at before update on public.companies
for each row execute function public.set_updated_at();
create trigger applications_set_updated_at before update on public.applications
for each row execute function public.set_updated_at();

alter table public.companies enable row level security;
alter table public.applications enable row level security;
alter table public.application_logs enable row level security;

create policy "Users manage their companies" on public.companies
for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users manage their applications" on public.applications
for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users manage their application logs" on public.application_logs
for all using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

comment on table public.companies is 'Company profiles owned by a JobTrackr user.';
comment on table public.applications is 'Job applications and their current pipeline status.';
comment on table public.application_logs is 'Append-only-style timeline events for an application.';
