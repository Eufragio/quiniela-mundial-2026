import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useAuthContext } from '@/features/auth/AuthContext'
import { supabase } from '@/lib/supabase'
import { Avatar } from '@/components/ui/Avatar'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CheckCircle } from 'lucide-react'

export function ProfilePage() {
  const { user, profile, refreshProfile } = useAuthContext()
  const { t } = useTranslation()
  const [success, setSuccess] = useState(false)

  const schema = useMemo(
    () =>
      z.object({
        username: z
          .string()
          .min(3, t('profile.errorMin'))
          .max(20, t('profile.errorMax'))
          .regex(/^[a-zA-Z0-9_]+$/, t('profile.errorPattern')),
      }),
    [t],
  )
  type FormData = z.infer<typeof schema>

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { username: profile?.username ?? '' },
  })

  async function onSubmit(data: FormData) {
    if (!user) return
    const { error } = await supabase
      .from('profiles')
      .update({ username: data.username })
      .eq('id', user.id)

    if (!error) {
      await refreshProfile()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-100">{t('profile.title')}</h1>

      <Card padding="lg">
        <div className="mb-6 flex flex-col items-center gap-3">
          <Avatar
            username={profile?.username ?? '?'}
            avatarUrl={profile?.avatar_url}
            size="xl"
          />
          <div className="text-center">
            <p className="font-semibold text-gray-100">{profile?.username}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label={t('profile.usernameLabel')}
            placeholder={t('auth.usernamePlaceholder')}
            error={errors.username?.message}
            {...register('username')}
          />

          {success && (
            <div className="flex items-center gap-2 rounded-xl bg-green-500/10 border border-green-500/30 p-3 text-sm text-green-400">
              <CheckCircle size={16} />
              {t('profile.saved')}
            </div>
          )}

          <Button type="submit" fullWidth loading={isSubmitting}>
            {t('profile.saveButton')}
          </Button>
        </form>
      </Card>
    </div>
  )
}
