import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Trophy } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthContext } from '../AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { AuthView } from '@/types'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

const registerSchema = loginSchema.extend({
  username: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(20, 'Máximo 20 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Solo letras, números y _'),
})

type LoginForm = z.infer<typeof loginSchema>
type RegisterForm = z.infer<typeof registerSchema>

export function AuthPage() {
  const { session, loading } = useAuthContext()
  const [view, setView] = useState<AuthView>('login')
  const [serverError, setServerError] = useState<string | null>(null)

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })
  const registerForm = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) })

  if (loading) return null
  if (session) return <Navigate to="/dashboard" replace />

  async function handleLogin(data: LoginForm) {
    setServerError(null)
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    if (error) setServerError(error.message)
  }

  async function handleRegister(data: RegisterForm) {
    setServerError(null)
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { username: data.username } },
    })
    if (error) setServerError(error.message)
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0e] p-4">
      {/* Hero */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 shadow-lg shadow-green-500/30">
          <Trophy size={32} className="text-white" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-100">Quiniela Mundial 2026</h1>
          <p className="mt-1 text-sm text-gray-500">
            Compite con tus amigos. Predecí los resultados.
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm rounded-2xl border border-[#2a2a38] bg-[#111117] p-6">
        {/* Tabs */}
        <div className="mb-6 flex rounded-xl bg-[#0a0a0e] p-1">
          {(['login', 'register'] as const).map((v) => (
            <button
              key={v}
              onClick={() => { setView(v); setServerError(null) }}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                view === v
                  ? 'bg-green-500 text-white shadow'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {v === 'login' ? 'Iniciar sesión' : 'Registrarse'}
            </button>
          ))}
        </div>

        {serverError && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {serverError}
          </div>
        )}

        {view === 'login' ? (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="flex flex-col gap-4">
            <Input
              label="Email"
              type="email"
              placeholder="vos@ejemplo.com"
              error={loginForm.formState.errors.email?.message}
              {...loginForm.register('email')}
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••"
              error={loginForm.formState.errors.password?.message}
              {...loginForm.register('password')}
            />
            <Button
              type="submit"
              fullWidth
              loading={loginForm.formState.isSubmitting}
            >
              Entrar
            </Button>
          </form>
        ) : (
          <form onSubmit={registerForm.handleSubmit(handleRegister)} className="flex flex-col gap-4">
            <Input
              label="Usuario"
              placeholder="tu_nombre"
              error={registerForm.formState.errors.username?.message}
              {...registerForm.register('username')}
            />
            <Input
              label="Email"
              type="email"
              placeholder="vos@ejemplo.com"
              error={registerForm.formState.errors.email?.message}
              {...registerForm.register('email')}
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••"
              error={registerForm.formState.errors.password?.message}
              {...registerForm.register('password')}
            />
            <Button
              type="submit"
              fullWidth
              loading={registerForm.formState.isSubmitting}
            >
              Crear cuenta
            </Button>
          </form>
        )}

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#2a2a38]" />
          <span className="text-xs text-gray-600">o continuá con</span>
          <div className="h-px flex-1 bg-[#2a2a38]" />
        </div>

        <Button variant="secondary" fullWidth onClick={handleGoogle} type="button">
          <svg viewBox="0 0 24 24" className="h-4 w-4">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Google
        </Button>
      </div>
    </div>
  )
}
