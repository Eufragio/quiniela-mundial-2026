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

export function useUpdateGroupRules(groupId: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (rules: string) => {
      const { error } = await supabase
        .from('groups')
        .update({ rules: rules.trim() || null })
        .eq('id', groupId)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['group', groupId] })
      qc.invalidateQueries({ queryKey: ['groups'] })
    },
  })
}

const LOGO_ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp']
const LOGO_MAX_BYTES = 500 * 1024

export function useUploadGroupLogo(groupId: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (file: File) => {
      if (!LOGO_ALLOWED_TYPES.includes(file.type)) {
        throw new Error('Formato no soportado. Usá PNG, JPEG o WEBP.')
      }
      if (file.size > LOGO_MAX_BYTES) {
        throw new Error('La imagen pesa más de 500 KB. Comprimila o usá una más chica.')
      }

      const { data: existing, error: listError } = await supabase.storage
        .from('group-logos')
        .list(groupId)
      if (listError) throw listError

      if (existing && existing.length > 0) {
        const paths = existing.map((f) => `${groupId}/${f.name}`)
        const { error: removeError } = await supabase.storage
          .from('group-logos')
          .remove(paths)
        if (removeError) throw removeError
      }

      const ext = (file.name.split('.').pop() ?? 'png').toLowerCase()
      const path = `${groupId}/logo.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('group-logos')
        .upload(path, file, { upsert: true, contentType: file.type })
      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('group-logos')
        .getPublicUrl(path)
      const publicUrl = `${urlData.publicUrl}?v=${Date.now()}`

      const { error: updateError } = await supabase
        .from('groups')
        .update({ logo_url: publicUrl })
        .eq('id', groupId)
      if (updateError) throw updateError

      return publicUrl
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['group', groupId] })
      qc.invalidateQueries({ queryKey: ['groups'] })
    },
  })
}

export function useRemoveGroupLogo(groupId: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { data: existing } = await supabase.storage
        .from('group-logos')
        .list(groupId)

      if (existing && existing.length > 0) {
        const paths = existing.map((f) => `${groupId}/${f.name}`)
        await supabase.storage.from('group-logos').remove(paths)
      }

      const { error } = await supabase
        .from('groups')
        .update({ logo_url: null })
        .eq('id', groupId)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['group', groupId] })
      qc.invalidateQueries({ queryKey: ['groups'] })
    },
  })
}

export function useJoinGroup() {
  const { user } = useAuthContext()
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (inviteCode: string) => {
      if (!user) throw new Error('Not authenticated')

      const { data: groupId, error } = await supabase
        .rpc('join_group_by_code', { p_code: inviteCode.toUpperCase() })

      if (error) {
        if (error.message.includes('invalid_code')) {
          throw new Error('Código de invitación inválido')
        }
        if (error.message.includes('not_authenticated')) {
          throw new Error('Sesión expirada, volvé a iniciar')
        }
        throw error
      }

      const { data: group, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single()
      if (groupError) throw groupError

      return group as Group
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['groups'] }),
  })
}
