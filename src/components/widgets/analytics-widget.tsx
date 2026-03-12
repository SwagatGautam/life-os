"use client";

import { motion } from "framer-motion";
import { BarChart2, Clock, Zap, BookOpen, Dumbbell, Loader2 } from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, Tooltip, Legend
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";
import { useMemo } from "react";
import { format, subDays, isSameDay } from "date-fns";

interface Analytic {
  date: string;
  codingHours: number;
  tasksCompleted: number;
  habitsCompleted: number;
}

export function AnalyticsWidget() {
  const { data: analytics = [], isLoading } = useQuery<Analytic[]>({
    queryKey: ["analytics"],
    queryFn: () => fetcher("/api/analytics"),
  });

  const { radarData, weeklyTrend, funStats } = useMemo(() => {
    // 1. Radar Data (Averages)
    const avgCoding = analytics.length ? Math.min(100, (analytics.reduce((s, a) => s + a.codingHours, 0) / (analytics.length * 8)) * 100) : 0;
    const avgTasks = analytics.length ? Math.min(100, (analytics.reduce((s, a) => s + a.tasksCompleted, 0) / (analytics.length * 10)) * 100) : 0;
    const avgHabits = analytics.length ? Math.min(100, (analytics.reduce((s, a) => s + a.habitsCompleted, 0) / (analytics.length * 5)) * 100) : 0;

    const radar = [
      { subject: "Code", A: avgCoding, fullMark: 100 },
      { subject: "Tasks", A: avgTasks, fullMark: 100 },
      { subject: "Habits", A: avgHabits, fullMark: 100 },
      { subject: "Goals", A: 0, fullMark: 100 },
      { subject: "Fitness", A: 0, fullMark: 100 },
      { subject: "Finance", A: 0, fullMark: 100 },
    ];

    // 2. Weekly Trend
    const trend = Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i);
      const record = analytics.find(a => isSameDay(new Date(a.date), d));
      return {
        day: format(d, "EEE"),
        tasks: record?.tasksCompleted || 0,
        habits: record?.habitsCompleted || 0,
        coding: record?.codingHours || 0,
      };
    });

    // 3. Fun Stats
    const totalCoding = analytics.reduce((s, a) => s + a.codingHours, 0);
    const stats = [
      { icon: Clock, label: "Total coding hours", value: `${totalCoding}h`, color: "#00d4ff" },
      { icon: Zap, label: "Days tracked", value: `${analytics.length} days`, color: "#ff6b35" },
      { icon: BookOpen, label: "Avg tasks / day", value: analytics.length ? (analytics.reduce((s, a) => s + a.tasksCompleted, 0) / analytics.length).toFixed(1) : "0", color: "#a855f7" },
      { icon: Dumbbell, label: "Avg habits / day", value: analytics.length ? (analytics.reduce((s, a) => s + a.habitsCompleted, 0) / analytics.length).toFixed(1) : "0", color: "#ff2d78" },
    ];

    return { radarData: radar, weeklyTrend: trend, funStats: stats };
  }, [analytics]);

  if (isLoading) {
    return (
      <div className="widget-card h-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="widget-card h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
          <BarChart2 size={16} className="text-orange-400" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">Personal Analytics</h3>
          <p className="text-[11px] text-muted-foreground">Historical activity vs goals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Radar chart */}
        <div>
          <p className="text-[11px] text-muted-foreground mb-1">Life balance score</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Radar name="You" dataKey="A" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly line chart */}
        <div>
          <p className="text-[11px] text-muted-foreground mb-1">Weekly activity</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyTrend} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
                />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="tasks" stroke="#a855f7" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="habits" stroke="#00ff88" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="coding" stroke="#00d4ff" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Fun stats */}
      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border/50">
        {funStats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-2 bg-secondary/30 rounded-lg p-2">
            <stat.icon size={14} style={{ color: stat.color }} className="flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground truncate">{stat.label}</p>
              <p className="text-xs font-semibold" style={{ color: stat.color }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
