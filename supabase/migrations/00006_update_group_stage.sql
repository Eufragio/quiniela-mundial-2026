-- ============================================================
-- Actualización: 72 partidos REALES de fase de grupos del Mundial 2026
-- ============================================================
-- Fuente: Wikipedia oficial de cada grupo + FIFA.com (confirmado al 2026-05-13)
-- Sorteo: 5 dic 2025 + UEFA playoffs (31 mar 2026) + Inter-Confederation
--
-- Cambio crítico: el seed original (sesión 2026-04-29) usó equipos FICTICIOS
-- como placeholder. Esta migration los reemplaza con los datos oficiales.
--
-- Borra las predicciones existentes en partidos de fase de grupos (ON DELETE
-- CASCADE en predictions.match_id). Si tenés predicciones reales, salvalas
-- ANTES de correr este script.
-- ============================================================

-- 1) Borrar matches de fase de grupos (cascade borra predicciones)
delete from public.matches where phase = 'group_stage';

-- 2) Insertar los 72 partidos oficiales
insert into public.matches (home_team, away_team, match_date, phase, group_name, venue) values

-- GRUPO A — Mexico · South Africa · South Korea · Czech Republic
('Mexico',         'South Africa',    '2026-06-11 19:00:00+00', 'group_stage', 'A', 'Estadio Azteca, Ciudad de México'),
('South Korea',    'Czech Republic',  '2026-06-12 02:00:00+00', 'group_stage', 'A', 'Estadio Akron, Zapopan'),
('Czech Republic', 'South Africa',    '2026-06-18 16:00:00+00', 'group_stage', 'A', 'Mercedes-Benz Stadium, Atlanta'),
('Mexico',         'South Korea',     '2026-06-19 01:00:00+00', 'group_stage', 'A', 'Estadio Akron, Zapopan'),
('Czech Republic', 'Mexico',          '2026-06-25 01:00:00+00', 'group_stage', 'A', 'Estadio Azteca, Ciudad de México'),
('South Africa',   'South Korea',     '2026-06-25 01:00:00+00', 'group_stage', 'A', 'Estadio BBVA, Guadalupe'),

-- GRUPO B — Canada · Bosnia and Herzegovina · Qatar · Switzerland
('Canada',                 'Bosnia and Herzegovina', '2026-06-12 19:00:00+00', 'group_stage', 'B', 'BMO Field, Toronto'),
('Qatar',                  'Switzerland',            '2026-06-13 19:00:00+00', 'group_stage', 'B', 'Levi''s Stadium, Santa Clara'),
('Switzerland',            'Bosnia and Herzegovina', '2026-06-18 19:00:00+00', 'group_stage', 'B', 'SoFi Stadium, Inglewood'),
('Canada',                 'Qatar',                  '2026-06-18 22:00:00+00', 'group_stage', 'B', 'BC Place, Vancouver'),
('Switzerland',            'Canada',                 '2026-06-24 19:00:00+00', 'group_stage', 'B', 'BC Place, Vancouver'),
('Bosnia and Herzegovina', 'Qatar',                  '2026-06-24 19:00:00+00', 'group_stage', 'B', 'Lumen Field, Seattle'),

-- GRUPO C — Brazil · Morocco · Haiti · Scotland
('Brazil',   'Morocco',  '2026-06-13 22:00:00+00', 'group_stage', 'C', 'MetLife Stadium, East Rutherford'),
('Haiti',    'Scotland', '2026-06-14 01:00:00+00', 'group_stage', 'C', 'Gillette Stadium, Foxborough'),
('Scotland', 'Morocco',  '2026-06-19 22:00:00+00', 'group_stage', 'C', 'Gillette Stadium, Foxborough'),
('Brazil',   'Haiti',    '2026-06-20 00:30:00+00', 'group_stage', 'C', 'Lincoln Financial Field, Philadelphia'),
('Scotland', 'Brazil',   '2026-06-24 22:00:00+00', 'group_stage', 'C', 'Hard Rock Stadium, Miami Gardens'),
('Morocco',  'Haiti',    '2026-06-24 22:00:00+00', 'group_stage', 'C', 'Mercedes-Benz Stadium, Atlanta'),

-- GRUPO D — USA · Paraguay · Australia · Turkey
('USA',       'Paraguay',  '2026-06-13 01:00:00+00', 'group_stage', 'D', 'SoFi Stadium, Inglewood'),
('Australia', 'Turkey',    '2026-06-14 04:00:00+00', 'group_stage', 'D', 'BC Place, Vancouver'),
('USA',       'Australia', '2026-06-19 19:00:00+00', 'group_stage', 'D', 'Lumen Field, Seattle'),
('Turkey',    'Paraguay',  '2026-06-20 03:00:00+00', 'group_stage', 'D', 'Levi''s Stadium, Santa Clara'),
('Turkey',    'USA',       '2026-06-26 02:00:00+00', 'group_stage', 'D', 'SoFi Stadium, Inglewood'),
('Paraguay',  'Australia', '2026-06-26 02:00:00+00', 'group_stage', 'D', 'Levi''s Stadium, Santa Clara'),

-- GRUPO E — Germany · Curaçao · Ivory Coast · Ecuador
('Germany',     'Curaçao',     '2026-06-14 17:00:00+00', 'group_stage', 'E', 'NRG Stadium, Houston'),
('Ivory Coast', 'Ecuador',     '2026-06-14 23:00:00+00', 'group_stage', 'E', 'Lincoln Financial Field, Philadelphia'),
('Germany',     'Ivory Coast', '2026-06-20 20:00:00+00', 'group_stage', 'E', 'BMO Field, Toronto'),
('Ecuador',     'Curaçao',     '2026-06-21 00:00:00+00', 'group_stage', 'E', 'Arrowhead Stadium, Kansas City'),
('Curaçao',     'Ivory Coast', '2026-06-25 20:00:00+00', 'group_stage', 'E', 'Lincoln Financial Field, Philadelphia'),
('Ecuador',     'Germany',     '2026-06-25 20:00:00+00', 'group_stage', 'E', 'MetLife Stadium, East Rutherford'),

-- GRUPO F — Netherlands · Japan · Sweden · Tunisia
('Netherlands', 'Japan',       '2026-06-14 20:00:00+00', 'group_stage', 'F', 'AT&T Stadium, Arlington'),
('Sweden',      'Tunisia',     '2026-06-15 02:00:00+00', 'group_stage', 'F', 'Estadio BBVA, Guadalupe'),
('Netherlands', 'Sweden',      '2026-06-20 17:00:00+00', 'group_stage', 'F', 'NRG Stadium, Houston'),
('Tunisia',     'Japan',       '2026-06-21 04:00:00+00', 'group_stage', 'F', 'Estadio BBVA, Guadalupe'),
('Japan',       'Sweden',      '2026-06-25 23:00:00+00', 'group_stage', 'F', 'AT&T Stadium, Arlington'),
('Tunisia',     'Netherlands', '2026-06-25 23:00:00+00', 'group_stage', 'F', 'Arrowhead Stadium, Kansas City'),

-- GRUPO G — Belgium · Egypt · Iran · New Zealand
('Belgium',     'Egypt',       '2026-06-15 19:00:00+00', 'group_stage', 'G', 'Lumen Field, Seattle'),
('Iran',        'New Zealand', '2026-06-16 01:00:00+00', 'group_stage', 'G', 'SoFi Stadium, Inglewood'),
('Belgium',     'Iran',        '2026-06-21 19:00:00+00', 'group_stage', 'G', 'SoFi Stadium, Inglewood'),
('New Zealand', 'Egypt',       '2026-06-22 01:00:00+00', 'group_stage', 'G', 'BC Place, Vancouver'),
('Egypt',       'Iran',        '2026-06-27 03:00:00+00', 'group_stage', 'G', 'Lumen Field, Seattle'),
('New Zealand', 'Belgium',     '2026-06-27 03:00:00+00', 'group_stage', 'G', 'BC Place, Vancouver'),

-- GRUPO H — Spain · Cabo Verde · Saudi Arabia · Uruguay
('Spain',        'Cabo Verde',   '2026-06-15 16:00:00+00', 'group_stage', 'H', 'Mercedes-Benz Stadium, Atlanta'),
('Saudi Arabia', 'Uruguay',      '2026-06-15 22:00:00+00', 'group_stage', 'H', 'Hard Rock Stadium, Miami Gardens'),
('Spain',        'Saudi Arabia', '2026-06-21 16:00:00+00', 'group_stage', 'H', 'Mercedes-Benz Stadium, Atlanta'),
('Uruguay',      'Cabo Verde',   '2026-06-21 22:00:00+00', 'group_stage', 'H', 'Hard Rock Stadium, Miami Gardens'),
('Cabo Verde',   'Saudi Arabia', '2026-06-27 00:00:00+00', 'group_stage', 'H', 'NRG Stadium, Houston'),
('Uruguay',      'Spain',        '2026-06-27 00:00:00+00', 'group_stage', 'H', 'Estadio Akron, Zapopan'),

-- GRUPO I — France · Senegal · Norway · Iraq
('France',  'Senegal', '2026-06-16 19:00:00+00', 'group_stage', 'I', 'MetLife Stadium, East Rutherford'),
('Iraq',    'Norway',  '2026-06-16 22:00:00+00', 'group_stage', 'I', 'Gillette Stadium, Foxborough'),
('France',  'Iraq',    '2026-06-22 21:00:00+00', 'group_stage', 'I', 'Lincoln Financial Field, Philadelphia'),
('Norway',  'Senegal', '2026-06-23 00:00:00+00', 'group_stage', 'I', 'MetLife Stadium, East Rutherford'),
('Norway',  'France',  '2026-06-26 19:00:00+00', 'group_stage', 'I', 'Gillette Stadium, Foxborough'),
('Senegal', 'Iraq',    '2026-06-26 19:00:00+00', 'group_stage', 'I', 'BMO Field, Toronto'),

-- GRUPO J — Argentina · Algeria · Austria · Jordan
('Argentina', 'Algeria',   '2026-06-17 01:00:00+00', 'group_stage', 'J', 'Arrowhead Stadium, Kansas City'),
('Austria',   'Jordan',    '2026-06-17 04:00:00+00', 'group_stage', 'J', 'Levi''s Stadium, Santa Clara'),
('Argentina', 'Austria',   '2026-06-22 17:00:00+00', 'group_stage', 'J', 'AT&T Stadium, Arlington'),
('Jordan',    'Algeria',   '2026-06-23 03:00:00+00', 'group_stage', 'J', 'Levi''s Stadium, Santa Clara'),
('Algeria',   'Austria',   '2026-06-28 02:00:00+00', 'group_stage', 'J', 'Arrowhead Stadium, Kansas City'),
('Jordan',    'Argentina', '2026-06-28 02:00:00+00', 'group_stage', 'J', 'AT&T Stadium, Arlington'),

-- GRUPO K — Portugal · Uzbekistan · Colombia · Congo DR
('Portugal',   'Congo DR',    '2026-06-17 17:00:00+00', 'group_stage', 'K', 'NRG Stadium, Houston'),
('Uzbekistan', 'Colombia',    '2026-06-18 02:00:00+00', 'group_stage', 'K', 'Estadio Azteca, Ciudad de México'),
('Portugal',   'Uzbekistan',  '2026-06-23 17:00:00+00', 'group_stage', 'K', 'NRG Stadium, Houston'),
('Colombia',   'Congo DR',    '2026-06-24 02:00:00+00', 'group_stage', 'K', 'Estadio Akron, Zapopan'),
('Colombia',   'Portugal',    '2026-06-27 23:30:00+00', 'group_stage', 'K', 'Hard Rock Stadium, Miami Gardens'),
('Congo DR',   'Uzbekistan',  '2026-06-27 23:30:00+00', 'group_stage', 'K', 'Mercedes-Benz Stadium, Atlanta'),

-- GRUPO L — England · Croatia · Ghana · Panama
('England', 'Croatia', '2026-06-17 20:00:00+00', 'group_stage', 'L', 'AT&T Stadium, Arlington'),
('Ghana',   'Panama',  '2026-06-17 23:00:00+00', 'group_stage', 'L', 'BMO Field, Toronto'),
('England', 'Ghana',   '2026-06-23 20:00:00+00', 'group_stage', 'L', 'Gillette Stadium, Foxborough'),
('Panama',  'Croatia', '2026-06-23 23:00:00+00', 'group_stage', 'L', 'BMO Field, Toronto'),
('Panama',  'England', '2026-06-27 21:00:00+00', 'group_stage', 'L', 'MetLife Stadium, East Rutherford'),
('Croatia', 'Ghana',   '2026-06-27 21:00:00+00', 'group_stage', 'L', 'Lincoln Financial Field, Philadelphia');
