import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DashboardStore {
  commandPaletteOpen: boolean;
  openCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;

  sidebarCollapsed: boolean;
  setSidebarCollapsed: (c: boolean) => void;

  activeWidgets: string[];
  toggleWidget: (id: string) => void;

  // Modal Management
  activeModal: "task" | "goal" | "habit" | "finance" | "gym" | "reading" | "note" | "meeting" | null;
  openModal: (modal: "task" | "goal" | "habit" | "finance" | "gym" | "reading" | "note" | "meeting" | null) => void;
  closeModal: () => void;

  pomodoroRunning: boolean;
  pomodoroMinutes: number;
  pomodoroSeconds: number;
  pomodoroType: "work" | "break" | "long";
  setPomodoroRunning: (r: boolean) => void;
  setPomodoroTime: (m: number, s: number) => void;
  setPomodoroType: (t: "work" | "break" | "long") => void;
}

const DEFAULT_WIDGETS = [
  "coding", "tasks", "goals", "habits", "finances",
  "gym", "reading", "notes", "analytics",
];

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      commandPaletteOpen: false,
      openCommandPalette: () => set({ commandPaletteOpen: true }),
      setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

      sidebarCollapsed: false,
      setSidebarCollapsed: (c) => set({ sidebarCollapsed: c }),

      activeWidgets: DEFAULT_WIDGETS,
      toggleWidget: (id) =>
        set((state) => ({
          activeWidgets: state.activeWidgets.includes(id)
            ? state.activeWidgets.filter((w) => w !== id)
            : [...state.activeWidgets, id],
        })),

      activeModal: null,
      openModal: (modal) => set({ activeModal: modal }),
      closeModal: () => set({ activeModal: null }),

      pomodoroRunning: false,
      pomodoroMinutes: 25,
      pomodoroSeconds: 0,
      pomodoroType: "work",
      setPomodoroRunning: (r) => set({ pomodoroRunning: r }),
      setPomodoroTime: (m, s) => set({ pomodoroMinutes: m, pomodoroSeconds: s }),
      setPomodoroType: (t) => set({ pomodoroType: t }),
    }),
    {
      name: "devlife-dashboard",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        activeWidgets: state.activeWidgets,
      }),
    }
  )
);
