import { useState } from 'react'
import { Lock, Clock, CheckCircle } from 'lucide-react'
import type { Match, Prediction } from '@/types'
import { cn, formatMatchDateShort, getFlagEmoji, isMatchLocked, calcPredictionPoints } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PredictionInput } from '@/features/predictions/components/PredictionInput'

interface MatchCardProps {
  match: Match
  groupId: string
  prediction?: Prediction
}

export function MatchCard({ match, groupId, prediction }: MatchCardProps) {
  const [showInput, setShowInput] = useState(false)
  const locked = isMatchLocked(match.match_date)

  const pointsEarned = match.is_finished && prediction
    ? calcPredictionPoints(
        prediction.home_score,
        prediction.away_score,
        match.home_score!,
        match.away_score!,
      )
    : null

  const pointsColor =
    pointsEarned === 3 ? 'green' :
    pointsEarned === 1 ? 'yellow' :
    pointsEarned === 0 ? 'red' :
    'gray'

  return (
    <Card padding="md" className="select-none">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {match.group_name && (
            <Badge variant="blue" size="sm">Grupo {match.group_name}</Badge>
          )}
          <span className="text-xs text-gray-600">{formatMatchDateShort(match.match_date)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {match.is_finished ? (
            <CheckCircle size={14} className="text-green-500" />
          ) : locked ? (
            <Lock size={14} className="text-gray-600" />
          ) : (
            <Clock size={14} className="text-yellow-500" />
          )}
          {pointsEarned !== null && (
            <Badge variant={pointsColor} size="sm">
              {pointsEarned} pts
            </Badge>
          )}
        </div>
      </div>

      {/* Teams + Score */}
      <div className="flex items-center gap-3">
        {/* Home */}
        <div className="flex flex-1 flex-col items-center gap-1">
          <span className="text-2xl">{getFlagEmoji(match.home_team)}</span>
          <span className="text-center text-xs font-medium text-gray-300">{match.home_team}</span>
        </div>

        {/* Scores */}
        <div className="flex flex-col items-center gap-1">
          {match.is_finished ? (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-100">{match.home_score}</span>
              <span className="text-gray-600">-</span>
              <span className="text-2xl font-bold text-gray-100">{match.away_score}</span>
            </div>
          ) : (
            <span className="text-xl font-bold text-gray-600">vs</span>
          )}

          {/* User's prediction */}
          {prediction && (
            <div
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium',
                match.is_finished
                  ? pointsEarned === 3
                    ? 'bg-green-500/15 text-green-400'
                    : pointsEarned === 1
                    ? 'bg-yellow-500/15 text-yellow-400'
                    : 'bg-red-500/15 text-red-400'
                  : 'bg-[#22222e] text-gray-400',
              )}
            >
              <span>Tu pronóstico:</span>
              <span className="font-bold text-gray-200">
                {prediction.home_score}-{prediction.away_score}
              </span>
            </div>
          )}
        </div>

        {/* Away */}
        <div className="flex flex-1 flex-col items-center gap-1">
          <span className="text-2xl">{getFlagEmoji(match.away_team)}</span>
          <span className="text-center text-xs font-medium text-gray-300">{match.away_team}</span>
        </div>
      </div>

      {/* Prediction action */}
      {!locked && !match.is_finished && (
        <div className="mt-3 border-t border-[#2a2a38] pt-3">
          {showInput ? (
            <PredictionInput
              match={match}
              groupId={groupId}
              existing={prediction}
              onDone={() => setShowInput(false)}
            />
          ) : (
            <button
              onClick={() => setShowInput(true)}
              className={cn(
                'w-full rounded-xl py-2 text-xs font-medium transition-colors',
                prediction
                  ? 'bg-[#1a1a22] text-gray-400 hover:text-gray-200'
                  : 'bg-green-500/15 text-green-400 hover:bg-green-500/25',
              )}
            >
              {prediction ? '✏️ Editar pronóstico' : '🎯 Hacer pronóstico'}
            </button>
          )}
        </div>
      )}

      {/* Venue */}
      {match.venue && (
        <p className="mt-2 text-center text-xs text-gray-700">{match.venue}</p>
      )}
    </Card>
  )
}
