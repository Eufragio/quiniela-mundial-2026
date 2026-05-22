import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useCreateGroup } from '@/hooks/useGroups'

interface Props {
  open: boolean
  onClose: () => void
}

export function CreateGroupModal({ open, onClose }: Props) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const createGroup = useCreateGroup()

  const schema = useMemo(
    () =>
      z.object({
        name: z
          .string()
          .min(3, t('createGroup.errorMin'))
          .max(50, t('createGroup.errorMax')),
      }),
    [t],
  )
  type FormData = z.infer<typeof schema>

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
    <Modal open={open} onClose={onClose} title={t('createGroup.title')}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label={t('createGroup.nameLabel')}
          placeholder={t('createGroup.namePlaceholder')}
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
            {t('common.cancel')}
          </Button>
          <Button type="submit" fullWidth loading={isSubmitting}>
            {t('createGroup.submit')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
