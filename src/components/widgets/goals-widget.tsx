"use client";

import { motion } from "framer-motion";
import { Target, Plus, TrendingUp, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";
import { useDashboardStore } from "@/store/dashboard-store";

interface Goal {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  category: string;
}

function ProgressRing({ value, size = 56, strokeWidth = 5, color }: {
  value: number; size?: number; strokeWidth?: number; color: string;
}) {
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth={strokeWidth} />
      <motion.circle
        cx={size/2} cy={size/2} r={r}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ filter: `drop-shadow(0 0 4px ${color}40)` }}
      />
    </svg>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  work: "#00d4ff",
  learning: "#a855f7",
  health: "#00ff88",
  finance: "#ffd700",
  personal: "#6366f1",
};

export function GoalsWidget() {
  const { openModal } = useDashboardStore();
  const { data: goals = [], isLoading } = useQuery<Goal[]>({
    queryKey: ["goals"],
    queryFn: () => fetcher("/api/goals"),
  });

  if (isLoading) {
    return (
      <div className="widget-card h-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const avgProgress = goals.length > 0 
    ? Math.round(goals.reduce((acc, g) => acc + (g.current / g.target) * 100, 0) / goals.length)
    : 0;

  return (
    <div className="widget-card h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <Target size={16} className="text-green-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Goals</h3>
            <p className="text-[11px] text-muted-foreground">{avgProgress}% avg progress</p>
          </div>
        </div>
        <button 
          onClick={() => openModal("goal")}
          className="w-7 h-7 rounded-lg bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>

      <div className="space-y-3">
        {goals.slice(0, 4).map((goal) => {
          const pct = Math.round((goal.current / goal.target) * 100);
          const color = CATEGORY_COLORS[goal.category] || CATEGORY_COLORS.personal;
          return (
            <div key={goal.id} className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <ProgressRing value={pct} color={color} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-bold" style={{ color }}>{pct}%</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{goal.title}</p>
                <p className="text-[11px] text-muted-foreground">
                  {goal.unit === "$"
                    ? `$${goal.current.toLocaleString()} / $${goal.target.toLocaleString()}`
                    : `${goal.current} / ${goal.target} ${goal.unit}`}
                </p>
                <div className="w-full bg-secondary/50 rounded-full h-1 mt-1">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          );
        })}
        {goals.length === 0 && (
          <p className="text-xs text-center text-muted-foreground py-4">No goals yet. Add one to start tracking!</p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-2">
        <TrendingUp size={12} className="text-green-400" />
        <span className="text-xs text-muted-foreground">Momentum score:</span>
        <span className="text-xs font-bold text-green-400">
          {Math.round(avgProgress * 0.8 + (goals.length > 0 ? 20 : 0))}/100
        </span>
      </div>
    </div>
  );
}
