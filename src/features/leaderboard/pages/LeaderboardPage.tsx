import { useLeaderboard } from '@/hooks/useLeaderboard'
import { useAuthContext } from '@/features/auth/AuthContext'
import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { Trophy, Star, CheckCircle } from 'lucide-react'

interface Props {
  groupId: string
}

export function LeaderboardPage({ groupId }: Props) {
  const { data: entries, isLoading } = useLeaderboard(groupId)
  const { user } = useAuthContext()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-2xl bg-[#111117]" />
        ))}
      </div>
    )
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="rounded-2xl border border-[#2a2a38] bg-[#111117] p-8 text-center">
        <Trophy size={36} className="mx-auto mb-3 text-gray-700" />
        <p className="text-gray-500">Aún no hay predicciones en esta quiniela</p>
        <p className="mt-1 text-sm text-gray-600">Hacé tus pronósticos en la pestaña Partidos</p>
      </div>
    )
  }

  const top3Colors = ['text-yellow-400', 'text-gray-400', 'text-amber-600']

  return (
    <div className="space-y-2">
      {entries.map((entry, idx) => {
        const isMe = entry.user_id === user?.id
        const rank = idx + 1

        return (
          <div
            key={entry.user_id}
            className={cn(
              'flex items-center gap-3 rounded-2xl border p-3.5 transition-colors',
              isMe
                ? 'border-green-500/40 bg-green-500/5'
                : 'border-[#2a2a38] bg-[#111117]',
            )}
          >
            {/* Rank */}
            <div className="flex w-7 shrink-0 justify-center">
              {rank <= 3 ? (
                <Trophy
                  size={18}
                  className={cn(top3Colors[rank - 1])}
                />
              ) : (
                <span className="text-sm font-bold text-gray-600">{rank}</span>
              )}
            </div>

            {/* Avatar */}
            <Avatar
              username={entry.username}
              avatarUrl={entry.avatar_url}
              size="sm"
            />

            {/* Name */}
            <div className="flex-1 min-w-0">
              <p className={cn('truncate text-sm font-medium', isMe ? 'text-green-400' : 'text-gray-200')}>
                {entry.username} {isMe && '(vos)'}
              </p>
              <div className="mt-0.5 flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs text-gray-600">
                  <Star size={11} className="text-yellow-500" />
                  {entry.exact_results} exactos
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-600">
                  <CheckCircle size={11} className="text-blue-400" />
                  {entry.correct_results} correctos
                </span>
              </div>
            </div>

            {/* Points */}
            <div className="text-right">
              <p className={cn('text-xl font-bold', isMe ? 'text-green-400' : 'text-gray-100')}>
                {Number(entry.total_points)}
              </p>
              <p className="text-xs text-gray-600">pts</p>
            </div>
          </div>
        )
      })}

      {/* Legend */}
      <div className="mt-4 rounded-xl border border-[#2a2a38] bg-[#111117] p-3">
        <p className="mb-2 text-xs font-medium text-gray-500 uppercase">Sistema de puntuación</p>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Badge variant="green" size="sm">3 pts</Badge> Resultado exacto
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Badge variant="yellow" size="sm">1 pt</Badge> Ganador correcto
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Badge variant="red" size="sm">0 pts</Badge> Incorrecto
          </div>
        </div>
      </div>
    </div>
  )
}
