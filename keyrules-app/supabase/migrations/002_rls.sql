-- =============================================================
-- KeyRules × ALG Capitals — Row Level Security
-- Correr DESPUÉS de 001_schema.sql
-- =============================================================

-- Habilitar RLS en todas las tablas
alter table profiles       enable row level security;
alter table bias           enable row level security;
alter table classes        enable row level security;
alter table signals        enable row level security;
alter table media_items    enable row level security;
alter table meet_config    enable row level security;
alter table payments       enable row level security;
alter table journal_trades enable row level security;
alter table class_progress enable row level security;

-- ---------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------
-- Usuario lee/edita el suyo
create policy "profiles: user reads own"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles: user updates own"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Admin lee todos
create policy "profiles: admin reads all"
  on profiles for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "profiles: admin updates all"
  on profiles for update
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- ---------------------------------------------------------------
-- bias — lectura por plan, escritura solo admin
-- ---------------------------------------------------------------
create policy "bias: select by plan"
  on bias for select
  using (
    published_at is not null
    and public.current_user_plan_level() >= public.plan_level(min_plan)
  );

create policy "bias: admin write"
  on bias for all
  using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ---------------------------------------------------------------
-- classes — lectura por plan, escritura solo admin
-- ---------------------------------------------------------------
create policy "classes: select by plan"
  on classes for select
  using (
    published_at is not null
    and public.current_user_plan_level() >= public.plan_level(min_plan)
  );

create policy "classes: admin write"
  on classes for all
  using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ---------------------------------------------------------------
-- signals — lectura por plan, escritura solo admin
-- ---------------------------------------------------------------
create policy "signals: select by plan"
  on signals for select
  using (
    public.current_user_plan_level() >= public.plan_level(min_plan)
  );

create policy "signals: admin write"
  on signals for all
  using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ---------------------------------------------------------------
-- media_items — lectura pública, escritura solo admin
-- ---------------------------------------------------------------
create policy "media_items: public read"
  on media_items for select
  using (published = true);

create policy "media_items: admin write"
  on media_items for all
  using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ---------------------------------------------------------------
-- meet_config — lectura pública, escritura solo admin
-- ---------------------------------------------------------------
create policy "meet_config: public read"
  on meet_config for select
  using (true);

create policy "meet_config: admin write"
  on meet_config for all
  using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ---------------------------------------------------------------
-- payments — user lee los suyos, admin lee todos
-- ---------------------------------------------------------------
create policy "payments: user reads own"
  on payments for select
  using (auth.uid() = user_id);

create policy "payments: admin all"
  on payments for all
  using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- ---------------------------------------------------------------
-- journal_trades — solo el dueño
-- ---------------------------------------------------------------
create policy "journal: user owns"
  on journal_trades for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------
-- class_progress — solo el dueño
-- ---------------------------------------------------------------
create policy "progress: user owns"
  on class_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
