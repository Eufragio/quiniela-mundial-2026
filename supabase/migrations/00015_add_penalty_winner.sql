-- =====================================================================
-- 00015 — Quién avanzó por penales (solo display, NO afecta puntos)
-- =====================================================================
-- En eliminatorias un partido puede terminar empatado y definirse por
-- penales. La puntuación IGNORA los penales (se mantiene la convención:
-- vale el marcador de 120' sin penales). Pero la app necesita poder
-- MOSTRAR quién avanzó.
--
-- penalty_winner: 'home' | 'away' | NULL
--   - NULL  -> el partido NO se definió por penales (lo normal)
--   - 'home'-> avanzó el equipo local por penales
--   - 'away'-> avanzó el visitante por penales
--
-- No toca calculate_prediction_points: los puntos siguen igual.
-- =====================================================================

alter table public.matches
  add column if not exists penalty_winner text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'matches_penalty_winner_check'
  ) then
    alter table public.matches
      add constraint matches_penalty_winner_check
      check (penalty_winner in ('home', 'away'));
  end if;
end $$;
