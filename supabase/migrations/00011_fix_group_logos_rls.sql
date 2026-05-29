-- ============================================================
-- 00011 — Fix RLS: helper SECURITY DEFINER para group-logos
-- ============================================================
-- Problema: las policies de storage.objects (creadas en 00010)
-- consultaban public.groups directamente. Como esa subquery
-- respeta el RLS de groups, en algunos contextos no encontraba
-- la fila y la policy retornaba FALSE → "new row violates row-level
-- security policy" al subir logos.
--
-- Solución: extraer la lógica a una función SECURITY DEFINER
-- (mismo patrón que is_user_in_group en 00004). La función corre
-- con permisos del dueño y por lo tanto NO aplica RLS dentro de
-- su body, mientras que auth.uid() sigue siendo el del request.
-- ============================================================

-- ─────────────────────────────────────────────
-- Helper: ¿el usuario actual es el admin (created_by) de este grupo?
-- ─────────────────────────────────────────────
create or replace function public.is_group_admin(p_group_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.groups
    where id = p_group_id and created_by = auth.uid()
  );
$$;

-- ─────────────────────────────────────────────
-- Reemplazar policies de storage.objects con la helper
-- ─────────────────────────────────────────────
drop policy if exists "group_logos_insert" on storage.objects;
drop policy if exists "group_logos_update" on storage.objects;
drop policy if exists "group_logos_delete" on storage.objects;

create policy "group_logos_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'group-logos'
    and public.is_group_admin(((storage.foldername(name))[1])::uuid)
  );

create policy "group_logos_update"
  on storage.objects for update
  using (
    bucket_id = 'group-logos'
    and public.is_group_admin(((storage.foldername(name))[1])::uuid)
  );

create policy "group_logos_delete"
  on storage.objects for delete
  using (
    bucket_id = 'group-logos'
    and public.is_group_admin(((storage.foldername(name))[1])::uuid)
  );

-- Nota: la policy group_logos_select de 00010 NO se toca — sigue
-- permitiendo lectura pública (cualquiera ve los logos vía URL).
