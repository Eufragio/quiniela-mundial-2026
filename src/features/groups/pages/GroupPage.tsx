import { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Share2, Users, Copy, Check, List, Trophy, ScrollText, ImagePlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useGroup, useGroupMembers } from '@/hooks/useGroups'
import { useMatches } from '@/hooks/useMatches'
import { useGroupPredictions } from '@/hooks/usePredictions'
import { useAuthContext } from '@/features/auth/AuthContext'
import { MatchCard } from '@/features/matches/components/MatchCard'
import { GroupRulesModal } from '@/features/groups/components/GroupRulesModal'
import { GroupLogoModal } from '@/features/groups/components/GroupLogoModal'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import type { Phase } from '@/types'
import { LeaderboardPage } from '@/features/leaderboard/pages/LeaderboardPage'

type Tab = 'matches' | 'leaderboard'

const PHASES: (Phase | 'all')[] = [
  'group_stage',
  'round_of_32',
  'round_of_16',
  'quarterfinal',
  'semifinal',
  'final',
]

export function GroupPage() {
  const { groupId } = useParams<{ groupId: string }>()
  const { profile } = useAuthContext()
  const { t } = useTranslation()
  const [tab, setTab] = useState<Tab>('matches')
  const [copied, setCopied] = useState(false)
  const [rulesOpen, setRulesOpen] = useState(false)
  const [logoOpen, setLogoOpen] = useState(false)
  const [filterPhase, setFilterPhase] = useState<Phase | 'all'>('group_stage')

  const { data: group, isLoading: groupLoading } = useGroup(groupId!)
  const { data: members } = useGroupMembers(groupId!)
  const { data: matches } = useMatches(filterPhase === 'all' ? undefined : filterPhase)
  const { data: predictions } = useGroupPredictions(groupId!)

  if (groupLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="h-24 animate-pulse rounded-2xl bg-[#111117]" />
      </div>
    )
  }
  if (!group) return <Navigate to="/dashboard" />

  const isAdmin = group.created_by === profile?.id
  const inviteUrl = `${window.location.origin}/join/${group.invite_code}`

  async function copyCode() {
    await navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function share() {
    if (navigator.share) {
      await navigator.share({
        title: t('group.shareTitle', { name: group!.name }),
        text: t('group.shareText'),
        url: inviteUrl,
      })
    } else {
      copyCode()
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-gray-100">{group.name}</h1>
            {isAdmin && <Badge variant="green" size="sm">{t('group.admin')}</Badge>}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-mono text-sm text-gray-500">{group.invite_code}</span>
            <button onClick={copyCode} className="text-gray-600 hover:text-green-400 transition-colors">
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={() => setLogoOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-[#1a1a22] px-3 py-2 text-xs font-medium text-gray-400 hover:text-gray-200 transition-colors border border-[#2a2a38]"
            >
              <ImagePlus size={13} />
              {t('groupLogo.openButton')}
            </button>
          )}
          <button
            onClick={() => setRulesOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[#1a1a22] px-3 py-2 text-xs font-medium text-gray-400 hover:text-gray-200 transition-colors border border-[#2a2a38]"
          >
            <ScrollText size={13} />
            {t('groupRules.openButton')}
          </button>
          <button
            onClick={share}
            className="flex items-center gap-1.5 rounded-xl bg-[#1a1a22] px-3 py-2 text-xs font-medium text-gray-400 hover:text-gray-200 transition-colors border border-[#2a2a38]"
          >
            <Share2 size={13} />
            {t('group.share')}
          </button>
        </div>
      </div>

      {members && members.length > 0 && (
        <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1">
          <Users size={14} className="shrink-0 text-gray-600" />
          {members.map((m) => (
            <div key={m.id} className="flex shrink-0 flex-col items-center gap-0.5" title={m.profile?.username}>
              <Avatar
                username={m.profile?.username ?? '?'}
                avatarUrl={m.profile?.avatar_url}
                size="sm"
              />
            </div>
          ))}
          <span className="text-xs text-gray-600">
            {t(members.length === 1 ? 'group.membersOne' : 'group.membersOther', { count: members.length })}
          </span>
        </div>
      )}

      <div className="mb-4 flex rounded-xl bg-[#111117] border border-[#2a2a38] p-1">
        <button
          onClick={() => setTab('matches')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${
            tab === 'matches' ? 'bg-green-500 text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <List size={15} />
          {t('group.matches')}
        </button>
        <button
          onClick={() => setTab('leaderboard')}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${
            tab === 'leaderboard' ? 'bg-green-500 text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <Trophy size={15} />
          {t('group.leaderboard')}
        </button>
      </div>

      {tab === 'leaderboard' ? (
        <LeaderboardPage groupId={groupId!} />
      ) : (
        <>
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            {PHASES.map((value) => (
              <button
                key={value}
                onClick={() => setFilterPhase(value)}
                className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors ${
                  filterPhase === value
                    ? 'bg-green-500 text-white'
                    : 'bg-[#111117] text-gray-500 hover:text-gray-300 border border-[#2a2a38]'
                }`}
              >
                {t(`phasesShort.${value}`)}
              </button>
            ))}
          </div>

          {matches && matches.length > 0 ? (
            <MatchesByPhase
              matches={matches}
              groupId={groupId!}
              predictions={predictions}
            />
          ) : (
            <div className="rounded-2xl border border-[#2a2a38] bg-[#111117] p-8 text-center">
              <p className="text-gray-500">{t('group.noMatches')}</p>
            </div>
          )}
        </>
      )}

      <GroupRulesModal
        open={rulesOpen}
        onClose={() => setRulesOpen(false)}
        group={group}
        isAdmin={isAdmin}
      />

      <GroupLogoModal
        open={logoOpen}
        onClose={() => setLogoOpen(false)}
        group={group}
      />
    </div>
  )
}

function MatchesByPhase({
  matches,
  groupId,
  predictions,
}: {
  matches: ReturnType<typeof useMatches>['data']
  groupId: string
  predictions: ReturnType<typeof useGroupPredictions>['data']
}) {
  const { t } = useTranslation()
  if (!matches) return null

  const sections = new Map<string, typeof matches>()
  for (const match of matches) {
    const key = match.phase === 'group_stage'
      ? `${t('group.groupLabel')} ${match.group_name}`
      : t(`phases.${match.phase}`)
    const existing = sections.get(key) ?? []
    existing.push(match)
    sections.set(key, existing)
  }

  return (
    <div className="space-y-6">
      {[...sections.entries()].map(([title, sectionMatches]) => (
        <div key={title}>
          <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">
            {title}
          </h3>
          <div className="space-y-3">
            {sectionMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                groupId={groupId}
                prediction={predictions?.[match.id]}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
