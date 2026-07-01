import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { SidebarRail } from '@/features/sidebar/SidebarRail'
import { SidebarPanel } from '@/features/sidebar/SidebarPanel'
import { Topbar } from '@/features/topbar/Topbar'
import { Sheet, SheetContent } from '@/components/ui/sheet'

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white">
      <Topbar onMenuClick={() => setMobileOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop: icon rail + panel */}
        <SidebarRail className="hidden md:flex" />
        <SidebarPanel className="hidden md:flex" />

        {/* Mobile sheet */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="flex w-auto gap-0 p-0">
            <SidebarRail />
            <SidebarPanel />
          </SheetContent>
        </Sheet>

        <main className="flex-1 overflow-y-auto bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
