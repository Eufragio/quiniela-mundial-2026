import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AuthProvider, useAuthContext } from '@/features/auth/AuthContext'
import { AuthPage } from '@/features/auth/pages/AuthPage'
import { Layout } from '@/components/layout/Layout'
import { DashboardPage } from '@/features/groups/pages/DashboardPage'
import { GroupPage } from '@/features/groups/pages/GroupPage'
import { ProfilePage } from '@/features/profile/pages/ProfilePage'
import { AdminPage } from '@/features/admin/pages/AdminPage'
import { JoinByLinkPage } from '@/features/groups/pages/JoinByLinkPage'
import { PrivacyPage } from '@/features/legal/pages/PrivacyPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 30 },
  },
})

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuthContext()
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0e]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
      </div>
    )
  }
  if (!session) return <Navigate to="/auth" replace />
  return <>{children}</>
}

function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuthContext()
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0e]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
      </div>
    )
  }
  if (!profile?.is_admin) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/join/:code" element={<JoinByLinkPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route
              element={
                <RequireAuth>
                  <Layout />
                </RequireAuth>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/groups/:groupId" element={<GroupPage />} />
              <Route path="/groups/:groupId/leaderboard" element={<GroupPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <AdminPage />
                  </RequireAdmin>
                }
              />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
