import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuthContext } from '@/features/auth/AuthContext'
import type { Group, GroupMember } from '@/types'

export function useMyGroups() {
  const { user } = useAuthContext()

  return useQuery({
    queryKey: ['groups', user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_members')
        .select('group_id, groups(*)')
        .eq('user_id', user!.id)
        .order('joined_at', { ascending: false })

      if (error) throw error
      return (data?.map((d) => d.groups).filter(Boolean) ?? []) as Group[]
    },
  })
}

export function useGroup(groupId: string) {
  return useQuery({
    queryKey: ['group', groupId],
    enabled: !!groupId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single()
      if (error) throw error
      return data as Group
    },
  })
}

export function useGroupMembers(groupId: string) {
  return useQuery({
    queryKey: ['group-members', groupId],
    enabled: !!groupId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('group_members')
        .select('*, profile:profiles(*)')
        .eq('group_id', groupId)
        .order('joined_at', { ascending: true })
      if (error) throw error
      return data as (GroupMember & { profile: { username: string; avatar_url: string | null } })[]
    },
  })
}

export function useCreateGroup() {
  const { user } = useAuthContext()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (name: string) => {
      if (!user) throw new Error('Not authenticated')

      const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert({ name, created_by: user.id })
        .select()
        .single()
      if (groupError) throw groupError

      const { error: memberError } = await supabase
        .from('group_members')
        .insert({ group_id: group.id, user_id: user.id })
      if (memberError) throw memberError

      return group as Group
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['groups'] }),
  })
}

export function useJoinGroup() {
  const { user } = useAuthContext()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (inviteCode: string) => {
      if (!user) throw new Error('Not authenticated')

      const { data: group, error: findError } = await supabase
        .from('groups')
        .select('*')
        .eq('invite_code', inviteCode.toUpperCase())
        .single()
      if (findError) throw new Error('Código de invitación inválido')

      const { error: joinError } = await supabase
        .from('group_members')
        .insert({ group_id: group.id, user_id: user.id })
      if (joinError) {
        if (joinError.code === '23505') throw new Error('Ya sos miembro de esta quiniela')
        throw joinError
      }

      return group as Group
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['groups'] }),
  })
}
