import { NavLink, useParams } from 'react-router-dom'
import { LayoutDashboard, Trophy, List } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const { groupId } = useParams()
  const { t } = useTranslation()

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: t('nav.home') },
    ...(groupId
      ? [
          { to: `/groups/${groupId}`, icon: List, label: t('nav.matches') },
          { to: `/groups/${groupId}/leaderboard`, icon: Trophy, label: t('nav.leaderboard') },
        ]
      : []),
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#2a2a38] bg-[#0a0a0e]/90 backdrop-blur-xl sm:hidden">
      <div className="flex items-center justify-around px-4 py-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 rounded-xl px-4 py-2 text-xs transition-colors',
                isActive
                  ? 'text-green-400'
                  : 'text-gray-600 hover:text-gray-300',
              )
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
