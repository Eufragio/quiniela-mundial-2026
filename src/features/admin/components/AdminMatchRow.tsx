import { useState } from 'react'
import { Check, Save, Lock } from 'lucide-react'
import type { Match } from '@/types'
import { cn, formatMatchDateShort, getFlagEmoji } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useUpdateMatchResult } from '@/hooks/useMatches'

interface Props {
  match: Match
}

export function AdminMatchRow({ match }: Props) {
  const [home, setHome] = useState<number>(match.home_score ?? 0)
  const [away, setAway] = useState<number>(match.away_score ?? 0)
  const [finished, setFinished] = useState<boolean>(match.is_finished)
  const [savedFlash, setSavedFlash] = useState(false)
  const update = useUpdateMatchResult()

  const dirty =
    home !== (match.home_score ?? 0) ||
    away !== (match.away_score ?? 0) ||
    finished !== match.is_finished

  async function handleSave() {
    await update.mutateAsync({
      matchId: match.id,
      homeScore: home,
      awayScore: away,
      isFinished: finished,
    })
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 1500)
  }

  function Stepper({
    value,
    onChange,
    disabled,
  }: {
    value: number
    onChange: (v: number) => void
    disabled?: boolean
  }) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(Math.max(0, value - 1))}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#22222e] text-gray-300 hover:bg-[#2a2a38] disabled:opacity-40 transition-colors text-sm font-bold"
        >
          −
        </button>
        <span className="w-6 text-center text-xl font-bold text-gray-100">{value}</span>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange(value + 1)}
          className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#22222e] text-gray-300 hover:bg-[#2a2a38] disabled:opacity-40 transition-colors text-sm font-bold"
        >
          +
        </button>
      </div>
    )
  }

  return (
    <Card padding="md">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {match.group_name && (
            <Badge variant="blue" size="sm">Grupo {match.group_name}</Badge>
          )}
          <span className="text-xs text-gray-600">{formatMatchDateShort(match.match_date)}</span>
        </div>
        {match.is_finished ? (
          <Badge variant="green" size="sm">
            <Lock size={10} className="mr-1" />
            Finalizado
          </Badge>
        ) : (
          <Badge variant="gray" size="sm">Pendiente</Badge>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex flex-1 flex-col items-center gap-1">
          <span className="text-2xl">{getFlagEmoji(match.home_team)}</span>
          <span className="text-center text-xs font-medium text-gray-300">{match.home_team}</span>
          <Stepper value={home} onChange={setHome} disabled={match.is_finished} />
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-xl font-bold text-gray-600">vs</span>
        </div>

        <div className="flex flex-1 flex-col items-center gap-1">
          <span className="text-2xl">{getFlagEmoji(match.away_team)}</span>
          <span className="text-center text-xs font-medium text-gray-300">{match.away_team}</span>
          <Stepper value={away} onChange={setAway} disabled={match.is_finished} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#2a2a38] pt-3">
        <label className="flex items-center gap-2 text-xs text-gray-300">
          <input
            type="checkbox"
            checked={finished}
            disabled={match.is_finished}
            onChange={(e) => setFinished(e.target.checked)}
            className="h-4 w-4 rounded border-[#2a2a38] bg-[#22222e] text-green-500 focus:ring-green-500 focus:ring-offset-0"
          />
          <span>Marcar como finalizado</span>
        </label>

        <button
          onClick={handleSave}
          disabled={!dirty || update.isPending || match.is_finished}
          className={cn(
            'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors',
            savedFlash
              ? 'bg-green-500/25 text-green-300'
              : dirty && !match.is_finished
              ? 'bg-green-500 text-white hover:bg-green-400'
              : 'bg-[#1a1a22] text-gray-600',
          )}
        >
          {update.isPending ? (
            <>
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Guardando…
            </>
          ) : savedFlash ? (
            <>
              <Check size={12} />
              Guardado
            </>
          ) : (
            <>
              <Save size={12} />
              Guardar
            </>
          )}
        </button>
      </div>

      {update.error && (
        <p className="mt-2 text-xs text-red-400">
          Error: {(update.error as Error).message}
        </p>
      )}
    </Card>
  )
}
