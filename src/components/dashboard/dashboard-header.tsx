"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { Zap, TrendingUp, Coffee, Flame, Loader2 } from "lucide-react";
import type { User } from "next-auth";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";
import { useMemo } from "react";

const QUOTES = [
  "Ship it. Then iterate.",
  "Every commit counts.",
  "Code is poetry.",
  "Build in public, win in private.",
  "Done is better than perfect.",
  "Solve problems, create value.",
  "The best code is no code.",
];

function getMomentumColor(score: number): string {
  if (score >= 80) return "#00ff88";
  if (score >= 60) return "#00d4ff";
  if (score >= 40) return "#a855f7";
  return "#ff6b35";
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 6) return "Burning midnight oil";
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  if (h < 20) return "Good evening";
  return "Night owl mode";
}

export function DashboardHeader({ user }: { user: User }) {
  const { data: analytics = [], isLoading } = useQuery<any[]>({
    queryKey: ["analytics"],
    queryFn: () => fetcher("/api/analytics"),
  });

  const { score, streak, tasksToday } = useMemo(() => {
    if (analytics.length === 0) return { score: 40, streak: 0, tasksToday: 0 };
    
    const latest = analytics[0]; // Assuming descending sort from API
    const s = Math.min(100, Math.round((latest.codingHours / 4) * 50 + (latest.tasksCompleted / 5) * 50));
    
    return {
      score: s || 40,
      streak: analytics.length,
      tasksToday: latest.tasksCompleted || 0,
    };
  }, [analytics]);

  const quote = QUOTES[new Date().getDay() % QUOTES.length];
  const greeting = getGreeting();
  const firstName = user.name?.split(" ")[0] ?? "Developer";
  const color = getMomentumColor(score);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Coffee size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{greeting}</span>
          <span className="text-sm text-muted-foreground">·</span>
          <span className="text-sm text-muted-foreground">{format(new Date(), "EEEE, MMMM d")}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">
          Hey, <span className="gradient-text">{firstName}</span> 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1 italic">"{quote}"</p>
      </motion.div>

      {/* Momentum score */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center gap-4"
      >
        {/* Quick stats */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border/50">
            <Flame size={14} className="text-orange-400" />
            <span className="text-xs text-muted-foreground">Streak</span>
            <span className="text-sm font-bold">{streak}d</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border/50">
            <TrendingUp size={14} className="text-green-400" />
            <span className="text-xs text-muted-foreground">Tasks</span>
            <span className="text-sm font-bold">{tasksToday}</span>
          </div>
        </div>

        {/* Momentum ring */}
        <div className="relative flex items-center justify-center">
          {isLoading ? (
            <div className="w-[72px] h-[72px] flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <svg width="72" height="72" className="-rotate-90">
                <circle cx="36" cy="36" r="30" fill="none" stroke="hsl(var(--border))" strokeWidth="5" />
                <motion.circle
                  cx="36" cy="36" r="30"
                  fill="none" stroke={color}
                  strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 30}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 30 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 30 * (1 - score / 100) }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Zap size={12} style={{ color }} />
                <span className="text-xs font-bold leading-none" style={{ color }}>{score}</span>
              </div>
            </>
          )}
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Momentum</p>
          <p className="text-sm font-semibold" style={{ color }}>
            {score >= 80 ? "On fire! 🔥" : score >= 60 ? "Great pace" : score >= 40 ? "Keep going" : "Warm up!"}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
