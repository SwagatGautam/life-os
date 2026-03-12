"use client";

import { motion } from "framer-motion";
import { Flame, Plus, CheckCircle, Circle, Loader2 } from "lucide-react";
import { format, subDays, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";
import { useDashboardStore } from "@/store/dashboard-store";
import { toast } from "sonner";

interface HabitLog {
  date: string;
  completed: boolean;
}

interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  streak: number;
  logs: HabitLog[];
}

const TODAY = format(new Date(), "yyyy-MM-dd");
const LAST_30 = Array.from({ length: 30 }, (_, i) => format(subDays(new Date(), 29 - i), "yyyy-MM-dd"));

export function HabitsWidget() {
  const { openModal } = useDashboardStore();
  const queryClient = useQueryClient();

  const { data: habits = [], isLoading } = useQuery<Habit[]>({
    queryKey: ["habits"],
    queryFn: () => fetcher("/api/habits"),
  });

  const toggleHabit = useMutation({
    mutationFn: (id: string) => fetcher(`/api/habits/${id}`, { 
      method: "POST", 
      body: JSON.stringify({ date: new Date() }) 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
    onError: () => {
      toast.error("Failed to update habit");
    }
  });

  if (isLoading) {
    return (
      <div className="widget-card h-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const completedToday = habits.filter((h) => 
    h.logs.some(log => isSameDay(new Date(log.date), new Date()))
  ).length;

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
        <button 
          onClick={() => openModal("habit")}
          className="w-7 h-7 rounded-lg bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
          <span>Today&apos;s progress</span>
          <span>{habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0}%</span>
        </div>
        <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #ff6b35, #ff2d78)" }}
            initial={{ width: 0 }}
            animate={{ width: `${habits.length > 0 ? (completedToday / habits.length) * 100 : 0}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Habits list */}
      <div className="space-y-2.5">
        {habits.map((habit) => {
          const done = habit.logs.some(log => isSameDay(new Date(log.date), new Date()));
          return (
            <div key={habit.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toggleHabit.mutate(habit.id)} 
                  disabled={toggleHabit.isPending}
                  className="flex-shrink-0 disabled:opacity-50"
                >
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
                {LAST_30.slice(-14).map((day) => {
                  const hasLog = habit.logs.some(log => format(new Date(log.date), "yyyy-MM-dd") === day);
                  return (
                    <div
                      key={day}
                      className="w-2 h-2 rounded-sm"
                      style={{
                        background: hasLog ? habit.color : "hsl(var(--secondary))",
                        opacity: hasLog ? 0.8 : 0.3,
                      }}
                      title={`${day}: ${hasLog ? "✓" : "✗"}`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
        {habits.length === 0 && (
          <p className="text-xs text-center text-muted-foreground py-4">Track daily routines here!</p>
        )}
      </div>
    </div>
  );
}
