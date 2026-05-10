-- ============================================================
-- Row Level Security (RLS) — Mundial 2026 Quiniela
-- ============================================================

-- ─────────────────────────────────────────────
-- PROFILES
-- ─────────────────────────────────────────────
alter table public.profiles enable row level security;

-- Cualquier usuario autenticado puede ver perfiles
create policy "profiles_select" on public.profiles
  for select using (auth.role() = 'authenticated');

-- Solo el dueño puede actualizar su perfil
create policy "profiles_update" on public.profiles
  for update using (auth.uid() = id);

-- El sistema inserta el perfil vía trigger (security definer)
-- No se permite insert desde el cliente directamente

-- ─────────────────────────────────────────────
-- GROUPS
-- ─────────────────────────────────────────────
alter table public.groups enable row level security;

-- Los miembros del grupo pueden verlo
create policy "groups_select" on public.groups
  for select using (
    auth.uid() in (
      select user_id from public.group_members where group_id = id
    )
  );

-- Cualquier usuario autenticado puede crear un grupo
create policy "groups_insert" on public.groups
  for insert with check (auth.uid() = created_by);

-- Solo el administrador puede modificar el grupo
create policy "groups_update" on public.groups
  for update using (auth.uid() = created_by);

-- Solo el administrador puede eliminar el grupo
create policy "groups_delete" on public.groups
  for delete using (auth.uid() = created_by);

-- ─────────────────────────────────────────────
-- GROUP MEMBERS
-- ─────────────────────────────────────────────
alter table public.group_members enable row level security;

-- Los miembros pueden ver los otros miembros del grupo
create policy "group_members_select" on public.group_members
  for select using (
    auth.uid() in (
      select user_id from public.group_members gm2 where gm2.group_id = group_id
    )
  );

-- Cualquier autenticado puede unirse a un grupo
create policy "group_members_insert" on public.group_members
  for insert with check (auth.uid() = user_id);

-- El admin del grupo o el propio miembro puede eliminarse
create policy "group_members_delete" on public.group_members
  for delete using (
    auth.uid() = user_id or
    auth.uid() in (
      select created_by from public.groups where id = group_id
    )
  );

-- ─────────────────────────────────────────────
-- MATCHES
-- ─────────────────────────────────────────────
alter table public.matches enable row level security;

-- Todos los autenticados pueden ver los partidos
create policy "matches_select" on public.matches
  for select using (auth.role() = 'authenticated');

-- Solo se puede insertar/actualizar/eliminar con service_role
-- (el admin lo hace desde el dashboard de Supabase o script)
-- Nota: para permitir que el admin del grupo actualice resultados
-- desde la app, se puede crear una tabla admin_users y agregar
-- la condición aquí. Por ahora, solo service_role.

-- ─────────────────────────────────────────────
-- PREDICTIONS
-- ─────────────────────────────────────────────
alter table public.predictions enable row level security;

-- Ver predicciones: miembros del mismo grupo
-- (después de que el partido empiece, la UI puede filtrar
-- para no mostrar predicciones ajenas antes del partido)
create policy "predictions_select" on public.predictions
  for select using (
    auth.uid() in (
      select user_id from public.group_members where group_id = predictions.group_id
    )
  );

-- Crear predicción: solo el propio usuario, solo si el partido no empezó
create policy "predictions_insert" on public.predictions
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.group_members
      where group_id = predictions.group_id and user_id = auth.uid()
    )
    and exists (
      select 1 from public.matches
      where id = match_id and match_date > now() and is_finished = false
    )
  );

-- Actualizar predicción: solo el dueño, solo si el partido no empezó
create policy "predictions_update" on public.predictions
  for update using (
    auth.uid() = user_id
    and exists (
      select 1 from public.matches
      where id = match_id and match_date > now() and is_finished = false
    )
  );

-- Eliminar predicción: solo el dueño, solo si el partido no empezó
create policy "predictions_delete" on public.predictions
  for delete using (
    auth.uid() = user_id
    and exists (
      select 1 from public.matches
      where id = match_id and match_date > now() and is_finished = false
    )
  );

-- ─────────────────────────────────────────────
-- REALTIME: habilitar tablas para suscripciones
-- ─────────────────────────────────────────────
alter publication supabase_realtime add table public.predictions;
alter publication supabase_realtime add table public.matches;
