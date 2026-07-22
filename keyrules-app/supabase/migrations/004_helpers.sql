-- =============================================================
-- KeyRules × ALG Capitals — Migración 004
-- Helpers portados desde schema.sql antes de eliminarlo.
-- Correr DESPUÉS de 001, 002, 003.
-- =============================================================

-- Helper: obtener role del usuario actual (evita recursión de RLS)
create or replace function get_my_role()
returns user_role language sql security definer stable as $$
  select role from profiles where id = auth.uid()
$$;

-- Helper: obtener plan del usuario actual (respeta expiración)
create or replace function get_my_plan()
returns plan_tier language sql security definer stable as $$
  select plan from profiles
  where id = auth.uid()
    and (plan_expires_at is null or plan_expires_at > now())
$$;
