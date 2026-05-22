import { useTranslation } from 'react-i18next'
import { formatMatchDate, formatMatchDateShort, formatRelativeTime } from '@/lib/utils'

export function useFormatDate() {
  const { i18n } = useTranslation()
  const lang = i18n.resolvedLanguage ?? 'es'

  return {
    formatMatchDate: (dateStr: string) => formatMatchDate(dateStr, lang),
    formatMatchDateShort: (dateStr: string) => formatMatchDateShort(dateStr, lang),
    formatRelativeTime: (dateStr: string) => formatRelativeTime(dateStr, lang),
  }
}
