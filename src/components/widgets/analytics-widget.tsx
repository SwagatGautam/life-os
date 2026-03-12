"use client";

import { motion } from "framer-motion";
import { BarChart2, Clock, Zap, BookOpen, Dumbbell, CheckSquare } from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  LineChart, Line, XAxis, Tooltip, Legend
} from "recharts";

const RADAR_DATA = [
  { subject: "Code", A: 85, fullMark: 100 },
  { subject: "Habits", A: 70, fullMark: 100 },
  { subject: "Goals", A: 73, fullMark: 100 },
  { subject: "Reading", A: 60, fullMark: 100 },
  { subject: "Fitness", A: 78, fullMark: 100 },
  { subject: "Finance", A: 82, fullMark: 100 },
];

const WEEKLY_TREND = [
  { day: "Mon", tasks: 5, habits: 3, coding: 4 },
  { day: "Tue", tasks: 8, habits: 4, coding: 6 },
  { day: "Wed", tasks: 3, habits: 4, coding: 2 },
  { day: "Thu", tasks: 9, habits: 3, coding: 7 },
  { day: "Fri", tasks: 11, habits: 4, coding: 8 },
  { day: "Sat", tasks: 4, habits: 2, coding: 3 },
  { day: "Sun", tasks: 2, habits: 4, coding: 1 },
];

const FUN_STATS = [
  { icon: Clock, label: "Most productive hour", value: "2PM – 4PM", color: "#00d4ff" },
  { icon: Zap, label: "Longest coding streak", value: "14 days", color: "#ff6b35" },
  { icon: BookOpen, label: "Books read this year", value: "14 / 24", color: "#a855f7" },
  { icon: Dumbbell, label: "Workouts this month", value: "16", color: "#ff2d78" },
];

export function AnalyticsWidget() {
  return (
    <div className="widget-card h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
          <BarChart2 size={16} className="text-orange-400" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">Personal Analytics</h3>
          <p className="text-[11px] text-muted-foreground">This week vs last week</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Radar chart */}
        <div>
          <p className="text-[11px] text-muted-foreground mb-1">Life balance score</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={RADAR_DATA}>
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
              <LineChart data={WEEKLY_TREND} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
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
        {FUN_STATS.map((stat) => (
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
