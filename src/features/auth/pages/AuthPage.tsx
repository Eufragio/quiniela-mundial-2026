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

      </div>
    </div>
  )
}
