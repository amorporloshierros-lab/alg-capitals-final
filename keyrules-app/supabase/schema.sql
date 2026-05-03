-- =============================================================
-- KeyRules × ALG Capitals — Schema Supabase
-- Correr en: Supabase Dashboard → SQL Editor → New query
-- =============================================================

-- ── Tipos ENUM ────────────────────────────────────────────────
do $$ begin
  create type user_role as enum ('free','starter','pro','elite','admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type plan_tier as enum ('starter','pro','elite');
exception when duplicate_object then null; end $$;

do $$ begin
  create type signal_status as enum ('active','executed','stop','tp');
exception when duplicate_object then null; end $$;

do $$ begin
  create type bias_dir as enum ('alcista','bajista','neutral','range');
exception when duplicate_object then null; end $$;

-- ── Profiles (extiende auth.users) ────────────────────────────
create table if not exists profiles (
  id               uuid primary key references auth.users on delete cascade,
  email            text not null unique,
  name             text,
  role             user_role default 'free',
  plan             plan_tier,
  plan_expires_at  timestamptz,
  created_at       timestamptz default now()
);

-- Auto-crear profile al registrarse
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Bias Diario ────────────────────────────────────────────────
create table if not exists bias (
  id           uuid primary key default gen_random_uuid(),
  pair         text not null,
  direction    bias_dir not null,
  session      text,
  analysis_md  text,
  video_url    text,
  min_plan     plan_tier default 'pro',
  published_at timestamptz,
  created_at   timestamptz default now(),
  created_by   uuid references profiles(id)
);

-- ── Próximo Meet ──────────────────────────────────────────────
create table if not exists meet_config (
  id        int primary key default 1,
  title     text,
  date_iso  timestamptz,
  url       text,
  min_plan  plan_tier default 'pro',
  active    boolean default true,
  updated_at timestamptz default now()
);

insert into meet_config (id, title, date_iso, url, active)
values (1, 'Live Trading', now() + interval '7 days', 'https://t.me/algcapitals', true)
on conflict (id) do nothing;

-- ── Señales ───────────────────────────────────────────────────
create table if not exists signals (
  id        uuid primary key default gen_random_uuid(),
  pair      text not null,
  direction text check (direction in ('LONG','SHORT')),
  entry     numeric not null,
  sl        numeric not null,
  tp        numeric not null,
  rr        numeric generated always as (round(abs(tp-entry)/nullif(abs(sl-entry),0),2)) stored,
  timeframe text,
  min_plan  plan_tier default 'pro',
  status    signal_status default 'active',
  notes     text,
  posted_at timestamptz default now()
);

-- ── Clases / Replays ─────────────────────────────────────────
create table if not exists classes (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  module          text,
  duration_min    int,
  description     text,
  mux_playback_id text,
  mux_asset_id    text,
  thumbnail_url   text,
  min_plan        plan_tier default 'pro',
  published_at    timestamptz,
  created_at      timestamptz default now()
);

-- ── Media (certificados, testimonios) ────────────────────────
create table if not exists media_items (
  id           uuid primary key default gen_random_uuid(),
  kind         text check (kind in ('certificate','review')),
  storage_path text not null,
  caption      text,
  published    boolean default true,
  sort_order   int default 0,
  created_at   timestamptz default now()
);

-- ── Pagos ─────────────────────────────────────────────────────
create table if not exists payments (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references profiles(id),
  plan        plan_tier,
  amount_usd  numeric,
  method      text,
  external_id text,
  status      text,
  paid_at     timestamptz default now()
);

-- ── Journal de trades (por alumno) ───────────────────────────
create table if not exists journal_trades (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references profiles(id) on delete cascade,
  pair       text,
  direction  text,
  entry      numeric,
  sl         numeric,
  tp         numeric,
  result_pct numeric,
  notes      text,
  taken_at   timestamptz default now()
);

-- ── Progreso de curso ─────────────────────────────────────────
create table if not exists class_progress (
  user_id      uuid references profiles(id) on delete cascade,
  class_id     uuid references classes(id) on delete cascade,
  completed_at timestamptz,
  primary key (user_id, class_id)
);

-- =============================================================
-- RLS (Row Level Security)
-- =============================================================

alter table profiles      enable row level security;
alter table bias          enable row level security;
alter table meet_config   enable row level security;
alter table signals       enable row level security;
alter table classes       enable row level security;
alter table media_items   enable row level security;
alter table payments      enable row level security;
alter table journal_trades enable row level security;
alter table class_progress enable row level security;

-- Helper: obtener role del usuario actual
create or replace function get_my_role()
returns user_role language sql security definer stable as $$
  select role from profiles where id = auth.uid()
$$;

-- Helper: obtener plan del usuario actual
create or replace function get_my_plan()
returns plan_tier language sql security definer stable as $$
  select plan from profiles
  where id = auth.uid()
    and (plan_expires_at is null or plan_expires_at > now())
$$;

-- Helper: comparar nivel de plan
create or replace function plan_level(p plan_tier) returns int language sql immutable as $$
  select case p when 'starter' then 1 when 'pro' then 2 when 'elite' then 3 else 0 end
$$;

-- ── profiles ──────────────────────────────────────────────────
create policy "users_read_own_profile" on profiles for select using (id = auth.uid());
create policy "users_update_own_profile" on profiles for update using (id = auth.uid());
create policy "admin_all_profiles" on profiles for all using (get_my_role() = 'admin');

-- ── bias ──────────────────────────────────────────────────────
create policy "public_read_bias" on bias for select using (
  published_at is not null
  and (
    get_my_role() = 'admin'
    or plan_level(get_my_plan()) >= plan_level(min_plan)
  )
);
create policy "admin_write_bias" on bias for all using (get_my_role() = 'admin');

-- ── meet_config ───────────────────────────────────────────────
create policy "public_read_meet" on meet_config for select using (true);
create policy "admin_write_meet" on meet_config for all using (get_my_role() = 'admin');

-- ── signals ───────────────────────────────────────────────────
create policy "read_signals" on signals for select using (
  get_my_role() = 'admin'
  or plan_level(get_my_plan()) >= plan_level(min_plan)
);
create policy "admin_write_signals" on signals for all using (get_my_role() = 'admin');

-- ── classes ───────────────────────────────────────────────────
create policy "read_classes" on classes for select using (
  published_at is not null
  and (
    get_my_role() = 'admin'
    or plan_level(get_my_plan()) >= plan_level(min_plan)
  )
);
create policy "admin_write_classes" on classes for all using (get_my_role() = 'admin');

-- ── media_items ───────────────────────────────────────────────
create policy "public_read_media" on media_items for select using (published = true);
create policy "admin_write_media" on media_items for all using (get_my_role() = 'admin');

-- ── payments ─────────────────────────────────────────────────
create policy "users_read_own_payments" on payments for select using (user_id = auth.uid());
create policy "admin_all_payments" on payments for all using (get_my_role() = 'admin');

-- ── journal_trades ────────────────────────────────────────────
create policy "users_own_trades" on journal_trades for all using (user_id = auth.uid());

-- ── class_progress ────────────────────────────────────────────
create policy "users_own_progress" on class_progress for all using (user_id = auth.uid());

-- =============================================================
-- NOTA: luego de correr este SQL, hacé manualmente:
--   UPDATE profiles SET role = 'admin' WHERE email = 'tu@email.com';
-- para darte acceso al panel /admin.
-- =============================================================
