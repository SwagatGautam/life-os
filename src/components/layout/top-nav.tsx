"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bell, Sun, Moon, Monitor, ChevronDown,
  LogOut, User, Settings, CreditCard, Zap, Command
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { User as NextAuthUser } from "next-auth";
import { useDashboardStore } from "@/store/dashboard-store";

const NOTIFS = [
  { id: 1, text: "3-day coding streak! 🔥", time: "2m ago", unread: true },
  { id: 2, text: "Goal 'Ship MVP' is 80% complete", time: "1h ago", unread: true },
  { id: 3, text: "Weekly report ready", time: "3h ago", unread: false },
];

export function TopNav({ user }: { user: NextAuthUser }) {
  const { theme, setTheme } = useTheme();
  const { openCommandPalette } = useDashboardStore();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const unreadCount = NOTIFS.filter((n) => n.unread).length;

  return (
    <header className="h-14 flex items-center gap-3 px-4 md:px-6 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-30 flex-shrink-0">
      {/* Search */}
      <button
        onClick={openCommandPalette}
        className="flex-1 max-w-sm flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all group"
      >
        <Search size={14} className="flex-shrink-0" />
        <span className="flex-1 text-left hidden sm:block">Search or type a command...</span>
        <kbd className="hidden sm:flex items-center gap-1 text-[10px] border border-border rounded px-1.5 py-0.5 bg-background group-hover:border-primary/30">
          <Command size={9} />K
        </kbd>
      </button>

      <div className="flex items-center gap-2 ml-auto">
        {/* Theme toggle */}
        <div className="flex items-center bg-secondary/50 border border-border/50 rounded-lg p-0.5">
          {(["light", "dark", "system"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={cn(
                "p-1.5 rounded-md transition-all duration-200",
                theme === t ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              title={t}
            >
              {t === "light" ? <Sun size={14} /> : t === "dark" ? <Moon size={14} /> : <Monitor size={14} />}
            </button>
          ))}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifs(!showNotifs); setShowUser(false); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-border/50 bg-secondary/50 hover:border-primary/30 transition-all"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifs && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 top-11 w-72 bg-popover border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
              >
                <div className="p-3 border-b border-border flex items-center justify-between">
                  <h3 className="text-sm font-semibold">Notifications</h3>
                  <button className="text-xs text-primary hover:underline">Mark all read</button>
                </div>
                <div className="divide-y divide-border/50">
                  {NOTIFS.map((n) => (
                    <div key={n.id} className={cn("p-3 flex items-start gap-2 hover:bg-secondary/50 cursor-pointer transition-colors", n.unread && "bg-primary/5")}>
                      {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />}
                      <div className={cn("flex-1", !n.unread && "ml-3.5")}>
                        <p className="text-sm">{n.text}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => { setShowUser(!showUser); setShowNotifs(false); }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg border border-border/50 bg-secondary/50 hover:border-primary/30 transition-all"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.image ?? `https://api.dicebear.com/7.x/shapes/svg?seed=${user.email}`}
              alt={user.name ?? "User"}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm font-medium hidden sm:block max-w-24 truncate">
              {user.name?.split(" ")[0] ?? "Dev"}
            </span>
            <ChevronDown size={12} className="text-muted-foreground" />
          </button>

          <AnimatePresence>
            {showUser && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                className="absolute right-0 top-11 w-52 bg-popover border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
              >
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
                <div className="p-1.5 space-y-0.5">
                  {[
                    { icon: User, label: "Profile", href: "/dashboard/profile" },
                    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
                    { icon: Zap, label: "Upgrade to Pro", href: "/pricing" },
                  ].map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm hover:bg-secondary/80 transition-colors"
                      onClick={() => setShowUser(false)}
                    >
                      <item.icon size={14} className="text-muted-foreground" />
                      {item.label}
                    </a>
                  ))}
                  <div className="h-px bg-border/50 my-1" />
                  <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Close dropdowns on outside click */}
      {(showNotifs || showUser) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setShowNotifs(false); setShowUser(false); }}
        />
      )}
    </header>
  );
}
