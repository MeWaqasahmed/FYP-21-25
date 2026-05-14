import { create } from 'zustand';

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  notifications: [],
  activeModal: null,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  clearNotifications: () => set({ notifications: [] }),

  setActiveModal: (modal) => set({ activeModal: modal }),

  closeModal: () => set({ activeModal: null }),
}));
