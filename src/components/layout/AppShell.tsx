import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/features/sidebar/Sidebar'
import { Topbar } from '@/features/topbar/Topbar'
import { Sheet, SheetContent } from '@/components/ui/sheet'

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-[248px] md:shrink-0 md:flex-col border-r border-sidebar-border bg-sidebar">
        <Sidebar />
      </aside>

      {/* Mobile sidebar Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-[248px] p-0 bg-sidebar border-r border-sidebar-border">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
