import { Link } from 'react-router-dom'
import { Trophy, LogOut, User, Shield } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuthContext } from '@/features/auth/AuthContext'
import { Avatar } from '@/components/ui/Avatar'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'

export function Navbar() {
  const { profile, signOut } = useAuthContext()
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-40 border-b border-[#2a2a38] bg-[#0a0a0e]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <Trophy size={20} className="text-green-500" />
          <span className="font-bold text-gray-100">{t('app.shortTitle')}</span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher compact />
          {profile && (
            <>
              {profile.is_admin && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 rounded-xl bg-yellow-500/10 px-2.5 py-1.5 text-yellow-400 hover:bg-yellow-500/20 transition-colors"
                  title={t('group.admin')}
                >
                  <Shield size={14} />
                  <span className="hidden text-xs font-medium sm:block">{t('group.admin')}</span>
                </Link>
              )}
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-[#1a1a22] transition-colors"
              >
                <Avatar username={profile.username} avatarUrl={profile.avatar_url} size="sm" />
                <span className="hidden text-sm font-medium text-gray-300 sm:block">
                  {profile.username}
                </span>
              </Link>
              <button
                onClick={signOut}
                className="rounded-xl p-2 text-gray-500 hover:bg-[#1a1a22] hover:text-gray-200 transition-colors"
                title={t('common.logout')}
              >
                <LogOut size={16} />
              </button>
            </>
          )}
          {!profile && (
            <User size={20} className="text-gray-600" />
          )}
        </div>
      </div>
    </header>
  )
}
