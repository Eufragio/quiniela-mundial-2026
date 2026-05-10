import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthContext } from '@/features/auth/AuthContext'
import type { Prediction } from '@/types'

export function useGroupPredictions(groupId: string) {
  const { user } = useAuthContext()

  return useQuery({
    queryKey: ['predictions', groupId, user?.id],
    enabled: !!groupId && !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('group_id', groupId)
        .eq('user_id', user!.id)
      if (error) throw error

      // Map by match_id for easy lookup
      const byMatch: Record<string, Prediction> = {}
      for (const p of data ?? []) byMatch[p.match_id] = p as Prediction
      return byMatch
    },
  })
}

export function useAllGroupPredictions(groupId: string) {
  return useQuery({
    queryKey: ['predictions', groupId, 'all'],
    enabled: !!groupId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('predictions')
        .select('*, profile:profiles(username, avatar_url)')
        .eq('group_id', groupId)
      if (error) throw error
      return data as (Prediction & { profile: { username: string; avatar_url: string | null } })[]
    },
  })
}

export function useSavePrediction(groupId: string) {
  const { user } = useAuthContext()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({
      matchId,
      homeScore,
      awayScore,
      existingId,
    }: {
      matchId: string
      homeScore: number
      awayScore: number
      existingId?: string
    }) => {
      if (!user) throw new Error('Not authenticated')

      if (existingId) {
        const { error } = await supabase
          .from('predictions')
          .update({ home_score: homeScore, away_score: awayScore })
          .eq('id', existingId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('predictions')
          .insert({
            user_id: user.id,
            match_id: matchId,
            group_id: groupId,
            home_score: homeScore,
            away_score: awayScore,
          })
        if (error) throw error
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['predictions', groupId] })
    },
  })
}
