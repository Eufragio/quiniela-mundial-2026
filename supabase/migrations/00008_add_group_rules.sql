-- ============================================================
-- 00008 — Reglas por quiniela (columna rules en groups)
-- ============================================================
-- Permite que el admin (created_by) de cada grupo defina reglas
-- propias (premios, apuestas, fechas límite, etc.) que los miembros
-- pueden ver. Texto libre, opcional.
--
-- No se tocan policies: groups_update (00002) ya permite al created_by
-- actualizar su grupo, y groups_select (00004) deja a los miembros leerlo.
-- La columna viaja en el SELECT * que ya hacen los hooks.
-- ============================================================

alter table public.groups add column if not exists rules text;
