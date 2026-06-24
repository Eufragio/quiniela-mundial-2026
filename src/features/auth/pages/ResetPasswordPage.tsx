import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Trophy, KeyRound, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'

type Status = 'verifying' | 'ready' | 'invalid' | 'success'

export function ResetPasswordPage() {
  const { t } = useTranslation()
  const [status, setStatus] = useState<Status>('verifying')
  const [serverError, setServerError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setStatus('ready')
    })
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!active) return
      setStatus((prev) => (prev === 'ready' ? prev : session ? 'ready' : 'invalid'))
    })
    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  const schema = useMemo(
    () =>
      z
        .object({
          password: z.string().min(6, t('resetPassword.errors.passwordMin')),
          confirm: z.string(),
        })
        .refine((d) => d.password === d.confirm, {
          message: t('resetPassword.errors.passwordMismatch'),
          path: ['confirm'],
        }),
    [t],
  )

  type FormValues = z.infer<typeof schema>
  const form = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function handleSubmit(data: FormValues) {
    setServerError(null)
    const { error } = await supabase.auth.updateUser({ password: data.password })
    if (error) {
      setServerError(t('resetPassword.errors.updateFailed'))
      return
    }
    setStatus('success')
  }

  if (status === 'verifying') {
    return (
      <Shell>
        <div className="flex items-center gap-3 text-gray-400">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">{t('resetPassword.verifying')}</span>
        </div>
      </Shell>
    )
  }

  if (status === 'invalid') {
    return (
      <Shell>
        <div className="w-full max-w-sm rounded-2xl border border-[#2a2a38] bg-[#111117] p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
            <AlertCircle size={28} />
          </div>
          <h1 className="mb-2 text-lg font-semibold text-gray-100">{t('resetPassword.invalidLinkTitle')}</h1>
          <p className="mb-6 text-sm text-gray-400">{t('resetPassword.invalidLinkBody')}</p>
          <Link to="/auth">
            <Button variant="secondary" fullWidth>
              {t('resetPassword.requestNewLink')}
            </Button>
          </Link>
        </div>
      </Shell>
    )
  }

  if (status === 'success') {
    return (
      <Shell>
        <div className="w-full max-w-sm rounded-2xl border border-[#2a2a38] bg-[#111117] p-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
            <CheckCircle2 size={28} />
          </div>
          <h1 className="mb-2 text-lg font-semibold text-gray-100">{t('resetPassword.successTitle')}</h1>
          <p className="mb-6 text-sm text-gray-400">{t('resetPassword.successBody')}</p>
          <Link to="/dashboard">
            <Button fullWidth>{t('resetPassword.goToDashboard')}</Button>
          </Link>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="w-full max-w-sm rounded-2xl border border-[#2a2a38] bg-[#111117] p-6">
        <div className="mb-5 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
            <KeyRound size={28} />
          </div>
          <h1 className="mb-1 text-lg font-semibold text-gray-100">{t('resetPassword.title')}</h1>
          <p className="text-sm text-gray-400">{t('resetPassword.subtitle')}</p>
        </div>

        {serverError && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {serverError}
          </div>
        )}

        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
          <Input
            label={t('resetPassword.newPasswordLabel')}
            type="password"
            placeholder={t('auth.passwordPlaceholder')}
            error={form.formState.errors.password?.message}
            {...form.register('password')}
          />
          <Input
            label={t('resetPassword.confirmPasswordLabel')}
            type="password"
            placeholder={t('auth.passwordPlaceholder')}
            error={form.formState.errors.confirm?.message}
            {...form.register('confirm')}
          />
          <Button type="submit" fullWidth loading={form.formState.isSubmitting}>
            {t('resetPassword.submit')}
          </Button>
        </form>
      </div>
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#0a0a0e] p-4">
      <div className="absolute right-4 top-4">
        <LanguageSwitcher />
      </div>
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 shadow-lg shadow-green-500/30">
          <Trophy size={32} className="text-white" />
        </div>
      </div>
      {children}
    </div>
  )
}
