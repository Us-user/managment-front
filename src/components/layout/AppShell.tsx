import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/features/sidebar/Sidebar'
import { Topbar } from '@/features/topbar/Topbar'

export function AppShell() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar — hidden on mobile, fixed 248px on md+ */}
      <aside className="hidden md:flex md:w-[248px] md:shrink-0 md:flex-col border-r border-sidebar-border bg-sidebar">
        <Sidebar />
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
