# Contexto de sesión — 2026-04-30

## Qué hicimos en esta sesión

Construimos el proyecto **desde cero**. Al iniciar la sesión no existía ningún archivo.

### 1. Scaffolding del proyecto
```bash
npm create vite@latest quiniela-mundial-2026 -- --template react-ts
```
Luego instalamos todas las dependencias en una sola pasada.

### 2. Configuración
- `vite.config.ts`: agregamos `@tailwindcss/vite` plugin + alias `@/ → src/`
- `tsconfig.app.json`: agregamos `baseUrl` y `paths` para el alias `@/*`
- `src/index.css`: reemplazamos el CSS default de Vite con `@import "tailwindcss"` + tema oscuro custom

### 3. Base de datos Supabase (SQL completo listo para ejecutar)

**`supabase/migrations/00001_initial_schema.sql`** — contiene:
- Tabla `profiles` + trigger `on_auth_user_created` (crea perfil al registrarse)
- Tabla `groups` con invite_code auto-generado
- Tabla `group_members`
- Tabla `matches` con enum `match_phase`
- Tabla `predictions`
- Función `calculate_prediction_points()` + trigger `match_finished_trigger`
- Función RPC `get_leaderboard()`

**`supabase/migrations/00002_rls_policies.sql`** — contiene:
- RLS en las 5 tablas
- `alter publication supabase_realtime add table predictions/matches`

**`supabase/seed.sql`** — contiene:
- 72 partidos de fase de grupos (grupos A–L, 3 jornadas cada uno, fechas reales junio 2026)
- 32 partidos de eliminatorias (con equipos genéricos "Ganador Grupo X" a actualizar)
- Total: **104 partidos**

### 4. Código frontend (todo implementado)

| Archivo | Estado |
|---------|--------|
| `src/types/index.ts` | ✅ Completo |
| `src/lib/database.types.ts` | ✅ Completo |
| `src/lib/supabase.ts` | ✅ Completo |
| `src/lib/utils.ts` | ✅ Completo (cn, formatDate, getFlagEmoji, calcPredictionPoints, etc.) |
| `src/components/ui/*` | ✅ Button, Input, Card, Badge, Avatar, Modal |
| `src/components/layout/*` | ✅ Layout, Navbar, BottomNav |
| `src/features/auth/AuthContext.tsx` | ✅ Completo |
| `src/features/auth/pages/AuthPage.tsx` | ✅ Login + Register + Google OAuth |
| `src/features/groups/pages/DashboardPage.tsx` | ✅ Completo |
| `src/features/groups/pages/GroupPage.tsx` | ✅ Completo |
| `src/features/groups/components/CreateGroupModal.tsx` | ✅ Completo |
| `src/features/groups/components/JoinGroupModal.tsx` | ✅ Completo |
| `src/features/matches/components/MatchCard.tsx` | ✅ Completo |
| `src/features/predictions/components/PredictionInput.tsx` | ✅ Completo |
| `src/features/leaderboard/pages/LeaderboardPage.tsx` | ✅ Completo con Realtime |
| `src/features/profile/pages/ProfilePage.tsx` | ✅ Completo |
| `src/hooks/useGroups.ts` | ✅ Completo |
| `src/hooks/useMatches.ts` | ✅ Completo |
| `src/hooks/usePredictions.ts` | ✅ Completo |
| `src/hooks/useLeaderboard.ts` | ✅ Con Realtime |
| `src/App.tsx` | ✅ Routing completo |
| `src/main.tsx` | ✅ Completo |

**TypeScript type check: PASA (`tsc --noEmit` → exit 0)**

---

## Decisiones tomadas

| Decisión | Razón |
|----------|-------|
| Tailwind v4 (no v3) | Es la versión actual, sin `tailwind.config.js` |
| TanStack Query para server state | Caché automático, invalidación, loading states |
| Puntos calculados por trigger SQL | Garantiza consistencia, no depende del frontend |
| RLS en la policy de insert de predicciones | Seguridad real: no se puede predecir un partido ya empezado aunque hackees el frontend |
| Tema 100% oscuro | Mobile-first, mejor en pantalla del celular |
| invite_code de 6 chars en mayúsculas | Fácil de dictar por voz o WhatsApp |

---

## Problema pendiente INMEDIATO — Lo que el usuario necesita hacer ahora

### Estado actual del usuario

El usuario está en el proceso de configurar Supabase. **Aún NO ejecutó las migraciones ni el seed**. La sesión terminó justo cuando estaba creando el `.env.local`.

### Tarea pendiente: Configurar Supabase y levantar la app

**Paso 1: Crear `.env.local`** (el usuario ya lo está haciendo)

Crear el archivo `C:\MAEA DEV\quiniela-mundial-2026\.env.local` con:
```
VITE_SUPABASE_URL=https://SU-PROYECTO-REAL.supabase.co
VITE_SUPABASE_ANON_KEY=su-anon-key-real
```
Las claves están en Supabase → Settings → API.

> ⚠️ El usuario guardó los valores placeholder literales (`https://tu-proyecto.supabase.co`) en lugar de los reales. Hay que corregirlo.

**Paso 2: Ejecutar migraciones en Supabase**

Ir a Supabase → SQL Editor → ejecutar en este orden exacto:
1. Copiar y ejecutar todo el contenido de `supabase/migrations/00001_initial_schema.sql`
2. Copiar y ejecutar todo el contenido de `supabase/migrations/00002_rls_policies.sql`
3. Copiar y ejecutar todo el contenido de `supabase/seed.sql`

**Paso 3: (Opcional) Activar Google OAuth**

Supabase → Authentication → Providers → Google → Activar → agregar Client ID y Secret de Google Cloud Console.

**Paso 4: Levantar la app**

```bash
cd "C:\MAEA DEV\quiniela-mundial-2026"
npm run dev
```

Abrir `http://localhost:5173`

---

## Próximas features a implementar (en orden de prioridad)

1. **Panel de admin** para ingresar resultados desde la app (sin ir a Supabase)
   - Agregar tabla `group_admins` o usar `groups.created_by`
   - Mostrar formulario en `GroupPage` si el usuario es admin del grupo
   - Llamar a Supabase para actualizar `home_score`, `away_score`, `is_finished`

2. **Vista de predicciones de todos los participantes**
   - En `MatchCard`: expandir para ver los pronósticos de cada miembro (visible solo después de que empiece el partido)
   - Ya existe el hook `useAllGroupPredictions` — solo falta el UI

3. **Compartir por link directo**
   - Ruta `/join/:code` que auto-une al usuario con ese código
   - Agregar en `App.tsx` y en `JoinGroupModal`

4. **Deploy en Vercel**
   - Subir repo a GitHub
   - Importar en vercel.com
   - Agregar env vars `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`

---

## Aviso para usar en la nueva sesión

Copiá esto exactamente en el primer mensaje de la nueva sesión:

---

Retomamos el proyecto **Quiniela Mundial 2026**.

**Ruta del proyecto:** `C:\MAEA DEV\quiniela-mundial-2026`

**Leé primero:** `CLAUDE.md` (contexto permanente) y `CONTEXTO_SESION.md` (estado actual).

**Resumen rápido:** La semana pasada construimos toda la app desde cero — React + TypeScript + Vite + Tailwind v4 + Supabase. El código está completo y pasa el type check. El usuario está en el proceso de configurar Supabase (ejecutar las migraciones SQL y el seed de 104 partidos).

**Tarea inmediata:** [describí lo que querés hacer en esta sesión, por ejemplo: "Ayudame a ejecutar las migraciones y levantar la app" o "Quiero construir el panel de admin para ingresar resultados"]

---
