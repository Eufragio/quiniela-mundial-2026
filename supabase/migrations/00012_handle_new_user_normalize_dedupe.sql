-- ============================================================
-- 00012 — handle_new_user: normalización + dedupe de username
-- ============================================================
-- Mejora el trigger de signup para soportar Google OAuth (y otros
-- providers sin username explícito). Cambios respecto a la versión
-- original en 00001:
--
-- 1) Normalización: si el username sale del email (caso OAuth),
--    se reemplazan caracteres no [a-zA-Z0-9_] por '_' para evitar
--    valores con '.', '+', '-' que el regex del frontend rechaza.
--
-- 2) Dedupe: el índice profiles_username_idx exige username único
--    (case-insensitive). Si dos emails distintos derivan al mismo
--    base (juan@gmail.com y juan@yahoo.com → ambos "juan"), el
--    segundo signup fallaba con violación de UNIQUE. Ahora intenta
--    base, base2, base3, ... hasta encontrar uno libre.
--
-- 3) Fallback final: si el username queda vacío post-normalización
--    (mail muy raro), se genera 'user_' + primeros 8 chars del uuid.
-- ============================================================

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  v_base text;
  v_candidate text;
  v_counter integer := 1;
begin
  -- 1) Determinar la base del username
  v_base := coalesce(
    new.raw_user_meta_data->>'username',
    split_part(new.email, '@', 1)
  );

  -- 2) Normalizar (solo si no vino explícito; si vino vía form, ya
  --    pasó la validación del frontend y respetamos como fue tipeado)
  if new.raw_user_meta_data->>'username' is null then
    v_base := regexp_replace(v_base, '[^a-zA-Z0-9_]', '_', 'g');
  end if;

  -- 3) Fallback si quedó vacío
  if v_base is null or length(v_base) = 0 then
    v_base := 'user_' || substring(new.id::text from 1 for 8);
  end if;

  -- 4) Buscar un username libre — intenta base, base2, base3, ...
  v_candidate := v_base;
  while exists (
    select 1 from public.profiles where lower(username) = lower(v_candidate)
  ) loop
    v_counter := v_counter + 1;
    v_candidate := v_base || v_counter::text;
  end loop;

  -- 5) Insertar el profile
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    v_candidate,
    coalesce(
      new.raw_user_meta_data->>'avatar_url',
      new.raw_user_meta_data->>'picture'
    )
  );

  return new;
end;
$$;
