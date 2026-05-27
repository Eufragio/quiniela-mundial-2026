import { useMemo, useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Pencil } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useUpdateGroupRules } from '@/hooks/useGroups'
import { cn } from '@/lib/utils'
import type { Group } from '@/types'

interface Props {
  open: boolean
  onClose: () => void
  group: Group
  isAdmin: boolean
}

export function GroupRulesModal({ open, onClose, group, isAdmin }: Props) {
  const { t } = useTranslation()
  const [editing, setEditing] = useState(false)
  const updateRules = useUpdateGroupRules(group.id)

  const schema = useMemo(
    () => z.object({ rules: z.string().max(2000, t('groupRules.errorMax')) }),
    [t],
  )
  type FormData = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: { rules: group.rules ?? '' },
  })

  useEffect(() => {
    if (!open) setEditing(false)
  }, [open])

  async function onSubmit(data: FormData) {
    await updateRules.mutateAsync(data.rules)
    setEditing(false)
  }

  return (
    <Modal open={open} onClose={onClose} title={t('groupRules.title')}>
      {editing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="group-rules" className="text-sm font-medium text-gray-300">
              {t('groupRules.label')}
            </label>
            <textarea
              id="group-rules"
              rows={8}
              placeholder={t('groupRules.placeholder')}
              className={cn(
                'w-full resize-none rounded-xl border bg-[#1a1a22] px-4 py-3 text-sm leading-relaxed text-gray-100 placeholder-gray-600',
                'transition-colors duration-150 focus:outline-none focus:ring-2',
                errors.rules
                  ? 'border-red-500 focus:ring-red-500/30'
                  : 'border-[#2a2a38] focus:border-green-500 focus:ring-green-500/20',
              )}
              {...register('rules')}
            />
            {errors.rules && <p className="text-xs text-red-400">{errors.rules.message}</p>}
          </div>
          {updateRules.error && (
            <p className="text-sm text-red-400">
              {updateRules.error instanceof Error ? updateRules.error.message : t('common.error')}
            </p>
          )}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              fullWidth
              onClick={() => {
                reset()
                setEditing(false)
              }}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" fullWidth loading={isSubmitting}>
              {t('common.save')}
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-4">
          {group.rules ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300">{group.rules}</p>
          ) : (
            <p className="text-sm text-gray-500">
              {isAdmin ? t('groupRules.emptyAdmin') : t('groupRules.emptyMember')}
            </p>
          )}
          {isAdmin && (
            <Button type="button" variant="secondary" fullWidth onClick={() => setEditing(true)}>
              <Pencil size={15} />
              {group.rules ? t('groupRules.edit') : t('groupRules.add')}
            </Button>
          )}
        </div>
      )}
    </Modal>
  )
}
