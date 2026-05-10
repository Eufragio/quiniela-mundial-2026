# Quiniela Mundial 2026 — Contexto permanente del proyecto

## Objetivo

App web de quiniela para el Mundial de Fútbol 2026 (USA, Canadá, México).
Los usuarios se registran, crean o se unen a grupos privados (quinielas), predicen los marcadores de los 104 partidos y compiten en un ranking en tiempo real.

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework UI | React 19 + TypeScript |
| Bundler | Vite 8 |
| Estilos | Tailwind CSS v4 (sin `tailwind.config.js` — configuración vía `@theme` en CSS) |
| Backend / DB | Supabase (PostgreSQL + Auth + Realtime) |
| Server state | TanStack Query v5 |
| Routing | React Router v7 |
| Formularios | React Hook Form + Zod |
| Iconos | Lucide React |
| Utilidades | clsx + tailwind-merge, date-fns |
| Hosting | Vercel (deploy automático desde GitHub) |

## Rutas de la app

| Path | Componente | Descripción |
|------|-----------|-------------|
| `/auth` | `AuthPage` | Login / Registro / Google OAuth |
| `/dashboard` | `DashboardPage` | Mis quinielas |
| `/groups/:groupId` | `GroupPage` | Partidos + predicciones + posiciones |
| `/profile` | `ProfilePage` | Editar nombre de usuario |

## Estructura de carpetas (completa)

```
C:/MAEA DEV/quiniela-mundial-2026/
├── src/
│   ├── App.tsx                          # Routing + Providers (QueryClient, Router, AuthProvider)
│   ├── main.tsx                         # Entry point
│   ├── index.css                        # Tailwind v4 import + tema oscuro
│   ├── App.css                          # Vacío (no usar)
│   ├── types/
│   │   └── index.ts                     # Todos los tipos TypeScript (Phase, Profile, Group, Match, Prediction, LeaderboardEntry...)
│   ├── lib/
│   │   ├── supabase.ts                  # createClient<Database> — cliente Supabase singleton
│   │   ├── database.types.ts            # Tipos manuales del schema de Supabase
│   │   └── utils.ts                     # cn(), formatMatchDate(), getFlagEmoji(), calcPredictionPoints(), etc.
│   ├── hooks/
│   │   ├── useGroups.ts                 # useMyGroups, useGroup, useGroupMembers, useCreateGroup, useJoinGroup
│   │   ├── useMatches.ts                # useMatches, useMatch, useAllMatchesGrouped
│   │   ├── usePredictions.ts            # useGroupPredictions, useAllGroupPredictions, useSavePrediction
│   │   └── useLeaderboard.ts            # useLeaderboard (con suscripción Realtime)
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx               # variants: primary | secondary | ghost | danger
│   │   │   ├── Input.tsx                # con label, error, helperText
│   │   │   ├── Card.tsx                 # con prop hover y padding
│   │   │   ├── Badge.tsx                # variants: default | green | red | yellow | blue | gray
│   │   │   ├── Avatar.tsx               # iniciales con gradiente verde si no hay foto
│   │   │   └── Modal.tsx                # bottom sheet en mobile, centrado en desktop
│   │   └── layout/
│   │       ├── Layout.tsx               # Navbar + <Outlet> + BottomNav
│   │       ├── Navbar.tsx               # Logo + usuario + logout
│   │       └── BottomNav.tsx            # Nav mobile fijo abajo (usa useParams para mostrar tabs del grupo)
│   └── features/
│       ├── auth/
│       │   ├── AuthContext.tsx           # Context: session, user, profile, loading, signOut, refreshProfile
│       │   └── pages/AuthPage.tsx        # Login + Register (tabs) + Google OAuth
│       ├── groups/
│       │   ├── pages/DashboardPage.tsx   # Lista de mis quinielas + botones Crear/Unirse
│       │   ├── pages/GroupPage.tsx       # Header grupo + miembros + tabs Partidos/Posiciones + filtro por fase
│       │   ├── components/CreateGroupModal.tsx
│       │   └── components/JoinGroupModal.tsx
│       ├── matches/
│       │   └── components/MatchCard.tsx  # Muestra partido, predicción del usuario, resultado, puntos
│       ├── predictions/
│       │   └── components/PredictionInput.tsx  # Selector numérico +/- para ingresar marcador
│       ├── leaderboard/
│       │   └── pages/LeaderboardPage.tsx # Ranking con Realtime + leyenda de puntuación
│       └── profile/
│           └── pages/ProfilePage.tsx     # Editar username
├── supabase/
│   ├── migrations/
│   │   ├── 00001_initial_schema.sql     # CRÍTICO: Tablas + triggers + RPC
│   │   └── 00002_rls_policies.sql       # CRÍTICO: RLS + Realtime publication
│   └── seed.sql                          # 104 partidos del Mundial 2026
├── vite.config.ts                        # @tailwindcss/vite + alias @/ → src/
├── tsconfig.app.json                     # baseUrl + paths para @/*
├── package.json
├── README.md
└── .env.local                            # NO en git — claves de Supabase (el usuario debe crearlo)
```

## Base de datos Supabase

### Tablas

| Tabla | Descripción |
|-------|-------------|
| `profiles` | Usuario (id = auth.uid, username, avatar_url) |
| `groups` | Quinielas (name, invite_code único 6 chars, created_by) |
| `group_members` | Relación usuario-quiniela |
| `matches` | 104 partidos (home_team, away_team, match_date, phase, group_name, home_score, away_score, is_finished, venue) |
| `predictions` | Pronósticos (user_id, match_id, group_id, home_score, away_score, points) |

### Tipo `match_phase` (enum PostgreSQL)
`group_stage | round_of_32 | round_of_16 | quarterfinal | semifinal | third_place | final`

### Funciones / Triggers clave

- **`on_auth_user_created`** (trigger after insert on auth.users): crea el `profile` automáticamente al registrarse
- **`match_finished_trigger`** (trigger after update on matches): cuando `is_finished` cambia a `true`, llama a `calculate_prediction_points()`
- **`calculate_prediction_points(p_match_id)`**: actualiza `points` en todas las predicciones de ese partido (3 = exacto, 1 = resultado correcto, 0 = incorrecto)
- **`get_leaderboard(p_group_id)`** (RPC): devuelve ranking con total_points, exact_results, correct_results

### RLS

Todas las tablas tienen RLS. Regla clave: predicciones solo se pueden insertar/editar si `match_date > now()` (verificado en la policy, no solo en el frontend).

### Realtime

`predictions` y `matches` están en `supabase_realtime` publication. El hook `useLeaderboard` tiene suscripción activa.

## Variables de entorno necesarias

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Archivo: `.env.local` en la raíz del proyecto (NO commitear).

## Convenciones del proyecto

- **Path alias**: `@/` apunta a `src/` — usar siempre en imports
- **Estilos**: solo clases Tailwind, sin CSS custom salvo en `index.css`
- **Colores del tema**:
  - Fondo: `#0a0a0e`
  - Surface: `#111117`, `#1a1a22`, `#22222e`
  - Border: `#2a2a38`
  - Primary (verde): `green-500` (`#22c55e`)
  - Accent (rojo): `red-500`
  - Texto muted: `gray-500`, `gray-600`
- **Server state**: todo via TanStack Query — no `useState` para datos del servidor
- **Formularios**: React Hook Form + Zod siempre, nunca formularios no controlados
- **No comentarios** en el código salvo que el WHY sea no obvio
- **Naming**: hooks en `useXxx.ts`, páginas en `XxxPage.tsx`, componentes en PascalCase

## Grupos del Mundial 2026 (seed)

```
A: USA, France, Cameroon, Japan
B: Mexico, Germany, Morocco, South Korea
C: Canada, England, Senegal, Iran
D: Brazil, Spain, Nigeria, Australia
E: Argentina, Netherlands, Egypt, Ecuador
F: Portugal, Italy, Tunisia, Saudi Arabia
G: Colombia, Croatia, Algeria, Poland
H: Uruguay, Belgium, Ghana, Turkey
I: Switzerland, Chile, South Africa, Qatar
J: Denmark, Panama, Iraq, New Zealand
K: Austria, Honduras, Jamaica, China PR
L: Serbia, Venezuela, Jordan, Scotland
```

## Comandos útiles

```bash
# Desarrollo
npm run dev

# Type check
npx tsc --noEmit

# Build
npm run build
```

## Ingresar resultados (flujo actual — sin panel de admin)

Desde **Supabase → Table Editor → matches**:
1. Editar `home_score` y `away_score`
2. Cambiar `is_finished` a `true`
3. El trigger calcula los puntos automáticamente

## Lo que FALTA implementar (próximas sesiones)

1. **Panel de admin** en la app para que el creador del grupo ingrese resultados sin ir a Supabase
2. **Notificaciones push** cuando un partido está por empezar
3. **Vista de predicciones ajenas** (ver qué predijo cada participante, visible tras el inicio del partido)
4. **Compartir por link** (además del código): `quiniela.app/join/CODIGO`
5. **Configurar Google OAuth** en Supabase (Authentication → Providers → Google)
6. **Deploy en Vercel**: subir a GitHub → importar en Vercel → agregar env vars
