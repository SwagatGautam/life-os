"use client";

import { motion } from "framer-motion";
import { Target, Plus, TrendingUp } from "lucide-react";
import { getProgressColor } from "@/lib/utils";

interface Goal {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  category: string;
  color: string;
}

const MOCK_GOALS: Goal[] = [
  { id: "1", title: "Ship MVP", current: 80, target: 100, unit: "%", category: "work", color: "#00d4ff" },
  { id: "2", title: "Read 24 books", current: 14, target: 24, unit: "books", category: "learning", color: "#a855f7" },
  { id: "3", title: "Workout 150x", current: 89, target: 150, unit: "days", category: "health", color: "#00ff88" },
  { id: "4", title: "Save $10k", current: 6800, target: 10000, unit: "$", category: "finance", color: "#ffd700" },
];

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

export function GoalsWidget() {
  const avgProgress = Math.round(
    MOCK_GOALS.reduce((acc, g) => acc + (g.current / g.target) * 100, 0) / MOCK_GOALS.length
  );

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
        <button className="w-7 h-7 rounded-lg bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors">
          <Plus size={14} />
        </button>
      </div>

      <div className="space-y-3">
        {MOCK_GOALS.map((goal) => {
          const pct = Math.round((goal.current / goal.target) * 100);
          return (
            <div key={goal.id} className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <ProgressRing value={pct} color={goal.color} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-bold" style={{ color: goal.color }}>{pct}%</span>
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
                    style={{ background: goal.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-border/50 flex items-center gap-2">
        <TrendingUp size={12} className="text-green-400" />
        <span className="text-xs text-muted-foreground">Momentum score:</span>
        <span className="text-xs font-bold text-green-400">73/100</span>
      </div>
    </div>
  );
}
