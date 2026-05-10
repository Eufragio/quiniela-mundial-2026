import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { LeaderboardEntry } from '@/types'
import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export function useLeaderboard(groupId: string) {
  const qc = useQueryClient()

  // Suscripción en tiempo real a predicciones
  useEffect(() => {
    if (!groupId) return
    const channel = supabase
      .channel(`leaderboard:${groupId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'predictions', filter: `group_id=eq.${groupId}` },
        () => qc.invalidateQueries({ queryKey: ['leaderboard', groupId] }),
      )
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [groupId, qc])

  return useQuery({
    queryKey: ['leaderboard', groupId],
    enabled: !!groupId,
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_leaderboard', { p_group_id: groupId })
      if (error) throw error
      return (data ?? []).map((entry, idx) => ({
        ...entry,
        rank: idx + 1,
      })) as LeaderboardEntry[]
    },
    staleTime: 1000 * 30,
  })
}
