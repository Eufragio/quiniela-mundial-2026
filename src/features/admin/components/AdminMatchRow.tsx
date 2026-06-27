import { useMemo, useState } from 'react'
import { Check, Save, Lock, Pencil, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Match } from '@/types'
import { cn, getFlagEmoji, WORLD_CUP_TEAMS } from '@/lib/utils'
import { useFormatDate } from '@/hooks/useFormatDate'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useUpdateMatchResult, useUpdateMatchTeams } from '@/hooks/useMatches'

interface Props {
  match: Match
}

export function AdminMatchRow({ match }: Props) {
  const { t } = useTranslation()
  const { formatMatchDateShort } = useFormatDate()
  const [home, setHome] = useState<number>(match.home_score ?? 0)
  const [away, setAway] = useState<number>(match.away_score ?? 0)
  const [finished, setFinished] = useState<boolean>(match.is_finished)
  const [savedFlash, setSavedFlash] = useState(false)
  const update = useUpdateMatchResult()

  const [editingTeams, setEditingTeams] = useState(false)
  const [homeTeam, setHomeTeam] = useState(match.home_team)
  const [awayTeam, setAwayTeam] = useState(match.away_team)
  const updateTeams = useUpdateMatchTeams()

  const canEditTeams = match.phase !== 'group_stage' && !match.is_finished

  const teamOptions = useMemo(() => {
    const known = new Set(WORLD_CUP_TEAMS)
    const placeholders = [match.home_team, match.away_team].filter((tName) => !known.has(tName))
    return [...placeholders, ...WORLD_CUP_TEAMS]
  }, [match.home_team, match.away_team])

  const teamsDirty = homeTeam !== match.home_team || awayTeam !== match.away_team

  function startEditTeams() {
    setHomeTeam(match.home_team)
    setAwayTeam(match.away_team)
    setEditingTeams(true)
  }

  async function handleSaveTeams() {
    await updateTeams.mutateAsync({ matchId: match.id, homeTeam, awayTeam })
    setEditingTeams(false)
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 1500)
  }

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
            <Badge variant="blue" size="sm">{t('group.groupLabel')} {match.group_name}</Badge>
          )}
          <span className="text-xs text-gray-600">{formatMatchDateShort(match.match_date)}</span>
        </div>
        <div className="flex items-center gap-2">
          {canEditTeams && !editingTeams && (
            <button
              type="button"
              onClick={startEditTeams}
              className="flex items-center gap-1 rounded-lg border border-[#2a2a38] bg-[#1a1a22] px-2 py-1 text-xs font-medium text-gray-400 transition-colors hover:text-gray-200"
            >
              <Pencil size={11} />
              {t('admin.editTeams')}
            </button>
          )}
          {match.is_finished ? (
            <Badge variant="green" size="sm">
              <Lock size={10} className="mr-1" />
              {t('admin.finished')}
            </Badge>
          ) : (
            <Badge variant="gray" size="sm">{t('admin.statPending')}</Badge>
          )}
        </div>
      </div>

      {editingTeams ? (
        <div className="space-y-3">
          <TeamSelect
            label={t('admin.homeScore')}
            value={homeTeam}
            options={teamOptions}
            onChange={setHomeTeam}
          />
          <TeamSelect
            label={t('admin.awayScore')}
            value={awayTeam}
            options={teamOptions}
            onChange={setAwayTeam}
          />

          <div className="flex items-center justify-end gap-2 border-t border-[#2a2a38] pt-3">
            <button
              type="button"
              onClick={() => setEditingTeams(false)}
              disabled={updateTeams.isPending}
              className="flex items-center gap-1.5 rounded-xl bg-[#1a1a22] px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-gray-200"
            >
              <X size={12} />
              {t('admin.cancel')}
            </button>
            <button
              type="button"
              onClick={handleSaveTeams}
              disabled={!teamsDirty || updateTeams.isPending}
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors',
                teamsDirty
                  ? 'bg-green-500 text-white hover:bg-green-400'
                  : 'bg-[#1a1a22] text-gray-600',
              )}
            >
              {updateTeams.isPending ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {t('admin.saving')}
                </>
              ) : (
                <>
                  <Save size={12} />
                  {t('admin.saveTeams')}
                </>
              )}
            </button>
          </div>

          {updateTeams.error && (
            <p className="text-xs text-red-400">
              {t('common.error')}: {(updateTeams.error as Error).message}
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <div className="flex flex-1 flex-col items-center gap-1">
              <span className="text-2xl">{getFlagEmoji(match.home_team)}</span>
              <span className="text-center text-xs font-medium text-gray-300">{match.home_team}</span>
              <Stepper value={home} onChange={setHome} disabled={match.is_finished} />
            </div>

            <div className="flex flex-col items-center gap-1">
              <span className="text-xl font-bold text-gray-600">{t('matchCard.vs')}</span>
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
              <span>{t('admin.markFinished')}</span>
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
                  {t('admin.saving')}
                </>
              ) : savedFlash ? (
                <>
                  <Check size={12} />
                  {t('admin.saved')}
                </>
              ) : (
                <>
                  <Save size={12} />
                  {t('admin.saveButton')}
                </>
              )}
            </button>
          </div>
        </>
      )}

      {update.error && (
        <p className="mt-2 text-xs text-red-400">
          {t('common.error')}: {(update.error as Error).message}
        </p>
      )}
    </Card>
  )
}

function TeamSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-2xl">{getFlagEmoji(value)}</span>
      <div className="flex-1">
        <label className="mb-1 block text-[10px] uppercase tracking-wide text-gray-600">
          {label}
        </label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-[#2a2a38] bg-[#22222e] px-2 py-1.5 text-sm text-gray-100 focus:border-green-500 focus:outline-none"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
