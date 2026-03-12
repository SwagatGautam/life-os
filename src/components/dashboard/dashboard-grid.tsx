"use client";

import { motion } from "framer-motion";
import { CodingWidget } from "@/components/widgets/coding-widget";
import { TasksWidget } from "@/components/widgets/tasks-widget";
import { GoalsWidget } from "@/components/widgets/goals-widget";
import { HabitsWidget } from "@/components/widgets/habits-widget";
import { FinancesWidget } from "@/components/widgets/finances-widget";
import { GymWidget } from "@/components/widgets/gym-widget";
import { ReadingWidget } from "@/components/widgets/reading-widget";
import { PomodoroWidget } from "@/components/widgets/pomodoro-widget";
import { AnalyticsWidget } from "@/components/widgets/analytics-widget";
import { AICoachWidget } from "@/components/widgets/ai-coach-widget";

const WIDGETS = [
  { id: "coding", component: CodingWidget, cols: 2 },
  { id: "tasks", component: TasksWidget, cols: 2 },
  { id: "goals", component: GoalsWidget, cols: 1 },
  { id: "habits", component: HabitsWidget, cols: 1 },
  { id: "pomodoro", component: PomodoroWidget, cols: 1 },
  { id: "finances", component: FinancesWidget, cols: 1 },
  { id: "gym", component: GymWidget, cols: 1 },
  { id: "reading", component: ReadingWidget, cols: 1 },
  { id: "analytics", component: AnalyticsWidget, cols: 2 },
  { id: "ai-coach", component: AICoachWidget, cols: 2 },
];

export function DashboardGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 auto-rows-min">
      {WIDGETS.map((widget, i) => (
        <motion.div
          key={widget.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className={
            widget.cols === 2
              ? "md:col-span-2"
              : "col-span-1"
          }
        >
          <widget.component />
        </motion.div>
      ))}
    </div>
  );
}
