import { useState } from 'react'
import { ChevronDown, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Match } from '@/types'
import { cn, calcPredictionPoints } from '@/lib/utils'
import { useAuthContext } from '@/features/auth/AuthContext'
import { useAllGroupPredictions } from '@/hooks/usePredictions'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'

interface OthersPredictionsProps {
  match: Match
  groupId: string
}

export function OthersPredictions({ match, groupId }: OthersPredictionsProps) {
  const { t } = useTranslation()
  const { user } = useAuthContext()
  const [open, setOpen] = useState(false)
  const { data } = useAllGroupPredictions(groupId)

  const others = (data ?? []).filter(
    (p) => p.match_id === match.id && p.user_id !== user?.id,
  )

  if (others.length === 0) return null

  return (
    <div className="mt-3 border-t border-[#2a2a38] pt-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-xs font-medium text-gray-400 transition-colors hover:text-gray-200"
      >
        <span className="flex items-center gap-1.5">
          <Users size={13} />
          {t(
            others.length === 1
              ? 'matchCard.othersPredictionsOne'
              : 'matchCard.othersPredictionsOther',
            { count: others.length },
          )}
        </span>
        <ChevronDown size={14} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <ul className="mt-2 space-y-1.5">
          {others.map((p) => {
            const points = match.is_finished
              ? calcPredictionPoints(p.home_score, p.away_score, match.home_score!, match.away_score!)
              : null
            const pointsColor = points === 3 ? 'green' : points === 1 ? 'yellow' : 'red'
            return (
              <li
                key={p.id}
                className="flex items-center justify-between rounded-lg bg-[#1a1a22] px-2.5 py-1.5"
              >
                <span className="flex items-center gap-2">
                  <Avatar username={p.profile.username} avatarUrl={p.profile.avatar_url} size="sm" />
                  <span className="text-xs text-gray-300">{p.profile.username}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-200">
                    {p.home_score}-{p.away_score}
                  </span>
                  {points !== null && (
                    <Badge variant={pointsColor} size="sm">
                      {t(points === 1 ? 'matchCard.pointsOne' : 'matchCard.pointsOther', { count: points })}
                    </Badge>
                  )}
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
