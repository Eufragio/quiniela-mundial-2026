-- ============================================================
-- Mundial 2026 Quiniela — Schema inicial
-- ============================================================

-- Extensiones
create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────
-- PROFILES
-- Se crea automáticamente al registrarse un usuario
-- ─────────────────────────────────────────────
create table public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  username   text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Índice para búsqueda de username
create unique index profiles_username_idx on public.profiles(lower(username));

-- Trigger: crear perfil automáticamente al hacer signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'username',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────
-- GROUPS (Quinielas)
-- ─────────────────────────────────────────────
create table public.groups (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  invite_code text not null unique default upper(substring(gen_random_uuid()::text from 1 for 6)),
  created_by  uuid not null references public.profiles(id) on delete cascade,
  created_at  timestamptz not null default now()
);

create index groups_invite_code_idx on public.groups(invite_code);
create index groups_created_by_idx  on public.groups(created_by);

-- ─────────────────────────────────────────────
-- GROUP MEMBERS
-- ─────────────────────────────────────────────
create table public.group_members (
  id        uuid primary key default gen_random_uuid(),
  group_id  uuid not null references public.groups(id) on delete cascade,
  user_id   uuid not null references public.profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  unique(group_id, user_id)
);

create index group_members_group_idx on public.group_members(group_id);
create index group_members_user_idx  on public.group_members(user_id);

-- ─────────────────────────────────────────────
-- MATCHES
-- ─────────────────────────────────────────────
create type public.match_phase as enum (
  'group_stage',
  'round_of_32',
  'round_of_16',
  'quarterfinal',
  'semifinal',
  'third_place',
  'final'
);

create table public.matches (
  id         uuid primary key default gen_random_uuid(),
  home_team  text not null,
  away_team  text not null,
  match_date timestamptz not null,
  phase      public.match_phase not null default 'group_stage',
  group_name text,                    -- A-L para fase de grupos
  home_score integer,
  away_score integer,
  is_finished boolean not null default false,
  venue      text,
  created_at timestamptz not null default now(),
  constraint valid_scores check (
    (home_score is null and away_score is null) or
    (home_score >= 0 and away_score >= 0)
  )
);

create index matches_date_idx    on public.matches(match_date);
create index matches_phase_idx   on public.matches(phase);
create index matches_group_idx   on public.matches(group_name);
create index matches_finished_idx on public.matches(is_finished);

-- ─────────────────────────────────────────────
-- PREDICTIONS
-- ─────────────────────────────────────────────
create table public.predictions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  match_id   uuid not null references public.matches(id) on delete cascade,
  group_id   uuid not null references public.groups(id) on delete cascade,
  home_score integer not null,
  away_score integer not null,
  points     integer,                 -- null hasta que el partido finalice
  created_at timestamptz not null default now(),
  unique(user_id, match_id, group_id),
  constraint valid_prediction_scores check (home_score >= 0 and away_score >= 0)
);

create index predictions_user_idx    on public.predictions(user_id);
create index predictions_match_idx   on public.predictions(match_id);
create index predictions_group_idx   on public.predictions(group_id);
create index predictions_user_group  on public.predictions(user_id, group_id);

-- ─────────────────────────────────────────────
-- FUNCIÓN: Calcular puntos de predicciones
-- Se ejecuta cuando un partido se marca como finalizado
-- ─────────────────────────────────────────────
create or replace function public.calculate_prediction_points(p_match_id uuid)
returns void language plpgsql security definer
as $$
declare
  v_home_score integer;
  v_away_score integer;
  v_points     integer;
begin
  select home_score, away_score
  into v_home_score, v_away_score
  from public.matches
  where id = p_match_id and is_finished = true;

  if not found then
    raise exception 'Match not found or not finished';
  end if;

  update public.predictions p
  set points = (
    case
      -- Resultado exacto
      when p.home_score = v_home_score and p.away_score = v_away_score then 3
      -- Resultado correcto (ganador o empate)
      when sign(p.home_score - p.away_score) = sign(v_home_score - v_away_score) then 1
      -- Incorrecto
      else 0
    end
  )
  where p.match_id = p_match_id;
end;
$$;

-- Trigger: calcular puntos automáticamente cuando is_finished = true
create or replace function public.on_match_finished()
returns trigger language plpgsql security definer
as $$
begin
  if new.is_finished = true and (old.is_finished = false or old.is_finished is null) then
    if new.home_score is not null and new.away_score is not null then
      perform public.calculate_prediction_points(new.id);
    end if;
  end if;
  return new;
end;
$$;

create trigger match_finished_trigger
  after update on public.matches
  for each row execute procedure public.on_match_finished();

-- ─────────────────────────────────────────────
-- FUNCIÓN: Tabla de posiciones de una quiniela
-- ─────────────────────────────────────────────
create or replace function public.get_leaderboard(p_group_id uuid)
returns table (
  user_id          uuid,
  username         text,
  avatar_url       text,
  total_points     bigint,
  exact_results    bigint,
  correct_results  bigint,
  total_predictions bigint
)
language sql stable security definer
as $$
  select
    pr.id                                              as user_id,
    pr.username,
    pr.avatar_url,
    coalesce(sum(p.points), 0)                        as total_points,
    count(*) filter (where p.points = 3)              as exact_results,
    count(*) filter (where p.points = 1)              as correct_results,
    count(*) filter (where p.points is not null)      as total_predictions
  from public.group_members gm
  join public.profiles pr on pr.id = gm.user_id
  left join public.predictions p on p.user_id = gm.user_id and p.group_id = p_group_id
  where gm.group_id = p_group_id
  group by pr.id, pr.username, pr.avatar_url
  order by total_points desc, exact_results desc, correct_results desc;
$$;
