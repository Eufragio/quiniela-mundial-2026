import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { BottomNav } from './BottomNav'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0e]">
      <Navbar />
      <main className="flex-1 pb-20 sm:pb-6">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
