"use client";

import { motion } from "framer-motion";
import { Dumbbell, Plus, TrendingUp, Zap } from "lucide-react";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { format, subDays } from "date-fns";

const RECENT_WORKOUTS = [
  { name: "Push Day", date: "Today", exercises: 6, duration: 65, type: "strength" },
  { name: "Cardio HIIT", date: "Yesterday", exercises: 4, duration: 30, type: "cardio" },
  { name: "Pull Day", date: "2d ago", exercises: 7, duration: 70, type: "strength" },
];

const WEEKLY_VOLUME = Array.from({ length: 7 }, (_, i) => ({
  day: format(subDays(new Date(), 6 - i), "EEE"),
  sets: [0, 12, 0, 18, 8, 0, 22][i],
}));

const PRs = [
  { exercise: "Bench Press", weight: "100kg", date: "2d ago" },
  { exercise: "Deadlift", weight: "140kg", date: "1w ago" },
  { exercise: "Squat", weight: "120kg", date: "3d ago" },
];

export function GymWidget() {
  return (
    <div className="widget-card h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
            <Dumbbell size={16} className="text-pink-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Gym Tracker</h3>
            <p className="text-[11px] text-muted-foreground">4 workouts this week</p>
          </div>
        </div>
        <button className="w-7 h-7 rounded-lg bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors">
          <Plus size={14} />
        </button>
      </div>

      {/* Weekly volume chart */}
      <div className="h-16 mb-3">
        <p className="text-[10px] text-muted-foreground mb-1">Weekly volume (sets)</p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={WEEKLY_VOLUME} barSize={12}>
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 6, fontSize: 11 }}
            />
            <Bar dataKey="sets" fill="#ff2d78" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent workouts */}
      <div className="space-y-1.5 mb-3">
        {RECENT_WORKOUTS.map((w) => (
          <div key={w.name} className="flex items-center gap-2 bg-secondary/30 rounded-lg p-2">
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${w.type === "strength" ? "bg-pink-400" : "bg-orange-400"}`} />
            <span className="text-xs font-medium flex-1 truncate">{w.name}</span>
            <span className="text-[10px] text-muted-foreground">{w.date}</span>
            <span className="text-[10px] text-muted-foreground">{w.duration}m</span>
          </div>
        ))}
      </div>

      {/* PRs */}
      <div>
        <div className="flex items-center gap-1 mb-1.5">
          <Zap size={11} className="text-yellow-400" />
          <span className="text-[11px] font-semibold text-yellow-400">Recent PRs 🏆</span>
        </div>
        <div className="space-y-1">
          {PRs.map((pr) => (
            <div key={pr.exercise} className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">{pr.exercise}</span>
              <span className="font-bold text-yellow-400">{pr.weight}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
