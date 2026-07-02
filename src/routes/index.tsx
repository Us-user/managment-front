import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ComingSoon } from '@/components/ComingSoon'
import { NotFoundPage } from '@/routes/NotFoundPage'
import { ErrorPage } from '@/routes/ErrorPage'
import { FormDemoPage } from '@/features/forms/FormDemoPage'
import {
  Home,
  PencilLine,
  User,
  Bell,
  Sparkles,
  BarChart3,
  Trash2,
  Settings,
  CircleDot,
  RefreshCw,
  Layers,
  PanelsTopLeft,
  LogIn,
} from 'lucide-react'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <ComingSoon icon={LogIn} title="Login" subtitle="Sign in to your account." />,
  },
  {
    path: '/',
    element: <AppShell />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <ComingSoon icon={Home} title="Home" subtitle="Your workspace overview will live here." /> },
      { path: 'drafts', element: <ComingSoon icon={PencilLine} title="Drafts" subtitle="Unsaved work items you started." /> },
      { path: 'your-work', element: <ComingSoon icon={User} title="Your Work" subtitle="Everything assigned to you, in one place." /> },
      { path: 'notifications', element: <ComingSoon icon={Bell} title="Notifications" subtitle="Mentions, assignments, and updates." /> },
      { path: 'ai', element: <ComingSoon icon={Sparkles} title="AI" subtitle="Your AI assistant panel. Interface only for now." /> },
      { path: 'analytics', element: <ComingSoon icon={BarChart3} title="Analytics" subtitle="Charts and reports across your projects." /> },
      { path: 'trash', element: <ComingSoon icon={Trash2} title="Trash" subtitle="Deleted items you can restore." /> },
      { path: 'settings', element: <ComingSoon icon={Settings} title="Settings" subtitle="Profile, workspace, and project settings." /> },
      { path: 'profile', element: <ComingSoon icon={User} title="Profile" subtitle="Your account details and preferences." /> },
      { path: 'projects/:id/work-items', element: <ComingSoon icon={CircleDot} title="Work Items" subtitle="Tasks, board and list views for this project." /> },
      { path: 'projects/:id/cycles', element: <ComingSoon icon={RefreshCw} title="Cycles" subtitle="Time-boxed sprints with progress tracking." /> },
      { path: 'projects/:id/modules', element: <ComingSoon icon={Layers} title="Modules" subtitle="Group work by feature or deliverable." /> },
      { path: 'projects/:id/views', element: <ComingSoon icon={PanelsTopLeft} title="Views" subtitle="Saved filtered views for this project." /> },
      { path: 'projects-list', element: <ComingSoon icon={Layers} title="Projects" subtitle="All workspace projects." /> },
      { path: 'more', element: <ComingSoon icon={BarChart3} title="More" subtitle="Additional workspace features." /> },
      { path: 'forms', element: <FormDemoPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
