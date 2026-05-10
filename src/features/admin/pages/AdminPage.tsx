import { useMemo, useState } from 'react'
import { Shield, Filter } from 'lucide-react'
import { useMatches } from '@/hooks/useMatches'
import { getPhaseLabel } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { AdminMatchRow } from '@/features/admin/components/AdminMatchRow'
import type { Phase } from '@/types'

type StatusFilter = 'all' | 'pending' | 'finished'

const PHASES: Phase[] = [
  'group_stage',
  'round_of_32',
  'round_of_16',
  'quarterfinal',
  'semifinal',
  'third_place',
  'final',
]

export function AdminPage() {
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
          <h1 className="text-2xl font-bold text-gray-100">Panel de admin</h1>
          <p className="text-xs text-gray-500">Cargá los resultados oficiales del Mundial</p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2">
        <Card padding="sm" className="text-center">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-xl font-bold text-gray-100">{stats.total}</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-xs text-gray-500">Finalizados</p>
          <p className="text-xl font-bold text-green-400">{stats.finished}</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-xs text-gray-500">Pendientes</p>
          <p className="text-xl font-bold text-yellow-400">{stats.pending}</p>
        </Card>
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Filter size={12} />
          <span>Filtros</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <FilterChip active={phase === 'all'} onClick={() => setPhase('all')}>
            Todas las fases
          </FilterChip>
          {PHASES.map((p) => (
            <FilterChip key={p} active={phase === p} onClick={() => setPhase(p)}>
              {getPhaseLabel(p)}
            </FilterChip>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5">
          <FilterChip
            active={statusFilter === 'all'}
            onClick={() => setStatusFilter('all')}
            tone="neutral"
          >
            Todos
          </FilterChip>
          <FilterChip
            active={statusFilter === 'pending'}
            onClick={() => setStatusFilter('pending')}
            tone="yellow"
          >
            Pendientes
          </FilterChip>
          <FilterChip
            active={statusFilter === 'finished'}
            onClick={() => setStatusFilter('finished')}
            tone="green"
          >
            Finalizados
          </FilterChip>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <Card padding="md" className="text-center">
          <p className="text-sm text-gray-500">No hay partidos con esos filtros.</p>
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
