-- =====================================================================
-- 00019 — Resolver equipos de 3er puesto y final
-- =====================================================================
-- Estado al 15-jul: las semifinales YA están cargadas y terminadas
-- (verificado contra la DB):
--   - SF1: France 0-2 Spain    -> Ganador: Spain    | Perdedor: France
--   - SF2: England 1-2 Argentina -> Ganador: Argentina | Perdedor: England
--
-- El bracket se resuelve solo:
--   - Final       = Ganador SF-1 (Spain)  vs Ganador SF-2 (Argentina)
--   - 3er puesto  = Perdedor SF-1 (France) vs Perdedor SF-2 (England)
--
-- IMPORTANTE: estos partidos NO se jugaron (3er puesto 18-jul, final 19-jul).
-- Solo se resuelven los nombres de equipo; NO se tocan home_score/away_score
-- ni is_finished. Así las predicciones siguen ABIERTAS (RLS permite predecir
-- mientras match_date > now()). El marcador se ingresa desde /admin al terminar.
--
-- Se preservan match_date y venue (ya cargados correctamente por la 00018:
-- 3er puesto -> Hard Rock Stadium, Miami Gardens; final -> MetLife Stadium).
-- Se empareja por los placeholders actuales -> preserva match_id, no rompe FKs.
-- Nombres de equipo EXACTOS al mapa de banderas (utils.ts).
-- =====================================================================

-- 3er puesto — France (Perdedor SF-1) vs England (Perdedor SF-2)
update public.matches
set home_team = 'France', away_team = 'England'
where phase = 'third_place'
  and home_team = 'Perdedor SF-1' and away_team = 'Perdedor SF-2';

-- Final — Spain (Ganador SF-1) vs Argentina (Ganador SF-2)
update public.matches
set home_team = 'Spain', away_team = 'Argentina'
where phase = 'final'
  and home_team = 'Ganador SF-1' and away_team = 'Ganador SF-2';

-- Verificación
select phase, home_team, away_team, home_score, away_score, is_finished, match_date, venue
from public.matches
where phase in ('semifinal', 'third_place', 'final')
order by match_date;
