import { Outlet, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Navbar } from './Navbar'
import { BottomNav } from './BottomNav'
import { useTwemoji } from '@/hooks/useTwemoji'

export function Layout() {
  useTwemoji()
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0e]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-[#2a2a38] px-4 py-6 pb-24 sm:pb-6">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <Link to="/rules" className="transition-colors hover:text-gray-400">
              {t('footer.rules')}
            </Link>
            <span className="text-gray-700">·</span>
            <Link to="/about" className="transition-colors hover:text-gray-400">
              {t('footer.about')}
            </Link>
            <span className="text-gray-700">·</span>
            <Link to="/privacy" className="transition-colors hover:text-gray-400">
              {t('footer.privacy')}
            </Link>
          </div>
          <Link to="/about" className="transition-colors hover:text-gray-400">
            {t('footer.madeBy', { name: 'Marco Eufragio' })}
          </Link>
        </div>
      </footer>
      <BottomNav />
    </div>
  )
}
