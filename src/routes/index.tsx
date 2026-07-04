import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ComingSoon } from '@/components/ComingSoon'
import { NotFoundPage } from '@/routes/NotFoundPage'
import { ErrorPage } from '@/routes/ErrorPage'
import { AuthPage } from '@/features/auth/AuthPage'
import { ProtectedRoute, WorkspaceRoute } from '@/features/auth/ProtectedRoute'
import { CreateWorkspacePage } from '@/features/onboarding/CreateWorkspacePage'
import { InviteMembersPage } from '@/features/onboarding/InviteMembersPage'
import { SettingsLayout } from '@/features/settings/SettingsLayout'
import { MembersPage } from '@/features/settings/MembersPage'
import { GeneralPage } from '@/features/settings/GeneralPage'
import { ProjectsPage } from '@/features/projects/ProjectsPage'
import { ProjectSettingsLayout } from '@/features/projects/ProjectSettingsLayout'
import { ProjectGeneralPage } from '@/features/projects/ProjectGeneralPage'
import { ProjectLabelsPage } from '@/features/projects/ProjectLabelsPage'
import { WorkItemsPage } from '@/features/work-items/WorkItemsPage'
import { WorkspaceInvitesPage } from '@/features/invitations/WorkspaceInvitesPage'
import { NotificationsPage } from '@/features/notifications/NotificationsPage'
import {
  Home,
  PencilLine,
  User,
  Sparkles,
  BarChart3,
  Trash2,
  Settings,
  RefreshCw,
  Layers,
  PanelsTopLeft,
} from 'lucide-react'

// The settings pages that aren't built yet — each renders inside SettingsLayout.
const SETTINGS_SOON = [
  'billing',
  'imports',
  'exports',
  'worklogs',
  'identity',
  'projects',
  'integrations',
  'connections',
  'teamspaces',
  'wiki',
  'initiatives',
  'customers',
].map((path) => ({
  path,
  element: (
    <ComingSoon
      icon={Settings}
      title={path[0].toUpperCase() + path.slice(1)}
      subtitle="This settings section is coming soon."
    />
  ),
}))

// Project-settings sections without a real page yet.
const PROJECT_SETTINGS_SOON = [
  'members',
  'worklogs',
  'cycles',
  'modules',
  'views',
  'pages',
  'intake',
  'time-tracking',
  'milestones',
  'updates',
  'states',
  'estimates',
].map((path) => ({
  path,
  element: (
    <ComingSoon
      icon={Settings}
      title={path[0].toUpperCase() + path.slice(1)}
      subtitle="This project setting is coming soon."
    />
  ),
}))

export const router = createBrowserRouter([
  { path: '/login', element: <AuthPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/onboarding/workspace', element: <CreateWorkspacePage /> },
      { path: '/onboarding/members', element: <InviteMembersPage /> },
    ],
  },
  {
    element: <WorkspaceRoute />,
    children: [
      {
        path: '/settings',
        element: <SettingsLayout />,
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Navigate to="general" replace /> },
          { path: 'general', element: <GeneralPage /> },
          { path: 'members', element: <MembersPage /> },
          ...SETTINGS_SOON,
        ],
      },
      {
        path: '/projects/:projectId/settings',
        element: <ProjectSettingsLayout />,
        errorElement: <ErrorPage />,
        children: [
          { index: true, element: <Navigate to="general" replace /> },
          { path: 'general', element: <ProjectGeneralPage /> },
          { path: 'labels', element: <ProjectLabelsPage /> },
          ...PROJECT_SETTINGS_SOON,
        ],
      },
      {
        path: '/',
        element: <AppShell />,
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: (
              <ComingSoon
                icon={Home}
                title="Home"
                subtitle="Your workspace overview will live here."
              />
            ),
          },
          {
            path: 'drafts',
            element: (
              <ComingSoon
                icon={PencilLine}
                title="Drafts"
                subtitle="Unsaved work items you started."
              />
            ),
          },
          {
            path: 'your-work',
            element: (
              <ComingSoon
                icon={User}
                title="Your Work"
                subtitle="Everything assigned to you, in one place."
              />
            ),
          },
          { path: 'notifications', element: <NotificationsPage /> },
          {
            path: 'ai',
            element: (
              <ComingSoon
                icon={Sparkles}
                title="AI"
                subtitle="Your AI assistant panel. Interface only for now."
              />
            ),
          },
          {
            path: 'analytics',
            element: (
              <ComingSoon
                icon={BarChart3}
                title="Analytics"
                subtitle="Charts and reports across your projects."
              />
            ),
          },
          {
            path: 'trash',
            element: (
              <ComingSoon
                icon={Trash2}
                title="Trash"
                subtitle="Deleted items you can restore."
              />
            ),
          },
          // Canonical path — the backend's invite emails link here.
          { path: 'invitations', element: <WorkspaceInvitesPage /> },
          // Back-compat with the old placeholder link.
          {
            path: 'workspace-invites',
            element: <Navigate to="/invitations" replace />,
          },
          {
            path: 'profile',
            element: (
              <ComingSoon
                icon={User}
                title="Profile"
                subtitle="Your account details and preferences."
              />
            ),
          },
          { path: 'projects/:id/work-items', element: <WorkItemsPage /> },
          {
            path: 'projects/:id/cycles',
            element: (
              <ComingSoon
                icon={RefreshCw}
                title="Cycles"
                subtitle="Time-boxed sprints with progress tracking."
              />
            ),
          },
          {
            path: 'projects/:id/modules',
            element: (
              <ComingSoon
                icon={Layers}
                title="Modules"
                subtitle="Group work by feature or deliverable."
              />
            ),
          },
          {
            path: 'projects/:id/views',
            element: (
              <ComingSoon
                icon={PanelsTopLeft}
                title="Views"
                subtitle="Saved filtered views for this project."
              />
            ),
          },
          { path: 'projects-list', element: <ProjectsPage /> },
          {
            path: 'more',
            element: (
              <ComingSoon
                icon={BarChart3}
                title="More"
                subtitle="Additional workspace features."
              />
            ),
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
