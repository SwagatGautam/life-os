"use client";

import { motion } from "framer-motion";
import { Dumbbell, Plus, Zap, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { format, subDays, isSameWeek, startOfWeek } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";
import { useMemo } from "react";

interface Exercise {
  name: string;
  sets: any;
}

interface Workout {
  id: string;
  name: string;
  date: string;
  duration: number;
  exercises: Exercise[];
}

export function GymWidget() {
  const { data: workouts = [], isLoading } = useQuery<Workout[]>({
    queryKey: ["workouts"],
    queryFn: () => fetcher("/api/gym/workouts"),
  });

  const { weeklyVolume, recentWorkouts, workoutCount } = useMemo(() => {
    const sorted = [...workouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Calculate weekly volume
    const volumeData = Array.from({ length: 7 }, (_, i) => {
      const day = subDays(new Date(), 6 - i);
      const dayWorkouts = workouts.filter(w => format(new Date(w.date), "yyyy-MM-dd") === format(day, "yyyy-MM-dd"));
      const sets = dayWorkouts.reduce((acc, w) => acc + (w.exercises?.length || 0) * 3, 0); // Estimate 3 sets per exercise if not tracked
      return {
        day: format(day, "EEE"),
        sets,
      };
    });

    const thisWeek = workouts.filter(w => isSameWeek(new Date(w.date), new Date()));

    return {
      weeklyVolume: volumeData,
      recentWorkouts: sorted.slice(0, 3),
      workoutCount: thisWeek.length,
    };
  }, [workouts]);

  if (isLoading) {
    return (
      <div className="widget-card h-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="widget-card h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center">
            <Dumbbell size={16} className="text-pink-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Gym Tracker</h3>
            <p className="text-[11px] text-muted-foreground">{workoutCount} workouts this week</p>
          </div>
        </div>
        <button className="w-7 h-7 rounded-lg bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors">
          <Plus size={14} />
        </button>
      </div>

      {/* Weekly volume chart */}
      <div className="h-16 mb-3">
        <p className="text-[10px] text-muted-foreground mb-1">Weekly volume (est. sets)</p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyVolume} barSize={12}>
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
        {recentWorkouts.map((w) => (
          <div key={w.id} className="flex items-center gap-2 bg-secondary/30 rounded-lg p-2">
            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 bg-pink-400`} />
            <span className="text-xs font-medium flex-1 truncate">{w.name}</span>
            <span className="text-[10px] text-muted-foreground">{format(new Date(w.date), "MMM d")}</span>
            <span className="text-[10px] text-muted-foreground">{w.duration}m</span>
          </div>
        ))}
        {recentWorkouts.length === 0 && (
          <p className="text-[10px] text-center text-muted-foreground py-2">No recent workouts.</p>
        )}
      </div>

      {/* PRs */}
      <div>
        <div className="flex items-center gap-1 mb-1.5">
          <Zap size={11} className="text-yellow-400" />
          <span className="text-[11px] font-semibold text-yellow-400">Recent PRs 🏆</span>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] text-muted-foreground">Log movements to see PRs here.</p>
        </div>
      </div>
    </div>
  );
}
