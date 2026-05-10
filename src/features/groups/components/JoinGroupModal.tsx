import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useJoinGroup } from '@/hooks/useGroups'

const schema = z.object({
  code: z.string().min(6, 'El código tiene 6 caracteres').max(6, 'El código tiene 6 caracteres'),
})
type FormData = z.infer<typeof schema>

interface Props {
  open: boolean
  onClose: () => void
}

export function JoinGroupModal({ open, onClose }: Props) {
  const navigate = useNavigate()
  const joinGroup = useJoinGroup()
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    try {
      const group = await joinGroup.mutateAsync(data.code)
      reset()
      onClose()
      navigate(`/groups/${group.id}`)
    } catch (e) {
      setError('code', { message: String((e as Error).message) })
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Unirse a quiniela">
      <p className="mb-4 text-sm text-gray-500">
        Ingresá el código de 6 caracteres que te compartieron.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Código de invitación"
          placeholder="ABC123"
          className="uppercase tracking-widest"
          maxLength={6}
          error={errors.code?.message}
          {...register('code')}
        />
        <div className="flex gap-3">
          <Button type="button" variant="ghost" fullWidth onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" fullWidth loading={isSubmitting}>
            Unirse
          </Button>
        </div>
      </form>
    </Modal>
  )
}
