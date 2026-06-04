import { useState, useMemo } from 'react'
import { Navigate, useLocation, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Trophy, Mail, ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'
import { useAuthContext } from '../AuthContext'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import type { AuthView } from '@/types'

function getSafeNext(search: string): string {
  const next = new URLSearchParams(search).get('next')
  if (!next) return '/dashboard'
  if (!next.startsWith('/') || next.startsWith('//')) return '/dashboard'
  return next
}

export function AuthPage() {
  const { session, loading } = useAuthContext()
  const location = useLocation()
  const { t } = useTranslation()
  const [view, setView] = useState<AuthView>('login')
  const [serverError, setServerError] = useState<string | null>(null)
  const [emailSent, setEmailSent] = useState<string | null>(null)

  const loginSchema = useMemo(
    () =>
      z.object({
        email: z.string().email(t('auth.errors.invalidEmail')),
        password: z.string().min(6, t('auth.errors.passwordMin')),
      }),
    [t],
  )

  const registerSchema = useMemo(
    () =>
      loginSchema.extend({
        username: z
          .string()
          .min(3, t('auth.errors.usernameMin'))
          .max(20, t('auth.errors.usernameMax'))
          .regex(/^[a-zA-Z0-9_]+$/, t('auth.errors.usernamePattern')),
      }),
    [loginSchema, t],
  )

  type LoginForm = z.infer<typeof loginSchema>
  type RegisterForm = z.infer<typeof registerSchema>

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })
  const registerForm = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) })

  const [oauthLoading, setOauthLoading] = useState(false)

  if (loading) return null
  if (session) return <Navigate to={getSafeNext(location.search)} replace />

  async function handleGoogleSignIn() {
    setServerError(null)
    setOauthLoading(true)
    const next = getSafeNext(location.search)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${next}`,
      },
    })
    if (error) {
      setServerError(t('auth.errors.oauthFailed'))
      setOauthLoading(false)
    }
  }

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
    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { username: data.username } },
    })
    if (error) {
      setServerError(error.message)
      return
    }
    if (!signUpData.session) {
      setEmailSent(data.email)
      registerForm.reset()
    }
  }

  if (emailSent) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#0a0a0e] p-4">
        <div className="absolute right-4 top-4">
          <LanguageSwitcher />
        </div>
        <div className="w-full max-w-sm rounded-2xl border border-[#2a2a38] bg-[#111117] p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
            <Mail size={28} />
          </div>
          <h1 className="mb-2 text-lg font-semibold text-gray-100">{t('auth.checkEmailTitle')}</h1>
          <p className="mb-1 text-sm text-gray-400">{t('auth.checkEmailIntro')}</p>
          <p className="mb-5 break-all font-mono text-sm text-green-400">{emailSent}</p>
          <p className="mb-6 text-xs text-gray-500">{t('auth.checkEmailHelp')}</p>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => {
              setEmailSent(null)
              setView('login')
              setServerError(null)
            }}
          >
            <ArrowLeft size={16} />
            {t('common.back')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#0a0a0e] p-4">
      <div className="absolute right-4 top-4">
        <LanguageSwitcher />
      </div>
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 shadow-lg shadow-green-500/30">
          <Trophy size={32} className="text-white" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-100">{t('app.title')}</h1>
          <p className="mt-1 text-sm text-gray-500">{t('app.tagline')}</p>
        </div>
      </div>

      <div className="w-full max-w-sm rounded-2xl border border-[#2a2a38] bg-[#111117] p-6">
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
              {t(`auth.${v}`)}
            </button>
          ))}
        </div>

        {serverError && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {serverError}
          </div>
        )}

        <Button
          type="button"
          variant="secondary"
          fullWidth
          onClick={handleGoogleSignIn}
          loading={oauthLoading}
          className="mb-4"
        >
          <GoogleIcon />
          {t('auth.continueWithGoogle')}
        </Button>

        <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-wider text-gray-600">
          <div className="h-px flex-1 bg-[#2a2a38]" />
          <span>{t('auth.orSeparator')}</span>
          <div className="h-px flex-1 bg-[#2a2a38]" />
        </div>

        {view === 'login' ? (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="flex flex-col gap-4">
            <Input
              label={t('auth.email')}
              type="email"
              placeholder={t('auth.emailPlaceholder')}
              error={loginForm.formState.errors.email?.message}
              {...loginForm.register('email')}
            />
            <Input
              label={t('auth.password')}
              type="password"
              placeholder={t('auth.passwordPlaceholder')}
              error={loginForm.formState.errors.password?.message}
              {...loginForm.register('password')}
            />
            <Button
              type="submit"
              fullWidth
              loading={loginForm.formState.isSubmitting}
            >
              {t('auth.enter')}
            </Button>
          </form>
        ) : (
          <form onSubmit={registerForm.handleSubmit(handleRegister)} className="flex flex-col gap-4">
            <Input
              label={t('auth.username')}
              placeholder={t('auth.usernamePlaceholder')}
              error={registerForm.formState.errors.username?.message}
              {...registerForm.register('username')}
            />
            <Input
              label={t('auth.email')}
              type="email"
              placeholder={t('auth.emailPlaceholder')}
              error={registerForm.formState.errors.email?.message}
              {...registerForm.register('email')}
            />
            <Input
              label={t('auth.password')}
              type="password"
              placeholder={t('auth.passwordPlaceholder')}
              error={registerForm.formState.errors.password?.message}
              {...registerForm.register('password')}
            />
            <Button
              type="submit"
              fullWidth
              loading={registerForm.formState.isSubmitting}
            >
              {t('auth.createAccount')}
            </Button>
          </form>
        )}
      </div>

      <div className="mt-6 flex items-center gap-3 text-xs text-gray-600">
        <Link to="/rules" className="transition-colors hover:text-gray-400">
          {t('footer.rules')}
        </Link>
        <span className="text-gray-700">·</span>
        <Link to="/about" className="transition-colors hover:text-gray-400">
          {t('footer.about')}
        </Link>
        <span className="text-gray-700">·</span>
        <Link to="/privacy" className="transition-colors hover:text-gray-400">
          {t('auth.privacyLink')}
        </Link>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  )
}
