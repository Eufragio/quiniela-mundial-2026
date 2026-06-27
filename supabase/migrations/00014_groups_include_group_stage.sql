-- =====================================================================
-- 00014 — Flag por quiniela: ¿incluye la fase de grupos?
-- =====================================================================
-- El Mundial ya arrancó y la fase de grupos está casi terminada. Las
-- quinielas NUEVAS (creadas de ahora en adelante) no deben tomar en cuenta
-- la fase de grupos: arrancan directo en eliminatorias (Round of 32+).
-- Las quinielas YA EXISTENTES conservan la fase de grupos como hasta ahora.
--
-- Estrategia: columna booleana con default FALSE (nuevas = solo eliminatoria)
-- y backfill TRUE para todas las filas actuales (viejas = con grupos).
--
-- IMPORTANTE: correr esta migración ANTES de crear las quinielas nuevas de hoy.
-- =====================================================================

alter table public.groups
  add column if not exists includes_group_stage boolean not null default false;

-- Todas las quinielas que ya existen mantienen la fase de grupos.
update public.groups set includes_group_stage = true;

-- Verificación
select id, name, includes_group_stage, created_at
from public.groups
order by created_at;
