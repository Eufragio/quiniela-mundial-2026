import { useNavigate } from 'react-router-dom'
import { ScrollText, ArrowLeft } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function RulesPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0a0a0e] px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-300"
        >
          <ArrowLeft size={14} />
          {t('common.back')}
        </button>

        <div className="mb-8 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
            <ScrollText size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-100">{t('rules.title')}</h1>
            <p className="mt-1 text-sm text-gray-500">{t('rules.subtitle')}</p>
          </div>
        </div>

        <div className="space-y-6 rounded-2xl border border-[#2a2a38] bg-[#111117] p-6 text-sm leading-relaxed text-gray-300">
          <p className="text-gray-400">{t('rules.intro')}</p>

          <Section title={t('rules.howTitle')}>
            <ol className="list-decimal space-y-1 pl-5">
              <li>{t('rules.how1')}</li>
              <li>{t('rules.how2')}</li>
              <li>{t('rules.how3')}</li>
            </ol>
          </Section>

          <Section title={t('rules.scoringTitle')}>
            <p>{t('rules.scoringIntro')}</p>
            <ul className="mt-3 space-y-2">
              <li className="flex items-center gap-3">
                <span className="flex h-7 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/15 text-sm font-bold text-green-400">
                  +3
                </span>
                <span>{t('rules.scoringExact')}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-7 w-10 shrink-0 items-center justify-center rounded-lg bg-yellow-500/15 text-sm font-bold text-yellow-400">
                  +1
                </span>
                <span>{t('rules.scoringResult')}</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-7 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/15 text-sm font-bold text-red-400">
                  0
                </span>
                <span>{t('rules.scoringMiss')}</span>
              </li>
            </ul>
            <p className="mt-3 text-gray-500">{t('rules.scoringExample')}</p>
          </Section>

          <Section title={t('rules.lockTitle')}>
            <p>{t('rules.lockBody')}</p>
          </Section>

          <Section title={t('rules.visibilityTitle')}>
            <p>{t('rules.visibilityBody')}</p>
          </Section>

          <Section title={t('rules.rankingTitle')}>
            <p>{t('rules.rankingBody')}</p>
          </Section>

          <Section title={t('rules.fairTitle')}>
            <p>{t('rules.fairBody')}</p>
          </Section>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-base font-semibold text-gray-100">{title}</h2>
      <div className="text-gray-300">{children}</div>
    </section>
  )
}
