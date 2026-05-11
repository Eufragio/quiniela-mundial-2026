-- ============================================================
-- Fix: permitir unirse a una quiniela por código de invitación
-- ============================================================
-- Problema: la policy de SELECT en groups (post fix de recursión)
-- solo permite ver el grupo si sos creador o miembro. Eso ROMPE el
-- flujo de "unirme a la quiniela con un código" porque el usuario
-- nuevo no es ninguna de las dos cosas todavía.
--
-- Solución: función RPC con SECURITY DEFINER que internamente:
-- 1. Busca el grupo por invite_code (escapa la RLS porque corre como
--    el dueño de la función).
-- 2. Inserta el group_member en la tabla.
-- 3. Devuelve el group_id para que el cliente navegue.
-- ============================================================

create or replace function public.join_group_by_code(p_code text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_group_id uuid;
  v_user_id  uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  -- Buscar el grupo (escapa RLS porque la función es SECURITY DEFINER)
  select id into v_group_id
  from public.groups
  where invite_code = upper(p_code);

  if v_group_id is null then
    raise exception 'invalid_code' using errcode = 'P0001';
  end if;

  -- Intentar insertar el membership
  insert into public.group_members (group_id, user_id)
  values (v_group_id, v_user_id)
  on conflict (group_id, user_id) do nothing;

  -- Si no se insertó nada Y no era miembro previo, algo raro pasó
  -- Pero el caso normal "ya era miembro" lo dejamos pasar y devolvemos
  -- el group_id igual (idempotente)
  return v_group_id;
end;
$$;

-- Permisos: cualquier usuario autenticado puede invocarla
grant execute on function public.join_group_by_code(text) to authenticated;
