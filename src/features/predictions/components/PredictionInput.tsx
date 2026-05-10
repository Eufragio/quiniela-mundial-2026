import { useState } from 'react'
import { Check, X } from 'lucide-react'
import type { Match, Prediction } from '@/types'
import { useSavePrediction } from '@/hooks/usePredictions'
import { getFlagEmoji } from '@/lib/utils'

interface Props {
  match: Match
  groupId: string
  existing?: Prediction
  onDone: () => void
}

export function PredictionInput({ match, groupId, existing, onDone }: Props) {
  const [home, setHome] = useState(existing?.home_score ?? 0)
  const [away, setAway] = useState(existing?.away_score ?? 0)
  const save = useSavePrediction(groupId)

  async function handleSave() {
    await save.mutateAsync({
      matchId: match.id,
      homeScore: home,
      awayScore: away,
      existingId: existing?.id,
    })
    onDone()
  }

  function ScoreSelector({
    value,
    onChange,
  }: {
    value: number
    onChange: (v: number) => void
  }) {
    return (
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(0, value - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#22222e] text-gray-300 hover:bg-[#2a2a38] transition-colors text-base font-bold"
        >
          −
        </button>
        <span className="w-8 text-center text-2xl font-bold text-gray-100">{value}</span>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#22222e] text-gray-300 hover:bg-[#2a2a38] transition-colors text-base font-bold"
        >
          +
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-2">
      {/* Home */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm">{getFlagEmoji(match.home_team)}</span>
        <ScoreSelector value={home} onChange={setHome} />
      </div>

      {/* Actions */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-xs text-gray-600">vs</span>
        <div className="flex gap-2">
          <button
            onClick={onDone}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#22222e] text-gray-500 hover:text-gray-200 transition-colors"
          >
            <X size={14} />
          </button>
          <button
            onClick={handleSave}
            disabled={save.isPending}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500 text-white hover:bg-green-400 disabled:opacity-50 transition-colors"
          >
            {save.isPending ? (
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <Check size={14} />
            )}
          </button>
        </div>
      </div>

      {/* Away */}
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm">{getFlagEmoji(match.away_team)}</span>
        <ScoreSelector value={away} onChange={setAway} />
      </div>
    </div>
  )
}
