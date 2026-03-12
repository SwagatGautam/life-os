"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Code2, GitCommit, GitPullRequest, Flame, TrendingUp, ExternalLink } from "lucide-react";
import { getLast365Days, getHeatmapColor } from "@/lib/utils";
import { format, getDay } from "date-fns";

// Mock data — replace with real GitHub API
const COMMITS_DATA = Array.from({ length: 365 }, () => Math.floor(Math.random() * 12));
const HOURS_DATA = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][i],
  hours: Math.floor(Math.random() * 60) + 20,
}));

const days = getLast365Days();

export function CodingWidget() {
  const [hoveredDay, setHoveredDay] = useState<{ date: Date; value: number } | null>(null);

  const maxCommits = Math.max(...COMMITS_DATA);
  const totalCommits = COMMITS_DATA.reduce((a, b) => a + b, 0);
  const streak = 7; // calculate from data

  // Group days into weeks for heatmap
  const weeks: { date: Date; value: number }[][] = [];
  let week: { date: Date; value: number }[] = [];

  // Pad first week
  const firstDay = getDay(days[0]);
  for (let i = 0; i < firstDay; i++) {
    week.push({ date: new Date(0), value: -1 });
  }

  days.forEach((date, i) => {
    week.push({ date, value: COMMITS_DATA[i] });
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });
  if (week.length > 0) weeks.push(week);

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
          { icon: GitCommit, label: "Commits", value: totalCommits.toLocaleString(), color: "#00d4ff" },
          { icon: GitPullRequest, label: "PRs", value: "23", color: "#a855f7" },
          { icon: Flame, label: "Streak", value: `${streak}d 🔥`, color: "#ff6b35" },
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
          <AreaChart data={HOURS_DATA} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
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
              {format(hoveredDay.date, "MMM d")} · {hoveredDay.value} commits
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
                  title={day.value >= 0 ? `${format(day.date, "MMM d")}: ${day.value} commits` : ""}
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
