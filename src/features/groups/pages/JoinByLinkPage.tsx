import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate, Navigate, Link } from 'react-router-dom'
import { Trophy, AlertCircle, Loader2 } from 'lucide-react'
import { useAuthContext } from '@/features/auth/AuthContext'
import { useJoinGroup } from '@/hooks/useGroups'
import { Button } from '@/components/ui/Button'

export function JoinByLinkPage() {
  const { code } = useParams<{ code: string }>()
  const { session, loading } = useAuthContext()
  const navigate = useNavigate()
  const joinGroup = useJoinGroup()
  const attemptedRef = useRef(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (loading || !session || !code || attemptedRef.current) return
    attemptedRef.current = true
    joinGroup
      .mutateAsync(code)
      .then((group) => navigate(`/groups/${group.id}`, { replace: true }))
      .catch((err: Error) => setError(err.message || 'No pudimos unirte a la quiniela'))
  }, [loading, session, code, joinGroup, navigate])

  if (loading) return <Screen message="Verificando sesión..." />

  if (!code) return <Navigate to="/dashboard" replace />

  if (!session) return <Navigate to={`/auth?next=/join/${code}`} replace />

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0e] p-4">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
          <AlertCircle size={32} />
        </div>
        <h1 className="mb-2 text-xl font-semibold text-gray-100">No pudimos unirte</h1>
        <p className="mb-6 max-w-sm text-center text-sm text-gray-500">{error}</p>
        <Link to="/dashboard">
          <Button variant="secondary">Volver al dashboard</Button>
        </Link>
      </div>
    )
  }

  return <Screen message="Uniéndote a la quiniela..." />
}

function Screen({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0e] p-4">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-700 shadow-lg shadow-green-500/30">
        <Trophy size={32} className="text-white" />
      </div>
      <div className="flex items-center gap-3 text-gray-400">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">{message}</span>
      </div>
    </div>
  )
}
