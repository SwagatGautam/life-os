"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, Plus, CheckCircle, Circle } from "lucide-react";
import { format, subDays } from "date-fns";
import { cn } from "@/lib/utils";

interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  streak: number;
  logs: Set<string>;
}

const TODAY = format(new Date(), "yyyy-MM-dd");
const LAST_30 = Array.from({ length: 30 }, (_, i) => format(subDays(new Date(), 29 - i), "yyyy-MM-dd"));

function makeHabitLogs(daysBack = 30, completionRate = 0.7): Set<string> {
  const logs = new Set<string>();
  for (let i = 0; i < daysBack; i++) {
    if (Math.random() < completionRate) {
      logs.add(format(subDays(new Date(), i), "yyyy-MM-dd"));
    }
  }
  return logs;
}

const INITIAL_HABITS: Habit[] = [
  { id: "1", name: "Code", icon: "💻", color: "#00d4ff", streak: 7, logs: makeHabitLogs(60, 0.85) },
  { id: "2", name: "Exercise", icon: "🏋️", color: "#00ff88", streak: 4, logs: makeHabitLogs(60, 0.6) },
  { id: "3", name: "Read", icon: "📚", color: "#a855f7", streak: 12, logs: makeHabitLogs(60, 0.75) },
  { id: "4", name: "Meditate", icon: "🧘", color: "#ff6b35", streak: 2, logs: makeHabitLogs(60, 0.45) },
];

export function HabitsWidget() {
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);

  const toggleToday = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const newLogs = new Set(h.logs);
        if (newLogs.has(TODAY)) {
          newLogs.delete(TODAY);
          return { ...h, logs: newLogs, streak: Math.max(0, h.streak - 1) };
        } else {
          newLogs.add(TODAY);
          return { ...h, logs: newLogs, streak: h.streak + 1 };
        }
      })
    );
  };

  const completedToday = habits.filter((h) => h.logs.has(TODAY)).length;

  return (
    <div className="widget-card h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <Flame size={16} className="text-orange-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Habits</h3>
            <p className="text-[11px] text-muted-foreground">{completedToday}/{habits.length} today</p>
          </div>
        </div>
        <button className="w-7 h-7 rounded-lg bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors">
          <Plus size={14} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
          <span>Today&apos;s progress</span>
          <span>{Math.round((completedToday / habits.length) * 100)}%</span>
        </div>
        <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #ff6b35, #ff2d78)" }}
            initial={{ width: 0 }}
            animate={{ width: `${(completedToday / habits.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Habits list */}
      <div className="space-y-2.5">
        {habits.map((habit) => {
          const done = habit.logs.has(TODAY);
          return (
            <div key={habit.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <button onClick={() => toggleToday(habit.id)} className="flex-shrink-0">
                  {done ? (
                    <CheckCircle size={16} style={{ color: habit.color }} />
                  ) : (
                    <Circle size={16} className="text-muted-foreground/40 hover:text-muted-foreground" />
                  )}
                </button>
                <span className="text-sm">{habit.icon}</span>
                <span className={cn("text-sm font-medium flex-1", done && "text-muted-foreground line-through")}>
                  {habit.name}
                </span>
                <div className="flex items-center gap-1">
                  <Flame size={11} style={{ color: habit.color }} />
                  <span className="text-[11px] font-semibold" style={{ color: habit.color }}>
                    {habit.streak}d
                  </span>
                </div>
              </div>

              {/* Mini heatmap */}
              <div className="flex gap-0.5 ml-6">
                {LAST_30.slice(-14).map((day) => (
                  <div
                    key={day}
                    className="w-2 h-2 rounded-sm"
                    style={{
                      background: habit.logs.has(day) ? habit.color : "hsl(var(--secondary))",
                      opacity: habit.logs.has(day) ? 0.8 : 0.3,
                    }}
                    title={`${day}: ${habit.logs.has(day) ? "✓" : "✗"}`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
