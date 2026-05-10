import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Users, LogIn, Trophy } from 'lucide-react'
import { useMyGroups } from '@/hooks/useGroups'
import { useAuthContext } from '@/features/auth/AuthContext'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { CreateGroupModal } from '../components/CreateGroupModal'
import { JoinGroupModal } from '../components/JoinGroupModal'

export function DashboardPage() {
  const { profile } = useAuthContext()
  const { data: groups, isLoading } = useMyGroups()
  const navigate = useNavigate()
  const [showCreate, setShowCreate] = useState(false)
  const [showJoin, setShowJoin] = useState(false)

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">
            Hola, {profile?.username ?? '👋'}
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">Tus quinielas del Mundial 2026</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={() => setShowJoin(true)}>
            <LogIn size={15} />
            Unirse
          </Button>
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus size={15} />
            Crear
          </Button>
        </div>
      </div>

      {/* Groups list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-[#111117]" />
          ))}
        </div>
      ) : groups && groups.length > 0 ? (
        <div className="space-y-3">
          {groups.map((group) => (
            <Card
              key={group.id}
              hover
              padding="md"
              onClick={() => navigate(`/groups/${group.id}`)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-700/20 border border-green-500/20">
                    <Trophy size={20} className="text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-100">{group.name}</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Código: <span className="font-mono text-gray-400">{group.invite_code}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {group.created_by === profile?.id && (
                    <Badge variant="green">Admin</Badge>
                  )}
                  <Users size={16} className="text-gray-600" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card padding="lg" className="text-center">
          <Trophy size={40} className="mx-auto mb-3 text-gray-700" />
          <p className="font-medium text-gray-400">No tenés quinielas todavía</p>
          <p className="mt-1 text-sm text-gray-600">
            Creá una o unite a la de un amigo
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Button variant="secondary" onClick={() => setShowJoin(true)}>
              <LogIn size={15} />
              Unirse
            </Button>
            <Button onClick={() => setShowCreate(true)}>
              <Plus size={15} />
              Crear quiniela
            </Button>
          </div>
        </Card>
      )}

      <CreateGroupModal open={showCreate} onClose={() => setShowCreate(false)} />
      <JoinGroupModal open={showJoin} onClose={() => setShowJoin(false)} />
    </div>
  )
}
