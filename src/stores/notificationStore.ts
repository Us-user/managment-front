import { create } from 'zustand'

// Shared unread badge count. The Topbar polls the backend and writes here; the
// NotificationsPage also updates it as the user reads items, so the bell badge
// stays in sync without prop-drilling or a second fetch.
interface NotificationState {
  unreadCount: number
  setUnreadCount: (n: number) => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  unreadCount: 0,
  setUnreadCount: (unreadCount) => set({ unreadCount }),
}))
