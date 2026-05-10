import { NavLink, useParams } from 'react-router-dom'
import { LayoutDashboard, Trophy, List } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const { groupId } = useParams()

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Mis Quinielas' },
    ...(groupId
      ? [
          { to: `/groups/${groupId}`, icon: List, label: 'Partidos' },
          { to: `/groups/${groupId}/leaderboard`, icon: Trophy, label: 'Posiciones' },
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
