# Quiniela Mundial 2026 🏆

App de quiniela para el Mundial 2026 (USA, Canadá, México). Cada usuario hace sus pronósticos, compite con amigos en grupos privados y ve el ranking en tiempo real.

## Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Estilos:** Tailwind CSS v4
- **Backend:** Supabase (Auth, PostgreSQL, Realtime)
- **Hosting:** Vercel

## Estructura

```
src/
├── components/ui/     # Button, Input, Card, Badge, Avatar, Modal
├── components/layout/ # Layout, Navbar, BottomNav
├── features/auth/     # AuthContext, AuthPage (login/register/Google)
├── features/groups/   # Dashboard, GroupPage, modales Crear/Unirse
├── features/matches/  # MatchCard con predicción integrada
├── features/predictions/ # PredictionInput
├── features/leaderboard/ # Ranking en tiempo real
├── features/profile/  # Editar perfil
├── hooks/             # useGroups, useMatches, usePredictions, useLeaderboard
├── lib/               # supabase.ts, utils.ts, database.types.ts
└── types/             # Tipos TypeScript

supabase/
├── migrations/
│   ├── 00001_initial_schema.sql   # Tablas, triggers, funciones RPC
│   └── 00002_rls_policies.sql     # Row Level Security
└── seed.sql                        # 104 partidos del Mundial 2026
```

## Setup

### 1. Instalá dependencias

```bash
npm install
```

### 2. Configurá Supabase

1. Creá un proyecto en [supabase.com](https://supabase.com)
2. Ejecutá en el **SQL Editor** en este orden:
   ```
   supabase/migrations/00001_initial_schema.sql
   supabase/migrations/00002_rls_policies.sql
   supabase/seed.sql
   ```
3. Para Google OAuth: **Authentication → Providers → Google** → activar

### 3. Variables de entorno

Creá `.env.local` en la raíz:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-anon-key
```

Las claves están en **Settings → API** de tu proyecto Supabase.

### 4. Desarrollo

```bash
npm run dev
```

## Deploy en Vercel

1. Subí a GitHub
2. Importá en [vercel.com](https://vercel.com)
3. Agregá `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en Settings → Environment Variables
4. Deploy automático en cada push

## Sistema de puntuación

| Resultado | Puntos |
|-----------|--------|
| Marcador exacto | **3 pts** |
| Ganador/empate correcto | **1 pt** |
| Incorrecto | **0 pts** |

La puntuación se calcula automáticamente via trigger de PostgreSQL cuando el admin marca un partido como finalizado (`is_finished = true`) con los goles reales.

## Ingresar resultados (Admin)

Desde el **Table Editor de Supabase** → tabla `matches`:
- Actualizá `home_score` y `away_score`
- Cambiá `is_finished` a `true`

El trigger `match_finished_trigger` calcula los puntos de todas las predicciones automáticamente.

## Datos

El seed incluye **104 partidos**:
- 72 de fase de grupos (grupos A–L)
- 16 Ronda de 32
- 8 Octavos de Final
- 4 Cuartos de Final
- 2 Semifinales + 3er puesto + Final

Los partidos de eliminatorias tienen equipos genéricos ("Ganador Grupo A") que se actualizan a medida que avanza el torneo.
