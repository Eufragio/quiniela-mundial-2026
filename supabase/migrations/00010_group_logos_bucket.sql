-- ============================================================
-- 00010 — Bucket "group-logos" + RLS policies
-- ============================================================
-- Bucket público de lectura (cualquiera ve los logos vía la URL),
-- escritura restringida al admin (created_by) del grupo.
--
-- Convención de path: {group_id}/logo-{timestamp}.{ext}
-- La policy extrae el primer segmento del path (= group_id) con
-- (storage.foldername(name))[1] y valida que auth.uid() sea el
-- created_by del grupo.
-- ============================================================

-- 1) Crear el bucket si no existe (public = true → lectura abierta)
insert into storage.buckets (id, name, public)
values ('group-logos', 'group-logos', true)
on conflict (id) do nothing;

-- 2) Limpiar policies previas (idempotente — permite re-correr esta migración)
drop policy if exists "group_logos_select" on storage.objects;
drop policy if exists "group_logos_insert" on storage.objects;
drop policy if exists "group_logos_update" on storage.objects;
drop policy if exists "group_logos_delete" on storage.objects;

-- 3) SELECT: cualquiera puede ver los logos (el bucket ya es público,
--    pero RLS sigue activo sobre storage.objects, así que la policy
--    explícita es necesaria).
create policy "group_logos_select"
  on storage.objects for select
  using (bucket_id = 'group-logos');

-- 4) INSERT: solo el admin del grupo (created_by) cuyo id es el primer
--    segmento del path puede subir archivos a su carpeta.
create policy "group_logos_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'group-logos'
    and auth.uid() = (
      select created_by
      from public.groups
      where id::text = (storage.foldername(name))[1]
    )
  );

-- 5) UPDATE: mismo criterio que INSERT.
create policy "group_logos_update"
  on storage.objects for update
  using (
    bucket_id = 'group-logos'
    and auth.uid() = (
      select created_by
      from public.groups
      where id::text = (storage.foldername(name))[1]
    )
  );

-- 6) DELETE: mismo criterio que INSERT.
create policy "group_logos_delete"
  on storage.objects for delete
  using (
    bucket_id = 'group-logos'
    and auth.uid() = (
      select created_by
      from public.groups
      where id::text = (storage.foldername(name))[1]
    )
  );
