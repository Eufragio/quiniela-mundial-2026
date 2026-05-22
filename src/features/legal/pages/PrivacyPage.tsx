import { Link } from 'react-router-dom'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import { useTranslation, Trans } from 'react-i18next'
import { Button } from '@/components/ui/Button'

const CONTACT_EMAIL = 'eufragio.marco@gmail.com'

export function PrivacyPage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-[#0a0a0e] px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/auth"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-300"
        >
          <ArrowLeft size={14} />
          {t('common.back')}
        </Link>

        <div className="mb-8 flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-100">{t('privacy.title')}</h1>
            <p className="mt-1 text-sm text-gray-500">{t('privacy.lastUpdate')}</p>
          </div>
        </div>

        <div className="space-y-6 rounded-2xl border border-[#2a2a38] bg-[#111117] p-6 text-sm leading-relaxed text-gray-300">
          <p className="text-gray-400">{t('privacy.intro')}</p>

          <Section title={t('privacy.section1Title')}>
            <ul className="list-disc space-y-1 pl-5">
              <li>{t('privacy.section1Email')}</li>
              <li>{t('privacy.section1Username')}</li>
              <li>{t('privacy.section1Password')}</li>
              <li>{t('privacy.section1Predictions')}</li>
              <li>{t('privacy.section1Groups')}</li>
            </ul>
            <p className="mt-3 text-gray-500">{t('privacy.section1Note')}</p>
          </Section>

          <Section title={t('privacy.section2Title')}>
            <p>{t('privacy.section2Body')}</p>
            <p className="mt-2 text-gray-500">{t('privacy.section2Note')}</p>
          </Section>

          <Section title={t('privacy.section3Title')}>
            <p>{t('privacy.section3Intro')}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>{t('privacy.section3Supabase')}</li>
              <li>{t('privacy.section3Vercel')}</li>
            </ul>
            <p className="mt-3 text-gray-500">{t('privacy.section3Note')}</p>
          </Section>

          <Section title={t('privacy.section4Title')}>
            <p>{t('privacy.section4Body')}</p>
          </Section>

          <Section title={t('privacy.section5Title')}>
            <p>{t('privacy.section5Intro')}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>{t('privacy.section5Right1')}</li>
              <li>{t('privacy.section5Right2')}</li>
              <li>{t('privacy.section5Right3')}</li>
              <li>{t('privacy.section5Right4')}</li>
            </ul>
          </Section>

          <Section title={t('privacy.section6Title')}>
            <p>
              <Trans
                i18nKey="privacy.section6Body"
                values={{ email: CONTACT_EMAIL }}
                components={{
                  mail: (
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="text-green-400 underline-offset-2 hover:underline"
                    />
                  ),
                }}
              />
            </p>
          </Section>

          <Section title={t('privacy.section7Title')}>
            <p>{t('privacy.section7Body')}</p>
          </Section>
        </div>

        <div className="mt-8 flex justify-center">
          <Link to="/auth">
            <Button variant="secondary">
              <ArrowLeft size={16} />
              {t('privacy.backToLogin')}
            </Button>
          </Link>
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
