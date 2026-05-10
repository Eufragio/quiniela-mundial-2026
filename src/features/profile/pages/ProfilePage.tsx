import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useAuthContext } from '@/features/auth/AuthContext'
import { supabase } from '@/lib/supabase'
import { Avatar } from '@/components/ui/Avatar'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CheckCircle } from 'lucide-react'

const schema = z.object({
  username: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(20, 'Máximo 20 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Solo letras, números y _'),
})
type FormData = z.infer<typeof schema>

export function ProfilePage() {
  const { user, profile, refreshProfile } = useAuthContext()
  const [success, setSuccess] = useState(false)

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
      <h1 className="mb-6 text-2xl font-bold text-gray-100">Mi perfil</h1>

      <Card padding="lg">
        {/* Avatar */}
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

        {/* Edit form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            label="Nombre de usuario"
            placeholder="tu_usuario"
            error={errors.username?.message}
            {...register('username')}
          />

          {success && (
            <div className="flex items-center gap-2 rounded-xl bg-green-500/10 border border-green-500/30 p-3 text-sm text-green-400">
              <CheckCircle size={16} />
              Perfil actualizado
            </div>
          )}

          <Button type="submit" fullWidth loading={isSubmitting}>
            Guardar cambios
          </Button>
        </form>
      </Card>
    </div>
  )
}
