-- =============================================================
-- KeyRules × ALG Capitals — Schema
-- Correr en Supabase → SQL Editor (en orden)
-- =============================================================

-- Enums
create type user_role   as enum ('free', 'starter', 'pro', 'elite', 'admin');
create type plan_tier   as enum ('starter', 'pro', 'elite');
create type signal_status as enum ('active', 'executed', 'stop', 'tp');
create type bias_dir    as enum ('alcista', 'bajista', 'neutral', 'range');

-- ---------------------------------------------------------------
-- Profiles (extiende auth.users)
-- ---------------------------------------------------------------
create table profiles (
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
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------
-- Helper: nivel numérico de plan (para comparar en RLS)
-- ---------------------------------------------------------------
create or replace function public.plan_level(p plan_tier)
returns int as $$
  select case p
    when 'starter' then 1
    when 'pro'     then 2
    when 'elite'   then 3
    else 0
  end;
$$ language sql immutable;

-- Nivel de plan del usuario autenticado actual (respeta expiración)
create or replace function public.current_user_plan_level()
returns int as $$
  select coalesce(
    (select public.plan_level(plan)
     from   public.profiles
     where  id = auth.uid()
     and    (plan_expires_at is null or plan_expires_at > now())),
    0
  );
$$ language sql security definer stable;

-- ---------------------------------------------------------------
-- Bias diario
-- ---------------------------------------------------------------
create table bias (
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

-- ---------------------------------------------------------------
-- Clases / Replays
-- ---------------------------------------------------------------
create table classes (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  module           text,
  duration_min     int,
  description      text,
  mux_playback_id  text,
  mux_asset_id     text,
  thumbnail_url    text,
  min_plan         plan_tier default 'pro',
  published_at     timestamptz,
  created_at       timestamptz default now()
);

-- ---------------------------------------------------------------
-- Señales
-- ---------------------------------------------------------------
create table signals (
  id         uuid primary key default gen_random_uuid(),
  pair       text not null,
  direction  text check (direction in ('LONG', 'SHORT')),
  entry      numeric not null,
  sl         numeric not null,
  tp         numeric not null,
  timeframe  text,
  min_plan   plan_tier default 'pro',
  status     signal_status default 'active',
  posted_at  timestamptz default now()
);

-- ---------------------------------------------------------------
-- Media items (certificados + testimonios → Storage)
-- ---------------------------------------------------------------
create table media_items (
  id            uuid primary key default gen_random_uuid(),
  kind          text check (kind in ('certificate', 'review')),
  storage_path  text not null,
  caption       text,
  published     boolean default true,
  sort_order    int default 0,
  created_at    timestamptz default now()
);

-- ---------------------------------------------------------------
-- Próximo Meet (fila única, id=1)
-- ---------------------------------------------------------------
create table meet_config (
  id        int primary key default 1,
  title     text,
  date_iso  timestamptz,
  url       text,
  min_plan  plan_tier default 'pro',
  active    boolean default true,
  updated_at timestamptz default now()
);

-- Seed fila inicial para que siempre exista
insert into meet_config (id) values (1) on conflict do nothing;

-- ---------------------------------------------------------------
-- Pagos
-- ---------------------------------------------------------------
create table payments (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references profiles(id),
  plan        plan_tier,
  amount_usd  numeric,
  method      text,
  external_id text,
  status      text,
  paid_at     timestamptz default now()
);

-- ---------------------------------------------------------------
-- Journal del alumno
-- ---------------------------------------------------------------
create table journal_trades (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references profiles(id) on delete cascade,
  pair        text,
  direction   text,
  entry       numeric,
  sl          numeric,
  tp          numeric,
  result_pct  numeric,
  notes       text,
  taken_at    timestamptz default now()
);

-- ---------------------------------------------------------------
-- Progreso de curso
-- ---------------------------------------------------------------
create table class_progress (
  user_id      uuid references profiles(id) on delete cascade,
  class_id     uuid references classes(id)  on delete cascade,
  completed_at timestamptz,
  primary key (user_id, class_id)
);

-- ---------------------------------------------------------------
-- Índices
-- ---------------------------------------------------------------
create index on bias        (published_at desc);
create index on signals     (posted_at desc);
create index on classes     (published_at desc);
create index on payments    (user_id, paid_at desc);
create index on journal_trades (user_id, taken_at desc);
create index on class_progress (user_id);
