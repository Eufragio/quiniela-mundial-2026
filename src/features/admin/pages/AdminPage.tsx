import { useMemo, useState } from 'react'
import { Shield, Filter } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useMatches } from '@/hooks/useMatches'
import { Card } from '@/components/ui/Card'
import { AdminMatchRow } from '@/features/admin/components/AdminMatchRow'
import { PHASES, type Phase } from '@/types'

type StatusFilter = 'all' | 'pending' | 'finished'

export function AdminPage() {
  const { t } = useTranslation()
  const [phase, setPhase] = useState<Phase | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const { data: matches, isLoading } = useMatches(phase === 'all' ? undefined : phase)

  const filtered = useMemo(() => {
    if (!matches) return []
    if (statusFilter === 'pending') return matches.filter((m) => !m.is_finished)
    if (statusFilter === 'finished') return matches.filter((m) => m.is_finished)
    return matches
  }, [matches, statusFilter])

  const stats = useMemo(() => {
    if (!matches) return { total: 0, finished: 0, pending: 0 }
    const finished = matches.filter((m) => m.is_finished).length
    return { total: matches.length, finished, pending: matches.length - finished }
  }, [matches])

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/15 text-yellow-400">
          <Shield size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-100">{t('admin.title')}</h1>
          <p className="text-xs text-gray-500">{t('admin.subtitle')}</p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2">
        <Card padding="sm" className="text-center">
          <p className="text-xs text-gray-500">{t('admin.statTotal')}</p>
          <p className="text-xl font-bold text-gray-100">{stats.total}</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-xs text-gray-500">{t('admin.statFinished')}</p>
          <p className="text-xl font-bold text-green-400">{stats.finished}</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-xs text-gray-500">{t('admin.statPending')}</p>
          <p className="text-xl font-bold text-yellow-400">{stats.pending}</p>
        </Card>
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Filter size={12} />
          <span>{t('admin.filters')}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <FilterChip active={phase === 'all'} onClick={() => setPhase('all')}>
            {t('admin.allPhases')}
          </FilterChip>
          {PHASES.map((p) => (
            <FilterChip key={p} active={phase === p} onClick={() => setPhase(p)}>
              {t(`phases.${p}`)}
            </FilterChip>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <FilterChip
            active={statusFilter === 'all'}
            onClick={() => setStatusFilter('all')}
            tone="neutral"
          >
            {t('admin.allStatus')}
          </FilterChip>
          <FilterChip
            active={statusFilter === 'pending'}
            onClick={() => setStatusFilter('pending')}
            tone="yellow"
          >
            {t('admin.statPending')}
          </FilterChip>
          <FilterChip
            active={statusFilter === 'finished'}
            onClick={() => setStatusFilter('finished')}
            tone="green"
          >
            {t('admin.statFinished')}
          </FilterChip>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <Card padding="md" className="text-center">
          <p className="text-sm text-gray-500">{t('admin.noResults')}</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => (
            <AdminMatchRow key={m.id} match={m} />
          ))}
        </div>
      )}
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
  tone = 'neutral',
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  tone?: 'neutral' | 'green' | 'yellow'
}) {
  const activeClass =
    tone === 'green'
      ? 'bg-green-500/20 text-green-300 border-green-500/30'
      : tone === 'yellow'
      ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      : 'bg-green-500/20 text-green-300 border-green-500/30'

  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? activeClass
          : 'border-[#2a2a38] bg-[#1a1a22] text-gray-400 hover:text-gray-200'
      }`}
    >
      {children}
    </button>
  )
}
