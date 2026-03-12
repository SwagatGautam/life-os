"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, CheckSquare, Target, Flame, DollarSign,
  Dumbbell, BookOpen, FileText, Video, BarChart2,
  Plus, Settings, LogOut, Search, Zap
} from "lucide-react";
import { useDashboardStore } from "@/store/dashboard-store";

const COMMANDS = [
  { group: "Navigate", items: [
    { icon: LayoutDashboard, label: "Dashboard", shortcut: "D", href: "/dashboard" },
    { icon: CheckSquare, label: "Tasks & Kanban", shortcut: "T", href: "/dashboard/tasks" },
    { icon: Target, label: "Goals & Milestones", shortcut: "G", href: "/dashboard/goals" },
    { icon: Flame, label: "Habits & Pomodoro", shortcut: "H", href: "/dashboard/habits" },
    { icon: DollarSign, label: "Finances", shortcut: "F", href: "/dashboard/finances" },
    { icon: Dumbbell, label: "Gym Tracker", href: "/dashboard/gym" },
    { icon: BookOpen, label: "Reading Tracker", href: "/dashboard/reading" },
    { icon: FileText, label: "Notes & Wiki", href: "/dashboard/notes" },
    { icon: Video, label: "Meetings", href: "/dashboard/meetings" },
    { icon: BarChart2, label: "Analytics", href: "/dashboard/analytics" },
  ]},
  { group: "Create", items: [
    { icon: Plus, label: "New Task", action: "new-task" },
    { icon: Plus, label: "New Goal", action: "new-goal" },
    { icon: Plus, label: "New Habit", action: "new-habit" },
    { icon: Plus, label: "Start Meeting", action: "new-meeting" },
    { icon: Plus, label: "New Note", action: "new-note" },
  ]},
  { group: "Account", items: [
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
    { icon: Zap, label: "Upgrade to Pro", href: "/pricing" },
    { icon: LogOut, label: "Sign Out", action: "signout" },
  ]},
];

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useDashboardStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === "Escape") {
        setCommandPaletteOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setCommandPaletteOpen]);

  const handleSelect = (item: { href?: string; action?: string }) => {
    setCommandPaletteOpen(false);
    if (item.href) {
      router.push(item.href);
    }
    // Actions handled by store/events
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={() => setCommandPaletteOpen(false)}
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15 }}
              className="w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Command
                className="bg-popover rounded-2xl border border-border shadow-2xl overflow-hidden"
                style={{ boxShadow: "0 0 60px rgba(0,212,255,0.1), 0 25px 50px rgba(0,0,0,0.5)" }}
              >
                <div className="flex items-center gap-3 px-4 border-b border-border">
                  <Search size={16} className="text-muted-foreground flex-shrink-0" />
                  <Command.Input
                    placeholder="Search commands, navigate, create..."
                    className="flex-1 py-4 bg-transparent text-base outline-none placeholder:text-muted-foreground"
                    autoFocus
                  />
                  <kbd className="hidden sm:block text-[10px] border border-border rounded px-1.5 py-0.5 text-muted-foreground">
                    ESC
                  </kbd>
                </div>

                <Command.List className="max-h-96 overflow-y-auto p-2 custom-scrollbar">
                  <Command.Empty className="py-8 text-center text-sm text-muted-foreground">
                    No commands found.
                  </Command.Empty>

                  {COMMANDS.map((group) => (
                    <Command.Group
                      key={group.group}
                      heading={group.group}
                      className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider"
                    >
                      {group.items.map((item) => (
                        <Command.Item
                          key={item.label}
                          value={item.label}
                          onSelect={() => handleSelect(item)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-sm transition-colors aria-selected:bg-primary/10 aria-selected:text-primary hover:bg-secondary/80"
                        >
                          <item.icon size={16} className="flex-shrink-0 text-muted-foreground aria-selected:text-primary" />
                          <span className="flex-1">{item.label}</span>
                          {"shortcut" in item && item.shortcut && (
                            <kbd className="text-[10px] border border-border rounded px-1.5 py-0.5 text-muted-foreground">
                              {item.shortcut}
                            </kbd>
                          )}
                        </Command.Item>
                      ))}
                    </Command.Group>
                  ))}
                </Command.List>

                <div className="p-2 border-t border-border flex items-center gap-4 text-xs text-muted-foreground px-4">
                  <span className="flex items-center gap-1"><kbd className="border border-border rounded px-1">↑↓</kbd> navigate</span>
                  <span className="flex items-center gap-1"><kbd className="border border-border rounded px-1">↵</kbd> select</span>
                  <span className="flex items-center gap-1"><kbd className="border border-border rounded px-1">esc</kbd> close</span>
                </div>
              </Command>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
