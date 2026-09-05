-- IDA World Support Grant - production database starter for Supabase
-- Run in Supabase SQL Editor before deploying.

create extension if not exists pgcrypto;

do $$ begin
  create type public.user_role as enum ('applicant','agent','admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.application_status as enum ('draft','submitted','under_review','more_information','approved','declined','support_processing');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role public.user_role not null default 'applicant',
  created_at timestamptz not null default now()
);

create table if not exists public.grants (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null default 'General',
  status text not null default 'open' check (status in ('open','closed','draft')),
  created_at timestamptz not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  application_number text unique not null default ('IDA-' || to_char(now(),'YYYY') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  applicant_id uuid not null references public.profiles(id) on delete cascade,
  grant_id uuid references public.grants(id) on delete set null,
  full_name text not null,
  address text,
  age integer,
  city text,
  state text,
  postal_code text,
  status text not null default 'submitted',
  email text,
  phone text,
  date_of_birth date,
  occupation text,
  monthly_income numeric,
  reason text,
  agent_notes text,
  decision_reason text,
  assigned_agent_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id) on delete set null,
  application_id uuid references public.applications(id) on delete set null,
  action text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.awards (
  id uuid primary key default gen_random_uuid(),
  recipient_display_name text not null,
  support_type text not null,
  amount numeric,
  currency text default 'NGN',
  display_amount text,
  delivery_status text not null default 'not_published',
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id,email,full_name) values (new.id,new.email,coalesce(new.raw_user_meta_data->>'full_name','')) on conflict (id) do update set email=excluded.email;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at() returns trigger language plpgsql as $$ begin new.updated_at=now(); return new; end; $$;
drop trigger if exists applications_updated_at on public.applications;
create trigger applications_updated_at before update on public.applications for each row execute procedure public.set_updated_at();


create or replace function public.current_role() returns public.user_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;
revoke all on function public.current_role() from public;
grant execute on function public.current_role() to authenticated;

alter table public.profiles enable row level security;
alter table public.grants enable row level security;
alter table public.applications enable row level security;
alter table public.messages enable row level security;
alter table public.audit_logs enable row level security;
alter table public.awards enable row level security;

drop policy if exists "profiles own or staff read" on public.profiles;
create policy "profiles own or staff read" on public.profiles for select using (id=auth.uid() or public.current_role() in ('agent','admin'));
drop policy if exists "open grants public read" on public.grants;
create policy "open grants public read" on public.grants for select using (status='open' or public.current_role() = 'admin');
drop policy if exists "admin create grants" on public.grants;
create policy "admin create grants" on public.grants for insert with check (public.current_role() = 'admin');
drop policy if exists "admin update grants" on public.grants;
create policy "admin update grants" on public.grants for update using (public.current_role() = 'admin');

drop policy if exists "applicant own applications" on public.applications;
create policy "applicant own applications" on public.applications for select using (applicant_id=auth.uid());
drop policy if exists "staff read applications" on public.applications;
create policy "staff read applications" on public.applications for select using (public.current_role() in ('agent','admin'));
drop policy if exists "applicant create application" on public.applications;
create policy "applicant create application" on public.applications for insert with check (applicant_id=auth.uid());
drop policy if exists "staff update applications" on public.applications;
create policy "staff update applications" on public.applications for update using (public.current_role() in ('agent','admin'));

drop policy if exists "participants read messages" on public.messages;
create policy "participants read messages" on public.messages for select using (exists(select 1 from public.applications a where a.id=application_id and (a.applicant_id=auth.uid() or public.current_role() in ('agent','admin'))));
drop policy if exists "staff send messages" on public.messages;
create policy "staff send messages" on public.messages for insert with check (sender_id=auth.uid() and public.current_role() in ('agent','admin'));

drop policy if exists "staff read audit" on public.audit_logs;
create policy "staff read audit" on public.audit_logs for select using (public.current_role() in ('agent','admin'));
drop policy if exists "staff write audit" on public.audit_logs;
create policy "staff write audit" on public.audit_logs for insert with check (actor_id=auth.uid() and public.current_role() in ('agent','admin'));

drop policy if exists "published awards public read" on public.awards;
create policy "published awards public read" on public.awards for select using (published=true or public.current_role() = 'admin');
drop policy if exists "admin awards write" on public.awards;
create policy "admin awards write" on public.awards for all using (public.current_role() = 'admin') with check (public.current_role() = 'admin');

-- Promote staff only after verifying their accounts. Replace the email values.
-- update public.profiles set role='agent' where email='verified-agent@example.com';
-- update public.profiles set role='admin' where email='verified-admin@example.com';

-- Applicants may update only their own basic profile fields.
drop policy if exists "profiles own update" on public.profiles;
create policy "profiles own update" on public.profiles for update using (id=auth.uid()) with check (id=auth.uid());
