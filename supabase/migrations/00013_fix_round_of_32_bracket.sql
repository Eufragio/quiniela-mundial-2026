-- =====================================================================
-- 00013 — Corregir el cuadro del Round of 32 al bracket OFICIAL de FIFA
-- =====================================================================
-- El seed original (00001 / seed.sql) definió los 16 partidos del R32 con
-- un cuadro INVENTADO (12x "1º vs 2º" + 4x "3º vs 3º"). Eso NO es el cuadro
-- oficial del Mundial 2026 (formato 48 equipos / 12 grupos).
--
-- Cuadro REAL (partidos 73-88): 4x Subcampeón-vs-Subcampeón,
-- 4x Ganador-vs-Subcampeón, 8x Ganador-vs-mejor 3º.
-- Fuente: FIFA + en.wikipedia.org/wiki/2026_FIFA_World_Cup_knockout_stage
--
-- Esta migración reescribe home_team, away_team, match_date y venue de las
-- 16 filas existentes (emparejando por su placeholder original). Preserva
-- match_id, así que NO rompe predicciones (FK on delete cascade intacto).
--
-- Equipos ya definidos (grupos A-I terminados): se cargan con el nombre real
-- (exacto del mapa de banderas). Los que faltan (1L, 2J, 1J, 1K, 2K, 2L y los
-- 8 mejores terceros) quedan como placeholder legible hasta que se definan;
-- se completan desde el panel /admin (editor de equipos).
--
-- Fechas en UTC (la app las muestra en la zona del usuario).
-- =====================================================================

-- M73 — 2A vs 2B  | SoFi Stadium, Inglewood | 28-jun 12:00 PT
update public.matches set home_team = 'South Africa', away_team = 'Canada',
  match_date = '2026-06-28 19:00:00+00', venue = 'SoFi Stadium, Inglewood'
where phase = 'round_of_32' and home_team = '1º Grupo A' and away_team = '2º Grupo C';

-- M74 — 1E vs Mejor 3º | Gillette Stadium, Foxborough | 29-jun 16:30 ET
update public.matches set home_team = 'Germany', away_team = 'Mejor 3º (A/B/C/D/F)',
  match_date = '2026-06-29 20:30:00+00', venue = 'Gillette Stadium, Foxborough'
where phase = 'round_of_32' and home_team = '1º Grupo B' and away_team = '2º Grupo D';

-- M75 — 1F vs 2C | Estadio BBVA, Guadalupe | 29-jun 19:00 CT
update public.matches set home_team = 'Netherlands', away_team = 'Morocco',
  match_date = '2026-06-30 01:00:00+00', venue = 'Estadio BBVA, Guadalupe'
where phase = 'round_of_32' and home_team = '1º Grupo C' and away_team = '2º Grupo A';

-- M76 — 1C vs 2F | NRG Stadium, Houston | 29-jun 12:00 CT
update public.matches set home_team = 'Brazil', away_team = 'Japan',
  match_date = '2026-06-29 17:00:00+00', venue = 'NRG Stadium, Houston'
where phase = 'round_of_32' and home_team = '1º Grupo D' and away_team = '2º Grupo B';

-- M77 — 1I vs Mejor 3º | MetLife Stadium, East Rutherford | 30-jun 17:00 ET
update public.matches set home_team = 'France', away_team = 'Mejor 3º (C/D/F/G/H)',
  match_date = '2026-06-30 21:00:00+00', venue = 'MetLife Stadium, East Rutherford'
where phase = 'round_of_32' and home_team = '1º Grupo E' and away_team = '2º Grupo G';

-- M78 — 2E vs 2I | AT&T Stadium, Arlington | 30-jun 12:00 CT
update public.matches set home_team = 'Ivory Coast', away_team = 'Norway',
  match_date = '2026-06-30 17:00:00+00', venue = 'AT&T Stadium, Arlington'
where phase = 'round_of_32' and home_team = '1º Grupo F' and away_team = '2º Grupo H';

-- M79 — 1A vs Mejor 3º | Estadio Azteca, Ciudad de México | 30-jun 19:00 CT
update public.matches set home_team = 'Mexico', away_team = 'Mejor 3º (C/E/F/H/I)',
  match_date = '2026-07-01 01:00:00+00', venue = 'Estadio Azteca, Ciudad de México'
where phase = 'round_of_32' and home_team = '1º Grupo G' and away_team = '2º Grupo E';

-- M80 — 1L vs Mejor 3º | Mercedes-Benz Stadium, Atlanta | 1-jul 12:00 ET
update public.matches set home_team = '1º Grupo L', away_team = 'Mejor 3º (E/H/I/J/K)',
  match_date = '2026-07-01 16:00:00+00', venue = 'Mercedes-Benz Stadium, Atlanta'
where phase = 'round_of_32' and home_team = '1º Grupo H' and away_team = '2º Grupo F';

-- M81 — 1D vs Mejor 3º | Levi's Stadium, Santa Clara | 1-jul 17:00 PT
update public.matches set home_team = 'USA', away_team = 'Mejor 3º (B/E/F/I/J)',
  match_date = '2026-07-02 00:00:00+00', venue = 'Levi''s Stadium, Santa Clara'
where phase = 'round_of_32' and home_team = '1º Grupo I' and away_team = '2º Grupo K';

-- M82 — 1G vs Mejor 3º | Lumen Field, Seattle | 1-jul 13:00 PT
update public.matches set home_team = 'Belgium', away_team = 'Mejor 3º (A/E/H/I/J)',
  match_date = '2026-07-01 20:00:00+00', venue = 'Lumen Field, Seattle'
where phase = 'round_of_32' and home_team = '1º Grupo J' and away_team = '2º Grupo L';

-- M83 — 2K vs 2L | BMO Field, Toronto | 2-jul 19:00 ET
update public.matches set home_team = '2º Grupo K', away_team = '2º Grupo L',
  match_date = '2026-07-02 23:00:00+00', venue = 'BMO Field, Toronto'
where phase = 'round_of_32' and home_team = '1º Grupo K' and away_team = '2º Grupo I';

-- M84 — 1H vs 2J | SoFi Stadium, Inglewood | 2-jul 12:00 PT
update public.matches set home_team = 'Spain', away_team = '2º Grupo J',
  match_date = '2026-07-02 19:00:00+00', venue = 'SoFi Stadium, Inglewood'
where phase = 'round_of_32' and home_team = '1º Grupo L' and away_team = '2º Grupo J';

-- M85 — 1B vs Mejor 3º | BC Place, Vancouver | 2-jul 20:00 PT
update public.matches set home_team = 'Switzerland', away_team = 'Mejor 3º (E/F/G/I/J)',
  match_date = '2026-07-03 03:00:00+00', venue = 'BC Place, Vancouver'
where phase = 'round_of_32' and home_team = '3º Mejor A' and away_team = '3º Mejor B';

-- M86 — 1J vs 2H | Hard Rock Stadium, Miami Gardens | 3-jul 18:00 ET
update public.matches set home_team = '1º Grupo J', away_team = 'Cabo Verde',
  match_date = '2026-07-03 22:00:00+00', venue = 'Hard Rock Stadium, Miami Gardens'
where phase = 'round_of_32' and home_team = '3º Mejor C' and away_team = '3º Mejor D';

-- M87 — 1K vs Mejor 3º | Arrowhead Stadium, Kansas City | 3-jul 20:30 CT
update public.matches set home_team = '1º Grupo K', away_team = 'Mejor 3º (D/E/I/J/L)',
  match_date = '2026-07-04 01:30:00+00', venue = 'Arrowhead Stadium, Kansas City'
where phase = 'round_of_32' and home_team = '3º Mejor E' and away_team = '3º Mejor F';

-- M88 — 2D vs 2G | AT&T Stadium, Arlington | 3-jul 13:00 CT
update public.matches set home_team = 'Australia', away_team = 'Egypt',
  match_date = '2026-07-03 18:00:00+00', venue = 'AT&T Stadium, Arlington'
where phase = 'round_of_32' and home_team = '3º Mejor G' and away_team = '3º Mejor H';

-- Verificación: ver cómo quedaron los 16 partidos del R32
select home_team, away_team, match_date, venue
from public.matches where phase = 'round_of_32' order by match_date;
