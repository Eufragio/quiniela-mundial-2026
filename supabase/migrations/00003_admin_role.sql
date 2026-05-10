-- ============================================================
-- Admin role — permite cargar resultados oficiales desde la app
-- ============================================================
-- Modelo: super admin global. Los matches son globales (104 partidos
-- compartidos por todos los grupos), por lo tanto un único set de
-- usuarios admins carga los resultados oficiales.
--
-- Bootstrap del primer admin (correr UNA SOLA VEZ desde Supabase SQL Editor):
--   update public.profiles set is_admin = true where username = 'tu_username';
-- ============================================================

-- ─────────────────────────────────────────────
-- Columna is_admin en profiles
-- ─────────────────────────────────────────────
alter table public.profiles
  add column if not exists is_admin boolean not null default false;

create index if not exists profiles_is_admin_idx
  on public.profiles(is_admin)
  where is_admin = true;

-- ─────────────────────────────────────────────
-- Helper: chequear si el usuario actual es admin
-- ─────────────────────────────────────────────
create or replace function public.is_current_user_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

-- ─────────────────────────────────────────────
-- RLS: matches — admins pueden insert/update/delete
-- ─────────────────────────────────────────────
create policy "matches_insert_admin" on public.matches
  for insert with check (public.is_current_user_admin());

create policy "matches_update_admin" on public.matches
  for update using (public.is_current_user_admin());

create policy "matches_delete_admin" on public.matches
  for delete using (public.is_current_user_admin());

-- ─────────────────────────────────────────────
-- profiles.is_admin: nadie puede setear is_admin desde el cliente.
-- La policy de update existente solo permite cambiar username/avatar_url,
-- y como is_admin no está en el Update type ni en la policy, queda
-- protegido. Para promover un admin: SQL Editor con service_role.
-- ─────────────────────────────────────────────
