import { useTranslation } from 'react-i18next'
import { Languages } from 'lucide-react'

const LANGS = ['es', 'en'] as const
type Lang = (typeof LANGS)[number]

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { i18n } = useTranslation()
  const current = (LANGS.includes(i18n.resolvedLanguage as Lang)
    ? i18n.resolvedLanguage
    : 'es') as Lang

  function toggle() {
    const next: Lang = current === 'es' ? 'en' : 'es'
    void i18n.changeLanguage(next)
  }

  if (compact) {
    return (
      <button
        onClick={toggle}
        className="rounded-xl p-2 text-gray-500 transition-colors hover:bg-[#1a1a22] hover:text-gray-200"
        title={current === 'es' ? 'Switch to English' : 'Cambiar a Español'}
      >
        <Languages size={16} />
      </button>
    )
  }

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-1.5 rounded-xl border border-[#2a2a38] bg-[#1a1a22] px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-gray-200"
    >
      <Languages size={14} />
      <span>{current === 'es' ? 'EN' : 'ES'}</span>
    </button>
  )
}
