import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Info, Code, Briefcase, Globe, LifeBuoy, Mail, MessageCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Avatar } from '@/components/ui/Avatar'

const CREATOR_NAME = 'Marco Eufragio'
const LINKEDIN_URL = 'https://www.linkedin.com/in/marco-eufragio'
const PORTFOLIO_URL = 'https://eufragio.github.io'
const SUPPORT_EMAIL = 'eufragio.marco@gmail.com'
const WHATSAPP_NUMBER = '50432456344'

const linkButton =
  'flex items-center justify-center gap-2 rounded-xl border border-[#2a2a38] bg-[#1a1a22] px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:bg-[#22222e] hover:text-gray-100'

export function AboutPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const mailtoHref = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
    t('about.supportEmailSubject'),
  )}&body=${encodeURIComponent(t('about.supportEmailBody'))}`

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    t('about.supportWhatsappText'),
  )}`

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
            <Info size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-100">{t('about.title')}</h1>
            <p className="mt-1 text-sm text-gray-500">{t('about.subtitle')}</p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-[#2a2a38] bg-[#111117] p-6">
          <div className="flex items-center gap-4">
            <Avatar username={CREATOR_NAME} size="xl" />
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-gray-600">{t('about.madeBy')}</p>
              <h2 className="truncate text-lg font-bold text-gray-100">{CREATOR_NAME}</h2>
              <p className="flex items-center gap-1.5 text-sm text-gray-500">
                <Code size={13} />
                {t('about.role')}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className={linkButton}>
              <Briefcase size={16} />
              LinkedIn
            </a>
            <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" className={linkButton}>
              <Globe size={16} />
              {t('about.portfolio')}
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-[#2a2a38] bg-[#111117] p-6">
          <div className="mb-3 flex items-center gap-2">
            <LifeBuoy size={18} className="text-green-400" />
            <h2 className="text-base font-semibold text-gray-100">{t('about.supportTitle')}</h2>
          </div>
          <p className="text-sm leading-relaxed text-gray-400">{t('about.supportBody')}</p>

          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <a
              href={mailtoHref}
              className="flex items-center justify-center gap-2 rounded-xl bg-green-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-600"
            >
              <Mail size={16} />
              {t('about.contactEmail')}
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-2.5 text-sm font-medium text-green-400 transition-colors hover:bg-green-500/20"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>

          <p className="mt-4 text-center text-xs text-gray-600">{t('about.supportNote')}</p>
        </div>
      </div>
    </div>
  )
}
