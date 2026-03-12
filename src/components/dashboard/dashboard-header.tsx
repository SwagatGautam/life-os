"use client";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { Zap, TrendingUp, Coffee, Flame } from "lucide-react";
import type { User } from "next-auth";

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
  const score = 73; // This would come from real data
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
            <span className="text-sm font-bold">7d</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 border border-border/50">
            <TrendingUp size={14} className="text-green-400" />
            <span className="text-xs text-muted-foreground">Tasks</span>
            <span className="text-sm font-bold">12</span>
          </div>
        </div>

        {/* Momentum ring */}
        <div className="relative flex items-center justify-center">
          <svg width="72" height="72" className="-rotate-90">
            <circle
              cx="36" cy="36" r="30"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="5"
            />
            <circle
              cx="36" cy="36" r="30"
              fill="none"
              stroke={color}
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 30}`}
              strokeDashoffset={`${2 * Math.PI * 30 * (1 - score / 100)}`}
              style={{ filter: `drop-shadow(0 0 6px ${color})` }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Zap size={12} style={{ color }} />
            <span className="text-xs font-bold leading-none" style={{ color }}>{score}</span>
          </div>
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
