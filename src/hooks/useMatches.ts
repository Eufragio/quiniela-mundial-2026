import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Match, Phase } from '@/types'

export function useMatches(phase?: Phase) {
  return useQuery({
    queryKey: ['matches', phase],
    queryFn: async () => {
      let q = supabase
        .from('matches')
        .select('*')
        .order('match_date', { ascending: true })

      if (phase) q = q.eq('phase', phase)

      const { data, error } = await q
      if (error) throw error
      return data as Match[]
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useMatch(matchId: string) {
  return useQuery({
    queryKey: ['match', matchId],
    enabled: !!matchId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .single()
      if (error) throw error
      return data as Match
    },
  })
}

export function useGroupStageMatches() {
  return useQuery({
    queryKey: ['matches', 'group_stage'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .eq('phase', 'group_stage')
        .order('match_date', { ascending: true })
      if (error) throw error
      return data as Match[]
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useUpdateMatchResult() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({
      matchId,
      homeScore,
      awayScore,
      isFinished,
    }: {
      matchId: string
      homeScore: number | null
      awayScore: number | null
      isFinished: boolean
    }) => {
      const { error } = await supabase
        .from('matches')
        .update({
          home_score: homeScore,
          away_score: awayScore,
          is_finished: isFinished,
        })
        .eq('id', matchId)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['matches'] })
      qc.invalidateQueries({ queryKey: ['predictions'] })
      qc.invalidateQueries({ queryKey: ['leaderboard'] })
    },
  })
}

export function useAllMatchesGrouped() {
  return useQuery({
    queryKey: ['matches', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select('*')
        .order('match_date', { ascending: true })
      if (error) throw error
      const matches = data as Match[]

      const grouped: Record<string, Match[]> = {}
      for (const match of matches) {
        const key = match.phase === 'group_stage'
          ? `Grupo ${match.group_name}`
          : match.phase
        if (!grouped[key]) grouped[key] = []
        grouped[key].push(match)
      }
      return grouped
    },
    staleTime: 1000 * 60 * 5,
  })
}
