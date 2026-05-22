import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useJoinGroup } from '@/hooks/useGroups'

interface Props {
  open: boolean
  onClose: () => void
}

export function JoinGroupModal({ open, onClose }: Props) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const joinGroup = useJoinGroup()

  const schema = useMemo(
    () =>
      z.object({
        code: z
          .string()
          .min(6, t('joinGroup.errorMin'))
          .max(6, t('joinGroup.errorMin')),
      }),
    [t],
  )
  type FormData = z.infer<typeof schema>

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
    <Modal open={open} onClose={onClose} title={t('joinGroup.title')}>
      <p className="mb-4 text-sm text-gray-500">{t('joinGroup.help')}</p>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label={t('joinGroup.codeLabel')}
          placeholder={t('joinGroup.codePlaceholder')}
          className="uppercase tracking-widest"
          maxLength={6}
          error={errors.code?.message}
          {...register('code')}
        />
        <div className="flex gap-3">
          <Button type="button" variant="ghost" fullWidth onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" fullWidth loading={isSubmitting}>
            {t('joinGroup.submit')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
