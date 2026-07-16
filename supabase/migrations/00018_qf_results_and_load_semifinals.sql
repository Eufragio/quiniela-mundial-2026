-- =====================================================================
-- 00018 — Resultados de cuartos + carga de semifinales, 3er puesto y final
-- =====================================================================
-- Estado al 11-jul (fuente: Wikipedia "2026 FIFA World Cup knockout stage",
-- traído vía extensión de navegador y verificado contra el bracket oficial).
--
-- CUARTOS (3 de 4 jugados; al setear is_finished el trigger
-- match_finished_trigger dispara calculate_prediction_points):
--   - CF1: France 2-0 Morocco        -> France   (ya tenía equipos reales)
--   - CF2: Norway 1-2 England        -> England  (ya tenía equipos reales)
--   - CF3: Spain 2-1 Belgium         -> Spain    (definía el cruce OC5/OC6)
--   - CF4: Argentina vs Switzerland  -> se juega 12-jul, AÚN SIN resultado.
--          Solo se cargan los equipos (venía placeholder OC7/OC8); el
--          marcador se ingresa desde /admin cuando termine.
--
-- Ningún cuarto se definió por penales -> no se toca penalty_winner
-- (convención 00015: los puntos ignoran los penales).
--
-- SEMIFINALES (bracket oficial FIFA):
--   - SF1: France vs Spain               | AT&T Stadium, Arlington        | 14-jul 19:00 UTC
--   - SF2: England vs Gan. CF4 (ARG/SUI) | Mercedes-Benz Stadium, Atlanta | 15-jul 19:00 UTC
--     (el rival de England sale de CF4, aún sin jugar -> placeholder legible)
--
-- El seed cargó semis/3er/final con fechas (18-23 jul) y sedes PLACEHOLDER
-- incorrectas. Como la app cierra las predicciones cuando match_date < now(),
-- se corrigen equipo + fecha + sede, emparejando por el placeholder original.
-- Preserva match_id (no rompe predicciones; FK on delete cascade intacto).
--
-- Fechas en UTC (la app las muestra en la zona del usuario).
-- Nombres de equipo EXACTOS al mapa de banderas (utils.ts).
-- =====================================================================

-- ---------- CUARTOS: resultados ----------

-- CF1 — France 2-0 Morocco (avanza France)
update public.matches
set home_score = 2, away_score = 0, is_finished = true
where phase = 'quarterfinal' and home_team = 'France' and away_team = 'Morocco';

-- CF2 — Norway 1-2 England (avanza England)
update public.matches
set home_score = 1, away_score = 2, is_finished = true
where phase = 'quarterfinal' and home_team = 'Norway' and away_team = 'England';

-- CF3 — Spain 2-1 Belgium (avanza Spain). Define el cruce OC5/OC6.
update public.matches
set home_team = 'Spain', away_team = 'Belgium',
    home_score = 2, away_score = 1, is_finished = true
where phase = 'quarterfinal'
  and home_team = 'Ganador OC5 (POR/ESP)' and away_team = 'Ganador OC6 (USA/BEL)';

-- CF4 — Argentina vs Switzerland (se juega 12-jul; equipos definidos, SIN marcador)
update public.matches
set home_team = 'Argentina', away_team = 'Switzerland'
where phase = 'quarterfinal'
  and home_team = 'Ganador OC7 (ARG/EGY)' and away_team = 'Ganador OC8 (SUI/COL)';

-- ---------- SEMIFINALES: equipos + fecha + sede ----------

-- SF1 — France vs Spain | AT&T Stadium, Arlington | 14-jul 19:00 UTC
update public.matches
set home_team = 'France', away_team = 'Spain',
    match_date = '2026-07-14 19:00:00+00', venue = 'AT&T Stadium, Arlington'
where phase = 'semifinal' and home_team = 'Ganador CF-1' and away_team = 'Ganador CF-2';

-- SF2 — England vs Gan. CF4 (ARG/SUI) | Mercedes-Benz Stadium, Atlanta | 15-jul 19:00 UTC
update public.matches
set home_team = 'England', away_team = 'Ganador CF4 (ARG/SUI)',
    match_date = '2026-07-15 19:00:00+00', venue = 'Mercedes-Benz Stadium, Atlanta'
where phase = 'semifinal' and home_team = 'Ganador CF-3' and away_team = 'Ganador CF-4';

-- ---------- TERCER PUESTO y FINAL: solo fecha + sede ----------
-- Los equipos salen de las semis (aún sin jugar) -> se mantienen los
-- placeholders legibles; solo se corrige el calendario.

-- Tercer puesto — Perdedor SF-1 vs Perdedor SF-2 | Hard Rock Stadium, Miami Gardens | 18-jul 21:00 UTC
update public.matches
set match_date = '2026-07-18 21:00:00+00', venue = 'Hard Rock Stadium, Miami Gardens'
where phase = 'third_place' and home_team = 'Perdedor SF-1' and away_team = 'Perdedor SF-2';

-- Final — Ganador SF-1 vs Ganador SF-2 | MetLife Stadium, East Rutherford | 19-jul 19:00 UTC
update public.matches
set match_date = '2026-07-19 19:00:00+00', venue = 'MetLife Stadium, East Rutherford'
where phase = 'final' and home_team = 'Ganador SF-1' and away_team = 'Ganador SF-2';

-- Verificación: ver cómo quedó todo el cuadro de eliminación de cuartos en adelante
select phase, home_team, away_team, home_score, away_score, is_finished, match_date, venue
from public.matches
where phase in ('quarterfinal', 'semifinal', 'third_place', 'final')
order by match_date;
