import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useCreateGroup } from '@/hooks/useGroups'

const schema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres').max(40, 'Máximo 40 caracteres'),
})
type FormData = z.infer<typeof schema>

interface Props {
  open: boolean
  onClose: () => void
}

export function CreateGroupModal({ open, onClose }: Props) {
  const navigate = useNavigate()
  const createGroup = useCreateGroup()
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    const group = await createGroup.mutateAsync(data.name)
    reset()
    onClose()
    navigate(`/groups/${group.id}`)
  }

  return (
    <Modal open={open} onClose={onClose} title="Crear quiniela">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Nombre de la quiniela"
          placeholder="Ej: Los Cracks del Trabajo"
          error={errors.name?.message}
          {...register('name')}
        />
        {createGroup.error && (
          <p className="text-sm text-red-400">
            {createGroup.error instanceof Error
              ? createGroup.error.message
              : JSON.stringify(createGroup.error)}
          </p>
        )}
        <div className="flex gap-3">
          <Button type="button" variant="ghost" fullWidth onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" fullWidth loading={isSubmitting}>
            Crear
          </Button>
        </div>
      </form>
    </Modal>
  )
}
