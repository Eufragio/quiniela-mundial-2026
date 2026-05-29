import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertCircle, ImagePlus, Trash2 } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { useRemoveGroupLogo, useUploadGroupLogo } from '@/hooks/useGroups'
import type { Group } from '@/types'

interface Props {
  open: boolean
  onClose: () => void
  group: Group
}

export function GroupLogoModal({ open, onClose, group }: Props) {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selected, setSelected] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confirmRemove, setConfirmRemove] = useState(false)

  const uploadLogo = useUploadGroupLogo(group.id)
  const removeLogo = useRemoveGroupLogo(group.id)

  useEffect(() => {
    if (!open) {
      setSelected(null)
      setPreviewUrl(null)
      setError(null)
      setConfirmRemove(false)
    }
  }, [open])

  useEffect(() => {
    if (!selected) {
      setPreviewUrl(null)
      return
    }
    const url = URL.createObjectURL(selected)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [selected])

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null)
    const file = e.target.files?.[0]
    if (file) setSelected(file)
    e.target.value = ''
  }

  async function onSave() {
    if (!selected) return
    setError(null)
    try {
      await uploadLogo.mutateAsync(selected)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'))
    }
  }

  async function onRemove() {
    setError(null)
    try {
      await removeLogo.mutateAsync()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : t('common.error'))
    }
  }

  const isWorking = uploadLogo.isPending || removeLogo.isPending
  const hasLogo = !!group.logo_url
  const displayUrl = previewUrl ?? group.logo_url

  return (
    <Modal open={open} onClose={onClose} title={t('groupLogo.title')}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-2 py-2">
          <div className="flex aspect-square h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border border-[#2a2a38] bg-[#1a1a22]">
            {displayUrl ? (
              <img src={displayUrl} alt={group.name} className="h-full w-full object-cover" />
            ) : (
              <Avatar username={group.name} size="xl" />
            )}
          </div>
          {previewUrl && (
            <p className="text-xs text-green-400">{t('groupLogo.previewHint')}</p>
          )}
        </div>

        <p className="text-center text-xs text-gray-500">{t('groupLogo.help')}</p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={onPick}
        />

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {confirmRemove ? (
          <div className="flex flex-col gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
            <p className="text-sm text-red-200">{t('groupLogo.confirmRemove')}</p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                fullWidth
                onClick={() => setConfirmRemove(false)}
                disabled={isWorking}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                fullWidth
                loading={removeLogo.isPending}
                onClick={onRemove}
              >
                {t('groupLogo.removeConfirmBtn')}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => fileInputRef.current?.click()}
              disabled={isWorking}
            >
              <ImagePlus size={15} />
              {selected ? t('groupLogo.chooseOther') : t('groupLogo.choose')}
            </Button>

            {selected ? (
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  fullWidth
                  onClick={() => setSelected(null)}
                  disabled={isWorking}
                >
                  {t('common.cancel')}
                </Button>
                <Button type="button" fullWidth onClick={onSave} loading={uploadLogo.isPending}>
                  {t('common.save')}
                </Button>
              </div>
            ) : (
              hasLogo && (
                <Button
                  type="button"
                  variant="ghost"
                  fullWidth
                  onClick={() => setConfirmRemove(true)}
                  disabled={isWorking}
                >
                  <Trash2 size={15} />
                  {t('groupLogo.remove')}
                </Button>
              )
            )}
          </>
        )}
      </div>
    </Modal>
  )
}
