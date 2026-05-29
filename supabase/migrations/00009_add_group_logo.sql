-- ============================================================
-- 00009 — Logo de quiniela (columna logo_url en groups)
-- ============================================================
-- Permite que el admin (created_by) de cada grupo suba un logo
-- propio. La URL apunta al objeto público del bucket group-logos
-- (ver migración 00010 para el bucket y sus policies).
--
-- No se tocan policies: groups_update (00002) ya permite al created_by
-- actualizar su grupo, y groups_select (00004) deja a los miembros leerlo.
-- La columna viaja en el SELECT * que ya hacen los hooks.
-- ============================================================

alter table public.groups add column if not exists logo_url text;
