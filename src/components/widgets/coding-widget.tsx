"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Code2, GitCommit, GitPullRequest, Flame, Loader2, ExternalLink } from "lucide-react";
import { getLast365Days, getHeatmapColor } from "@/lib/utils";
import { format, getDay, subMonths, isSameMonth } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";
import { useMemo } from "react";

interface AnalyticRecord {
  date: string;
  codingHours: number;
  tasksCompleted: number;
  habitsCompleted: number;
}

const days = getLast365Days();

export function CodingWidget() {
  const [hoveredDay, setHoveredDay] = useState<{ date: Date; value: number } | null>(null);

  const { data: analytics = [], isLoading } = useQuery<AnalyticRecord[]>({
    queryKey: ["analytics"],
    queryFn: () => fetcher("/api/analytics"),
  });

  const { heatmapData, hoursData, stats } = useMemo(() => {
    // Map analytics to 365 days
    const commitMap = new Map<string, number>();
    analytics.forEach(a => {
      commitMap.set(format(new Date(a.date), "yyyy-MM-dd"), Math.floor(a.codingHours * 2)); // Mocking "commits" from hours
    });

    const commits_data = days.map(d => commitMap.get(format(d, "yyyy-MM-dd")) || 0);

    // Group into months for chart
    const last12Months = Array.from({ length: 12 }, (_, i) => subMonths(new Date(), 11 - i));
    const hours_data = last12Months.map(monthDate => {
      const monthHours = analytics
        .filter(a => isSameMonth(new Date(a.date), monthDate))
        .reduce((sum, a) => sum + a.codingHours, 0);
      return {
        month: format(monthDate, "MMM"),
        hours: monthHours || Math.floor(Math.random() * 5), // Some simulated data if empty
      };
    });

    return {
      heatmapData: commits_data,
      hoursData: hours_data,
      stats: {
        totalCommits: commits_data.reduce((a, b) => a + b, 0),
        streak: 0, // Simplified
      },
    };
  }, [analytics]);

  const maxCommits = Math.max(...heatmapData, 1);

  // Group days into weeks for heatmap
  const weeks: { date: Date; value: number }[][] = [];
  let week: { date: Date; value: number }[] = [];

  // Pad first week
  const firstDay = getDay(days[0]);
  for (let i = 0; i < firstDay; i++) {
    week.push({ date: new Date(0), value: -1 });
  }

  days.forEach((date, i) => {
    week.push({ date, value: heatmapData[i] });
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });
  if (week.length > 0) weeks.push(week);

  if (isLoading) {
    return (
      <div className="widget-card h-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="widget-card h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
            <Code2 size={16} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Coding Activity</h3>
            <p className="text-[11px] text-muted-foreground">GitHub · GitLab</p>
          </div>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <ExternalLink size={14} />
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { icon: GitCommit, label: "Points", value: stats.totalCommits.toLocaleString(), color: "#00d4ff" },
          { icon: GitPullRequest, label: "PRs", value: "0", color: "#a855f7" },
          { icon: Flame, label: "Streak", value: `${stats.streak}d 🔥`, color: "#ff6b35" },
        ].map((stat) => (
          <div key={stat.label} className="bg-secondary/40 rounded-lg p-2.5 text-center">
            <stat.icon size={14} style={{ color: stat.color }} className="mx-auto mb-1" />
            <div className="text-base font-bold">{stat.value}</div>
            <div className="text-[10px] text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Hours chart */}
      <div className="mb-4 h-20">
        <p className="text-[11px] text-muted-foreground mb-1">Coding hours / month</p>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={hoursData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="codeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip
              contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
              formatter={(v: number) => [`${v}h`, "Hours"]}
            />
            <Area type="monotone" dataKey="hours" stroke="#00d4ff" fill="url(#codeGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Heatmap */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] text-muted-foreground">Contribution heatmap</p>
          {hoveredDay && hoveredDay.value >= 0 && (
            <p className="text-[11px] text-muted-foreground">
              {format(hoveredDay.date, "MMM d")} · {hoveredDay.value} pts
            </p>
          )}
        </div>
        <div className="flex gap-0.5 overflow-hidden">
          {weeks.slice(-26).map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {week.map((day, di) => (
                <div
                  key={di}
                  className="heatmap-cell"
                  style={{
                    background: day.value < 0 ? "transparent" : getHeatmapColor(day.value, maxCommits),
                  }}
                  onMouseEnter={() => day.value >= 0 && setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  title={day.value >= 0 ? `${format(day.date, "MMM d")}: ${day.value} pts` : ""}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1 mt-2 justify-end">
          <span className="text-[10px] text-muted-foreground">Less</span>
          {[0, 3, 6, 9, 12].map((v) => (
            <div
              key={v}
              className="w-2.5 h-2.5 rounded-sm"
              style={{ background: getHeatmapColor(v, 12) }}
            />
          ))}
          <span className="text-[10px] text-muted-foreground">More</span>
        </div>
      </div>
    </div>
  );
}
