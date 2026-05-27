-- ============================================================
-- 00007 — Restringir lectura de predicciones ajenas antes del partido
-- ============================================================
-- Antes (00004): predictions_select dejaba a cualquier miembro del grupo
-- leer TODAS las predicciones del grupo, sin importar si el partido empezó.
-- El filtrado se delegaba a la UI, lo cual es inseguro: la anon key es
-- pública, así que cualquiera podía consultar la API directamente y ver
-- los pronósticos de sus rivales antes de jugar — rompiendo el juego.
--
-- Ahora: una predicción ajena solo es visible si el partido ya empezó
-- (match_date <= now()). Las propias son siempre visibles.
--
-- Se conserva is_user_in_group() (SECURITY DEFINER) del fix de recursión
-- 00004. El EXISTS sobre matches no genera ciclo: matches no referencia
-- predictions ni group_members.
-- ============================================================

drop policy if exists "predictions_select" on public.predictions;

create policy "predictions_select" on public.predictions
  for select using (
    public.is_user_in_group(group_id)
    and (
      user_id = auth.uid()
      or exists (
        select 1 from public.matches
        where id = predictions.match_id
          and match_date <= now()
      )
    )
  );
