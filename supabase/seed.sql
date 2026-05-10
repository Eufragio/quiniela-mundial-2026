-- ============================================================
-- Seed: 104 partidos del Mundial 2026
-- Grupos A-L (72 partidos) + Eliminatorias (32 partidos)
--
-- Grupos:
--   A: USA, France, Cameroon, Japan
--   B: Mexico, Germany, Morocco, South Korea
--   C: Canada, England, Senegal, Iran
--   D: Brazil, Spain, Nigeria, Australia
--   E: Argentina, Netherlands, Egypt, Ecuador
--   F: Portugal, Italy, Tunisia, Saudi Arabia
--   G: Colombia, Croatia, Algeria, Poland
--   H: Uruguay, Belgium, Ghana, Turkey
--   I: Switzerland, Chile, South Africa, Qatar
--   J: Denmark, Panama, Iraq, New Zealand
--   K: Austria, Honduras, Jamaica, China PR
--   L: Serbia, Venezuela, Jordan, Scotland
-- ============================================================

insert into public.matches (home_team, away_team, match_date, phase, group_name, venue) values

-- ══════════════════════════════════════════
-- GRUPO A — USA · France · Cameroon · Japan
-- ══════════════════════════════════════════
-- Jornada 1
('USA',      'France',   '2026-06-11 20:00:00+00', 'group_stage', 'A', 'Estadio Azteca, Ciudad de México'),
('Cameroon', 'Japan',    '2026-06-11 23:00:00+00', 'group_stage', 'A', 'AT&T Stadium, Arlington'),
-- Jornada 2
('USA',      'Cameroon', '2026-06-17 18:00:00+00', 'group_stage', 'A', 'SoFi Stadium, Los Ángeles'),
('France',   'Japan',    '2026-06-17 21:00:00+00', 'group_stage', 'A', 'Hard Rock Stadium, Miami'),
-- Jornada 3 (simultáneos)
('USA',      'Japan',    '2026-06-23 18:00:00+00', 'group_stage', 'A', 'MetLife Stadium, Nueva Jersey'),
('France',   'Cameroon', '2026-06-23 18:00:00+00', 'group_stage', 'A', 'Allegiant Stadium, Las Vegas'),

-- ══════════════════════════════════════════
-- GRUPO B — Mexico · Germany · Morocco · South Korea
-- ══════════════════════════════════════════
-- Jornada 1
('Mexico',      'Germany',      '2026-06-12 20:00:00+00', 'group_stage', 'B', 'Estadio Akron, Guadalajara'),
('Morocco',     'South Korea',  '2026-06-12 23:00:00+00', 'group_stage', 'B', 'Levi''s Stadium, Santa Clara'),
-- Jornada 2
('Mexico',      'Morocco',      '2026-06-18 18:00:00+00', 'group_stage', 'B', 'Estadio BBVA, Monterrey'),
('Germany',     'South Korea',  '2026-06-18 21:00:00+00', 'group_stage', 'B', 'Rose Bowl, Pasadena'),
-- Jornada 3 (simultáneos)
('Mexico',      'South Korea',  '2026-06-24 18:00:00+00', 'group_stage', 'B', 'Estadio Azteca, Ciudad de México'),
('Germany',     'Morocco',      '2026-06-24 18:00:00+00', 'group_stage', 'B', 'Lincoln Financial Field, Filadelfia'),

-- ══════════════════════════════════════════
-- GRUPO C — Canada · England · Senegal · Iran
-- ══════════════════════════════════════════
-- Jornada 1
('Canada',  'England', '2026-06-12 17:00:00+00', 'group_stage', 'C', 'BC Place, Vancouver'),
('Senegal', 'Iran',    '2026-06-12 20:00:00+00', 'group_stage', 'C', 'Gillette Stadium, Boston'),
-- Jornada 2
('Canada',  'Senegal', '2026-06-18 20:00:00+00', 'group_stage', 'C', 'BMO Field, Toronto'),
('England', 'Iran',    '2026-06-18 23:00:00+00', 'group_stage', 'C', 'AT&T Stadium, Arlington'),
-- Jornada 3 (simultáneos)
('Canada',  'Iran',    '2026-06-24 22:00:00+00', 'group_stage', 'C', 'Hard Rock Stadium, Miami'),
('England', 'Senegal', '2026-06-24 22:00:00+00', 'group_stage', 'C', 'MetLife Stadium, Nueva Jersey'),

-- ══════════════════════════════════════════
-- GRUPO D — Brazil · Spain · Nigeria · Australia
-- ══════════════════════════════════════════
-- Jornada 1
('Brazil',    'Spain',      '2026-06-13 20:00:00+00', 'group_stage', 'D', 'MetLife Stadium, Nueva Jersey'),
('Nigeria',   'Australia',  '2026-06-13 23:00:00+00', 'group_stage', 'D', 'SoFi Stadium, Los Ángeles'),
-- Jornada 2
('Brazil',    'Nigeria',    '2026-06-19 20:00:00+00', 'group_stage', 'D', 'Allegiant Stadium, Las Vegas'),
('Spain',     'Australia',  '2026-06-19 23:00:00+00', 'group_stage', 'D', 'Levi''s Stadium, Santa Clara'),
-- Jornada 3 (simultáneos)
('Brazil',    'Australia',  '2026-06-25 18:00:00+00', 'group_stage', 'D', 'Rose Bowl, Pasadena'),
('Spain',     'Nigeria',    '2026-06-25 18:00:00+00', 'group_stage', 'D', 'AT&T Stadium, Arlington'),

-- ══════════════════════════════════════════
-- GRUPO E — Argentina · Netherlands · Egypt · Ecuador
-- ══════════════════════════════════════════
-- Jornada 1
('Argentina',   'Netherlands', '2026-06-13 17:00:00+00', 'group_stage', 'E', 'Hard Rock Stadium, Miami'),
('Egypt',       'Ecuador',     '2026-06-13 20:00:00+00', 'group_stage', 'E', 'Gillette Stadium, Boston'),
-- Jornada 2
('Argentina',   'Egypt',       '2026-06-19 18:00:00+00', 'group_stage', 'E', 'MetLife Stadium, Nueva Jersey'),
('Netherlands', 'Ecuador',     '2026-06-19 21:00:00+00', 'group_stage', 'E', 'AT&T Stadium, Arlington'),
-- Jornada 3 (simultáneos)
('Argentina',   'Ecuador',     '2026-06-25 22:00:00+00', 'group_stage', 'E', 'Lincoln Financial Field, Filadelfia'),
('Netherlands', 'Egypt',       '2026-06-25 22:00:00+00', 'group_stage', 'E', 'SoFi Stadium, Los Ángeles'),

-- ══════════════════════════════════════════
-- GRUPO F — Portugal · Italy · Tunisia · Saudi Arabia
-- ══════════════════════════════════════════
-- Jornada 1
('Portugal', 'Italy',        '2026-06-14 20:00:00+00', 'group_stage', 'F', 'Rose Bowl, Pasadena'),
('Tunisia',  'Saudi Arabia', '2026-06-14 23:00:00+00', 'group_stage', 'F', 'BC Place, Vancouver'),
-- Jornada 2
('Portugal', 'Tunisia',      '2026-06-20 18:00:00+00', 'group_stage', 'F', 'Allegiant Stadium, Las Vegas'),
('Italy',    'Saudi Arabia', '2026-06-20 21:00:00+00', 'group_stage', 'F', 'Gillette Stadium, Boston'),
-- Jornada 3 (simultáneos)
('Portugal', 'Saudi Arabia', '2026-06-26 18:00:00+00', 'group_stage', 'F', 'Estadio Azteca, Ciudad de México'),
('Italy',    'Tunisia',      '2026-06-26 18:00:00+00', 'group_stage', 'F', 'MetLife Stadium, Nueva Jersey'),

-- ══════════════════════════════════════════
-- GRUPO G — Colombia · Croatia · Algeria · Poland
-- ══════════════════════════════════════════
-- Jornada 1
('Colombia', 'Croatia', '2026-06-14 17:00:00+00', 'group_stage', 'G', 'Estadio Akron, Guadalajara'),
('Algeria',  'Poland',  '2026-06-14 20:00:00+00', 'group_stage', 'G', 'BMO Field, Toronto'),
-- Jornada 2
('Colombia', 'Algeria', '2026-06-20 20:00:00+00', 'group_stage', 'G', 'SoFi Stadium, Los Ángeles'),
('Croatia',  'Poland',  '2026-06-20 23:00:00+00', 'group_stage', 'G', 'Hard Rock Stadium, Miami'),
-- Jornada 3 (simultáneos)
('Colombia', 'Poland',  '2026-06-26 22:00:00+00', 'group_stage', 'G', 'AT&T Stadium, Arlington'),
('Croatia',  'Algeria', '2026-06-26 22:00:00+00', 'group_stage', 'G', 'Levi''s Stadium, Santa Clara'),

-- ══════════════════════════════════════════
-- GRUPO H — Uruguay · Belgium · Ghana · Turkey
-- ══════════════════════════════════════════
-- Jornada 1
('Uruguay', 'Belgium', '2026-06-15 20:00:00+00', 'group_stage', 'H', 'Estadio BBVA, Monterrey'),
('Ghana',   'Turkey',  '2026-06-15 23:00:00+00', 'group_stage', 'H', 'Lincoln Financial Field, Filadelfia'),
-- Jornada 2
('Uruguay', 'Ghana',   '2026-06-21 18:00:00+00', 'group_stage', 'H', 'Rose Bowl, Pasadena'),
('Belgium', 'Turkey',  '2026-06-21 21:00:00+00', 'group_stage', 'H', 'BC Place, Vancouver'),
-- Jornada 3 (simultáneos)
('Uruguay', 'Turkey',  '2026-06-27 18:00:00+00', 'group_stage', 'H', 'Allegiant Stadium, Las Vegas'),
('Belgium', 'Ghana',   '2026-06-27 18:00:00+00', 'group_stage', 'H', 'Gillette Stadium, Boston'),

-- ══════════════════════════════════════════
-- GRUPO I — Switzerland · Chile · South Africa · Qatar
-- ══════════════════════════════════════════
-- Jornada 1
('Switzerland', 'Chile',        '2026-06-15 17:00:00+00', 'group_stage', 'I', 'Gillette Stadium, Boston'),
('South Africa','Qatar',        '2026-06-15 20:00:00+00', 'group_stage', 'I', 'BMO Field, Toronto'),
-- Jornada 2
('Switzerland', 'South Africa', '2026-06-21 20:00:00+00', 'group_stage', 'I', 'MetLife Stadium, Nueva Jersey'),
('Chile',       'Qatar',        '2026-06-21 23:00:00+00', 'group_stage', 'I', 'Estadio Azteca, Ciudad de México'),
-- Jornada 3 (simultáneos)
('Switzerland', 'Qatar',        '2026-06-27 22:00:00+00', 'group_stage', 'I', 'SoFi Stadium, Los Ángeles'),
('Chile',       'South Africa', '2026-06-27 22:00:00+00', 'group_stage', 'I', 'Hard Rock Stadium, Miami'),

-- ══════════════════════════════════════════
-- GRUPO J — Denmark · Panama · Iraq · New Zealand
-- ══════════════════════════════════════════
-- Jornada 1
('Denmark', 'Panama',      '2026-06-16 20:00:00+00', 'group_stage', 'J', 'AT&T Stadium, Arlington'),
('Iraq',    'New Zealand', '2026-06-16 23:00:00+00', 'group_stage', 'J', 'Levi''s Stadium, Santa Clara'),
-- Jornada 2
('Denmark', 'Iraq',        '2026-06-22 18:00:00+00', 'group_stage', 'J', 'Lincoln Financial Field, Filadelfia'),
('Panama',  'New Zealand', '2026-06-22 21:00:00+00', 'group_stage', 'J', 'Estadio Akron, Guadalajara'),
-- Jornada 3 (simultáneos)
('Denmark', 'New Zealand', '2026-06-28 18:00:00+00', 'group_stage', 'J', 'BC Place, Vancouver'),
('Panama',  'Iraq',        '2026-06-28 18:00:00+00', 'group_stage', 'J', 'BMO Field, Toronto'),

-- ══════════════════════════════════════════
-- GRUPO K — Austria · Honduras · Jamaica · China PR
-- ══════════════════════════════════════════
-- Jornada 1
('Austria',  'Honduras', '2026-06-16 17:00:00+00', 'group_stage', 'K', 'Rose Bowl, Pasadena'),
('Jamaica',  'China PR', '2026-06-16 20:00:00+00', 'group_stage', 'K', 'Estadio BBVA, Monterrey'),
-- Jornada 2
('Austria',  'Jamaica',  '2026-06-22 20:00:00+00', 'group_stage', 'K', 'Allegiant Stadium, Las Vegas'),
('Honduras', 'China PR', '2026-06-22 23:00:00+00', 'group_stage', 'K', 'SoFi Stadium, Los Ángeles'),
-- Jornada 3 (simultáneos)
('Austria',  'China PR', '2026-06-28 22:00:00+00', 'group_stage', 'K', 'Hard Rock Stadium, Miami'),
('Honduras', 'Jamaica',  '2026-06-28 22:00:00+00', 'group_stage', 'K', 'AT&T Stadium, Arlington'),

-- ══════════════════════════════════════════
-- GRUPO L — Serbia · Venezuela · Jordan · Scotland
-- ══════════════════════════════════════════
-- Jornada 1
('Serbia',    'Venezuela', '2026-06-17 20:00:00+00', 'group_stage', 'L', 'Gillette Stadium, Boston'),
('Jordan',    'Scotland',  '2026-06-17 23:00:00+00', 'group_stage', 'L', 'MetLife Stadium, Nueva Jersey'),
-- Jornada 2
('Serbia',    'Jordan',    '2026-06-23 20:00:00+00', 'group_stage', 'L', 'Lincoln Financial Field, Filadelfia'),
('Venezuela', 'Scotland',  '2026-06-23 23:00:00+00', 'group_stage', 'L', 'Rose Bowl, Pasadena'),
-- Jornada 3 (simultáneos)
('Serbia',    'Scotland',  '2026-06-29 18:00:00+00', 'group_stage', 'L', 'BMO Field, Toronto'),
('Venezuela', 'Jordan',    '2026-06-29 18:00:00+00', 'group_stage', 'L', 'Estadio Akron, Guadalajara'),

-- ══════════════════════════════════════════
-- RONDA DE 32 (16 partidos)
-- Teams: 1º y 2º de cada grupo + 8 mejores 3eros
-- ══════════════════════════════════════════
('1º Grupo A', '2º Grupo C', '2026-07-01 20:00:00+00', 'round_of_32', NULL, 'MetLife Stadium, Nueva Jersey'),
('1º Grupo B', '2º Grupo D', '2026-07-01 23:00:00+00', 'round_of_32', NULL, 'AT&T Stadium, Arlington'),
('1º Grupo C', '2º Grupo A', '2026-07-02 20:00:00+00', 'round_of_32', NULL, 'Rose Bowl, Pasadena'),
('1º Grupo D', '2º Grupo B', '2026-07-02 23:00:00+00', 'round_of_32', NULL, 'SoFi Stadium, Los Ángeles'),
('1º Grupo E', '2º Grupo G', '2026-07-03 20:00:00+00', 'round_of_32', NULL, 'Hard Rock Stadium, Miami'),
('1º Grupo F', '2º Grupo H', '2026-07-03 23:00:00+00', 'round_of_32', NULL, 'Allegiant Stadium, Las Vegas'),
('1º Grupo G', '2º Grupo E', '2026-07-04 20:00:00+00', 'round_of_32', NULL, 'Lincoln Financial Field, Filadelfia'),
('1º Grupo H', '2º Grupo F', '2026-07-04 23:00:00+00', 'round_of_32', NULL, 'Estadio Azteca, Ciudad de México'),
('1º Grupo I', '2º Grupo K', '2026-07-05 20:00:00+00', 'round_of_32', NULL, 'Levi''s Stadium, Santa Clara'),
('1º Grupo J', '2º Grupo L', '2026-07-05 23:00:00+00', 'round_of_32', NULL, 'BC Place, Vancouver'),
('1º Grupo K', '2º Grupo I', '2026-07-06 20:00:00+00', 'round_of_32', NULL, 'Gillette Stadium, Boston'),
('1º Grupo L', '2º Grupo J', '2026-07-06 23:00:00+00', 'round_of_32', NULL, 'BMO Field, Toronto'),
('3º Mejor A', '3º Mejor B', '2026-07-07 20:00:00+00', 'round_of_32', NULL, 'Estadio BBVA, Monterrey'),
('3º Mejor C', '3º Mejor D', '2026-07-07 23:00:00+00', 'round_of_32', NULL, 'Rose Bowl, Pasadena'),
('3º Mejor E', '3º Mejor F', '2026-07-08 20:00:00+00', 'round_of_32', NULL, 'AT&T Stadium, Arlington'),
('3º Mejor G', '3º Mejor H', '2026-07-08 23:00:00+00', 'round_of_32', NULL, 'MetLife Stadium, Nueva Jersey'),

-- ══════════════════════════════════════════
-- OCTAVOS DE FINAL (8 partidos)
-- ══════════════════════════════════════════
('Ganador R32-1', 'Ganador R32-2', '2026-07-10 20:00:00+00', 'round_of_16', NULL, 'MetLife Stadium, Nueva Jersey'),
('Ganador R32-3', 'Ganador R32-4', '2026-07-10 23:00:00+00', 'round_of_16', NULL, 'AT&T Stadium, Arlington'),
('Ganador R32-5', 'Ganador R32-6', '2026-07-11 20:00:00+00', 'round_of_16', NULL, 'SoFi Stadium, Los Ángeles'),
('Ganador R32-7', 'Ganador R32-8', '2026-07-11 23:00:00+00', 'round_of_16', NULL, 'Rose Bowl, Pasadena'),
('Ganador R32-9',  'Ganador R32-10', '2026-07-12 20:00:00+00', 'round_of_16', NULL, 'Hard Rock Stadium, Miami'),
('Ganador R32-11', 'Ganador R32-12', '2026-07-12 23:00:00+00', 'round_of_16', NULL, 'Estadio Azteca, Ciudad de México'),
('Ganador R32-13', 'Ganador R32-14', '2026-07-13 20:00:00+00', 'round_of_16', NULL, 'Allegiant Stadium, Las Vegas'),
('Ganador R32-15', 'Ganador R32-16', '2026-07-13 23:00:00+00', 'round_of_16', NULL, 'Lincoln Financial Field, Filadelfia'),

-- ══════════════════════════════════════════
-- CUARTOS DE FINAL (4 partidos)
-- ══════════════════════════════════════════
('Ganador OC-1', 'Ganador OC-2', '2026-07-15 20:00:00+00', 'quarterfinal', NULL, 'MetLife Stadium, Nueva Jersey'),
('Ganador OC-3', 'Ganador OC-4', '2026-07-15 23:00:00+00', 'quarterfinal', NULL, 'AT&T Stadium, Arlington'),
('Ganador OC-5', 'Ganador OC-6', '2026-07-16 20:00:00+00', 'quarterfinal', NULL, 'Rose Bowl, Pasadena'),
('Ganador OC-7', 'Ganador OC-8', '2026-07-16 23:00:00+00', 'quarterfinal', NULL, 'SoFi Stadium, Los Ángeles'),

-- ══════════════════════════════════════════
-- SEMIFINALES (2 partidos)
-- ══════════════════════════════════════════
('Ganador CF-1', 'Ganador CF-2', '2026-07-18 20:00:00+00', 'semifinal', NULL, 'MetLife Stadium, Nueva Jersey'),
('Ganador CF-3', 'Ganador CF-4', '2026-07-19 20:00:00+00', 'semifinal', NULL, 'AT&T Stadium, Arlington'),

-- ══════════════════════════════════════════
-- TERCER PUESTO
-- ══════════════════════════════════════════
('Perdedor SF-1', 'Perdedor SF-2', '2026-07-21 20:00:00+00', 'third_place', NULL, 'Hard Rock Stadium, Miami'),

-- ══════════════════════════════════════════
-- FINAL 🏆
-- ══════════════════════════════════════════
('Ganador SF-1', 'Ganador SF-2', '2026-07-23 20:00:00+00', 'final', NULL, 'MetLife Stadium, Nueva Jersey');
