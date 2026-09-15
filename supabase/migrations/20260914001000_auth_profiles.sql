-- User profile data. Authentication credentials remain securely managed by Supabase Auth.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name varchar(150),
  registration_completed boolean not null default false,
  daily_goal smallint not null default 1 check (daily_goal between 1 and 20),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, full_name, registration_completed)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    coalesce(new.raw_app_meta_data ->> 'provider', 'email') = 'email'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users for each row execute function public.handle_new_user();

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
create policy "Users view their profile" on public.profiles for select using ((select auth.uid()) = id);
create policy "Users update their profile" on public.profiles for update using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

comment on table public.profiles is 'Public-safe user preferences linked one-to-one with Supabase Auth users.';
