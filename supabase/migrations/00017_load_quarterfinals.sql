-- =====================================================================
-- 00017 — Cargar los Cuartos de final con el cuadro OFICIAL de FIFA
-- =====================================================================
-- El seed dejó los 4 cuartos como placeholder ('Ganador OC-1' vs
-- 'Ganador OC-2', ...) con fechas del 15-16 jul y sedes incorrectas.
-- El calendario REAL de la FIFA juega los cuartos del 9 al 12 de julio.
-- Como la app cierra las predicciones cuando match_date < now(), dejar
-- las fechas viejas permitiría predecir un partido DESPUÉS de jugado.
-- Esta migración corrige equipos + fecha + sede de las 4 filas,
-- emparejando por su placeholder original.
--
-- Preserva match_id (no rompe predicciones; FK on delete cascade intacto).
--
-- Estado al 6-jul (fuente: Wikipedia "2026 FIFA World Cup knockout stage"):
-- 2 cruces 100% definidos (octavos OC1-OC4 ya jugados):
--   - OC1: Canada 0-3 Morocco  -> Morocco
--   - OC2: Paraguay 0-1 France -> France
--   - OC3: Brazil 1-2 Norway   -> Norway
--   - OC4: Mexico 2-3 England  -> England
-- 2 cruces con rivales pendientes (octavos OC5-OC8 aún no jugados),
-- quedan con placeholder legible y se completan desde /admin:
--   - OC5: Portugal vs Spain
--   - OC6: USA vs Belgium
--   - OC7: Argentina vs Egypt
--   - OC8: Switzerland vs Colombia
--
-- OJO: el bracket oficial coincidió con el emparejamiento del seed
-- (OC1-OC2, OC3-OC4, OC5-OC6, OC7-OC8), PERO el Match 97 va con el
-- local/visitante invertido respecto al placeholder: FIFA pone France
-- (ganador OC2) como local y Morocco (ganador OC1) como visitante.
--
-- Fechas en UTC (la app las muestra en la zona del usuario).
-- Nombres de equipo EXACTOS al mapa de banderas (utils.ts).
-- =====================================================================

-- CF1 (Match 97) — France vs Morocco | Gillette Stadium, Foxborough | 9-jul 20:00 UTC
-- (local/visitante invertidos respecto al placeholder OC-1 vs OC-2)
update public.matches set home_team = 'France', away_team = 'Morocco',
  match_date = '2026-07-09 20:00:00+00', venue = 'Gillette Stadium, Foxborough'
where phase = 'quarterfinal' and home_team = 'Ganador OC-1' and away_team = 'Ganador OC-2';

-- CF2 (Match 99) — Norway vs England | Hard Rock Stadium, Miami Gardens | 11-jul 21:00 UTC
update public.matches set home_team = 'Norway', away_team = 'England',
  match_date = '2026-07-11 21:00:00+00', venue = 'Hard Rock Stadium, Miami Gardens'
where phase = 'quarterfinal' and home_team = 'Ganador OC-3' and away_team = 'Ganador OC-4';

-- CF3 (Match 98) — Gan. OC5 (POR/ESP) vs Gan. OC6 (USA/BEL) | SoFi Stadium, Inglewood | 10-jul 19:00 UTC
update public.matches set home_team = 'Ganador OC5 (POR/ESP)', away_team = 'Ganador OC6 (USA/BEL)',
  match_date = '2026-07-10 19:00:00+00', venue = 'SoFi Stadium, Inglewood'
where phase = 'quarterfinal' and home_team = 'Ganador OC-5' and away_team = 'Ganador OC-6';

-- CF4 (Match 100) — Gan. OC7 (ARG/EGY) vs Gan. OC8 (SUI/COL) | Arrowhead Stadium, Kansas City | 12-jul 01:00 UTC
update public.matches set home_team = 'Ganador OC7 (ARG/EGY)', away_team = 'Ganador OC8 (SUI/COL)',
  match_date = '2026-07-12 01:00:00+00', venue = 'Arrowhead Stadium, Kansas City'
where phase = 'quarterfinal' and home_team = 'Ganador OC-7' and away_team = 'Ganador OC-8';

-- Verificación: ver cómo quedaron los 4 partidos de cuartos
select home_team, away_team, match_date, venue
from public.matches where phase = 'quarterfinal' order by match_date;
