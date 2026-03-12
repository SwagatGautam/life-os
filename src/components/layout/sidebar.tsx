"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal, LayoutDashboard, CheckSquare, Target, Flame,
  DollarSign, Dumbbell, BookOpen, FileText, Video,
  BarChart2, ChevronLeft, Plus, Settings, Zap,
  Menu, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { User } from "next-auth";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", color: "#00d4ff" },
  { icon: CheckSquare, label: "Tasks", href: "/dashboard/tasks", color: "#a855f7" },
  { icon: Target, label: "Goals", href: "/dashboard/goals", color: "#00ff88" },
  { icon: Flame, label: "Habits", href: "/dashboard/habits", color: "#ff6b35" },
  { icon: DollarSign, label: "Finances", href: "/dashboard/finances", color: "#ffd700" },
  { icon: Dumbbell, label: "Gym", href: "/dashboard/gym", color: "#ff2d78" },
  { icon: BookOpen, label: "Reading", href: "/dashboard/reading", color: "#00d4ff" },
  { icon: FileText, label: "Notes", href: "/dashboard/notes", color: "#a855f7" },
  { icon: Video, label: "Meetings", href: "/dashboard/meetings", color: "#00ff88" },
  { icon: BarChart2, label: "Analytics", href: "/dashboard/analytics", color: "#ff6b35" },
];

export function Sidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-border/50", collapsed && "px-3 justify-center")}>
        <motion.div
          className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center"
          animate={{ boxShadow: ["0 0 8px rgba(0,212,255,0.2)", "0 0 20px rgba(0,212,255,0.4)", "0 0 8px rgba(0,212,255,0.2)"] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Terminal size={18} className="text-primary" />
        </motion.div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="overflow-hidden"
            >
              <p className="font-bold text-sm leading-none gradient-text">DevLife OS</p>
              <p className="text-[10px] text-muted-foreground/70 mt-0.5">v1.0.0</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick add */}
      <div className={cn("p-3", collapsed && "px-2")}>
        <button className={cn(
          "flex items-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
          "bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary",
          collapsed ? "justify-center px-0" : "px-3"
        )}>
          <Plus size={16} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Quick Add
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto custom-scrollbar">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "sidebar-link",
                active && "active",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon
                size={18}
                style={{ color: active ? item.color : undefined }}
                className={cn("flex-shrink-0", !active && "text-muted-foreground")}
              />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-border/50 space-y-1">
        <Link
          href="/dashboard/settings"
          className={cn("sidebar-link", collapsed && "justify-center px-2")}
        >
          <Settings size={18} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Settings
              </motion.span>
            )}
          </AnimatePresence>
        </Link>

        <div className={cn("flex items-center gap-3 px-3 py-2", collapsed && "justify-center px-2")}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={user.image ?? `https://api.dicebear.com/7.x/shapes/svg?seed=${user.email}`}
            alt={user.name ?? "User"}
            className="w-7 h-7 rounded-full flex-shrink-0 ring-1 ring-primary/20"
          />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-w-0"
              >
                <p className="text-xs font-medium truncate">{user.name ?? "Developer"}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-4 left-4 z-50 w-9 h-9 bg-card border border-border rounded-lg flex items-center justify-center"
      >
        {mobileOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="md:hidden fixed left-0 top-0 h-full w-64 z-50 bg-background border-r border-border"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 220 }}
        transition={{ duration: 0.2 }}
        className="hidden md:flex flex-col flex-shrink-0 h-full bg-card/50 border-r border-border/50 relative overflow-hidden"
      >
        <SidebarContent />

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-5 -right-3 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center hover:bg-secondary transition-colors z-10"
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }}>
            <ChevronLeft size={12} />
          </motion.div>
        </button>
      </motion.aside>
    </>
  );
}
