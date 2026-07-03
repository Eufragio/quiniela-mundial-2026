-- =====================================================================
-- 00016 — Cargar el Round of 16 (octavos) con el cuadro OFICIAL de FIFA
-- =====================================================================
-- El seed original dejó los 8 partidos de octavos como placeholder
-- ('Ganador R32-1' vs 'Ganador R32-2', ...) con fechas del 10-13 jul y
-- sedes incorrectas. El calendario REAL de la FIFA juega los octavos del
-- 4 al 7 de julio. Como la app cierra las predicciones cuando
-- match_date < now(), dejar las fechas viejas permitiría predecir un
-- partido DESPUÉS de que se jugó. Esta migración corrige equipos + fecha
-- + sede de las 8 filas, emparejando por su placeholder original.
--
-- Preserva match_id (no rompe predicciones; FK on delete cascade intacto).
--
-- Estado al 3-jul: 6 cruces 100% definidos. Los partidos 86/87/88 (R32)
-- se juegan HOY, así que 2 octavos quedan con un rival pendiente como
-- placeholder legible; se completan desde /admin (editor de equipos):
--   - Ganador P86 (ARG/CPV)  = ganador Argentina vs Cabo Verde
--   - Ganador P87 (COL/GHA)  = ganador Colombia vs Ghana
--   - Ganador P88 (AUS/EGY)  = ganador Australia vs Egypt
--
-- Fechas en UTC (la app las muestra en la zona del usuario).
-- Nombres de equipo EXACTOS al mapa de banderas (utils.ts).
-- =====================================================================

-- OC1 — Canada vs Morocco | NRG Stadium, Houston | 4-jul 17:00 UTC
update public.matches set home_team = 'Canada', away_team = 'Morocco',
  match_date = '2026-07-04 17:00:00+00', venue = 'NRG Stadium, Houston'
where phase = 'round_of_16' and home_team = 'Ganador R32-1' and away_team = 'Ganador R32-2';

-- OC2 — Paraguay vs France | Lincoln Financial Field, Filadelfia | 4-jul 21:00 UTC
update public.matches set home_team = 'Paraguay', away_team = 'France',
  match_date = '2026-07-04 21:00:00+00', venue = 'Lincoln Financial Field, Filadelfia'
where phase = 'round_of_16' and home_team = 'Ganador R32-3' and away_team = 'Ganador R32-4';

-- OC3 — Brazil vs Norway | MetLife Stadium, East Rutherford | 5-jul 20:00 UTC
update public.matches set home_team = 'Brazil', away_team = 'Norway',
  match_date = '2026-07-05 20:00:00+00', venue = 'MetLife Stadium, East Rutherford'
where phase = 'round_of_16' and home_team = 'Ganador R32-5' and away_team = 'Ganador R32-6';

-- OC4 — Mexico vs England | Estadio Azteca, Ciudad de México | 6-jul 00:00 UTC
update public.matches set home_team = 'Mexico', away_team = 'England',
  match_date = '2026-07-06 00:00:00+00', venue = 'Estadio Azteca, Ciudad de México'
where phase = 'round_of_16' and home_team = 'Ganador R32-7' and away_team = 'Ganador R32-8';

-- OC5 — Portugal vs Spain | AT&T Stadium, Arlington | 6-jul 19:00 UTC
update public.matches set home_team = 'Portugal', away_team = 'Spain',
  match_date = '2026-07-06 19:00:00+00', venue = 'AT&T Stadium, Arlington'
where phase = 'round_of_16' and home_team = 'Ganador R32-9' and away_team = 'Ganador R32-10';

-- OC6 — USA vs Belgium | Lumen Field, Seattle | 7-jul 00:00 UTC
update public.matches set home_team = 'USA', away_team = 'Belgium',
  match_date = '2026-07-07 00:00:00+00', venue = 'Lumen Field, Seattle'
where phase = 'round_of_16' and home_team = 'Ganador R32-11' and away_team = 'Ganador R32-12';

-- OC7 — Gan.P86 (ARG/CPV) vs Gan.P88 (AUS/EGY) | Mercedes-Benz Stadium, Atlanta | 7-jul 16:00 UTC
update public.matches set home_team = 'Ganador P86 (ARG/CPV)', away_team = 'Ganador P88 (AUS/EGY)',
  match_date = '2026-07-07 16:00:00+00', venue = 'Mercedes-Benz Stadium, Atlanta'
where phase = 'round_of_16' and home_team = 'Ganador R32-13' and away_team = 'Ganador R32-14';

-- OC8 — Switzerland vs Gan.P87 (COL/GHA) | BC Place, Vancouver | 7-jul 20:00 UTC
update public.matches set home_team = 'Switzerland', away_team = 'Ganador P87 (COL/GHA)',
  match_date = '2026-07-07 20:00:00+00', venue = 'BC Place, Vancouver'
where phase = 'round_of_16' and home_team = 'Ganador R32-15' and away_team = 'Ganador R32-16';

-- Verificación: ver cómo quedaron los 8 partidos de octavos
select home_team, away_team, match_date, venue
from public.matches where phase = 'round_of_16' order by match_date;
