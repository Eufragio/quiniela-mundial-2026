-- ============================================================
-- Fix: infinite recursion en policies de RLS
-- ============================================================
-- Problema: las policies de SELECT en group_members, groups y predictions
-- referenciaban a group_members en su body, lo cual disparaba recursión
-- infinita al evaluar la policy.
--
-- Solución: extraer la lógica a una función SECURITY DEFINER que corre
-- con permisos del dueño y por lo tanto NO aplica RLS dentro de su body,
-- rompiendo el ciclo.
-- ============================================================

-- ─────────────────────────────────────────────
-- Helper: ¿el usuario actual es miembro de este grupo?
-- ─────────────────────────────────────────────
create or replace function public.is_user_in_group(p_group_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.group_members
    where group_id = p_group_id and user_id = auth.uid()
  );
$$;

-- ─────────────────────────────────────────────
-- Reemplazar policies recursivas
-- ─────────────────────────────────────────────

-- groups: solo los miembros pueden ver el grupo
drop policy if exists "groups_select" on public.groups;
create policy "groups_select" on public.groups
  for select using (
    auth.uid() = created_by or public.is_user_in_group(id)
  );

-- group_members: los miembros del grupo pueden verse entre sí
drop policy if exists "group_members_select" on public.group_members;
create policy "group_members_select" on public.group_members
  for select using (
    user_id = auth.uid() or public.is_user_in_group(group_id)
  );

-- predictions: los miembros del grupo pueden ver predicciones del grupo
drop policy if exists "predictions_select" on public.predictions;
create policy "predictions_select" on public.predictions
  for select using (
    public.is_user_in_group(group_id)
  );
