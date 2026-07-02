import { useNavigate } from 'react-router-dom'
import {
  Search,
  HelpCircle,
  Bell,
  ChevronDown,
  Menu,
  User,
  LogIn,
  LogOut,
  Sun,
  Moon,
  Plus,
  Check,
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme } from '@/contexts/ThemeContext'

interface TopbarProps {
  onMenuClick: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()

  return (
    <header className="flex h-[46px] shrink-0 items-center border-b border-border bg-card px-3 gap-2">
      {/* Mobile hamburger */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden h-8 w-8 shrink-0"
        onClick={onMenuClick}
      >
        <Menu size={18} />
      </Button>

      {/* Workspace switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 hover:bg-muted transition-colors">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary text-[11px] font-bold text-primary-foreground">
              A
            </div>
            <span className="hidden text-sm font-medium md:block">Alfa-bots</span>
            <ChevronDown size={13} className="hidden text-muted-foreground md:block" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-60">
          {/* Current workspace header */}
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              A
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">Alfa-bots</p>
              <p className="truncate text-xs text-muted-foreground">abdullohkh2000@gmail.com</p>
            </div>
            <Check size={14} className="shrink-0 text-primary" />
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Plus size={14} className="mr-2 text-muted-foreground" />
            Create workspace
          </DropdownMenuItem>
          <DropdownMenuItem>
            <User size={14} className="mr-2 text-muted-foreground" />
            Switch workspace
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive" onClick={() => navigate('/login')}>
            <LogOut size={14} className="mr-2" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Centered search */}
      <div className="flex flex-1 justify-center">
        <div className="relative w-full max-w-md">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            className="h-8 w-full rounded-full border-border bg-muted pl-8 text-sm placeholder:text-muted-foreground focus-visible:ring-1"
            placeholder="Search"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex shrink-0 items-center gap-0.5">
        {/* Theme toggle — single icon, shows what clicking will switch TO */}
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        <button className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors">
          <HelpCircle size={15} />
        </button>
        <button
          onClick={() => navigate('/notifications')}
          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors"
        >
          <Bell size={15} />
        </button>

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-purple-600 text-xs font-semibold text-white">
                  A
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-foreground">Abdulloh</p>
              <p className="truncate text-xs text-muted-foreground">abdullohkh2000@gmail.com</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User size={14} className="mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/login')}>
              <LogIn size={14} className="mr-2" />
              Login
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut size={14} className="mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
