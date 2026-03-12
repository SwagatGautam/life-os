import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = new Date(date);
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "MMM d, yyyy");
}

export function formatRelative(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function generateRoomCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 9; i++) {
    if (i === 3 || i === 6) code += "-";
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function getProgressColor(pct: number): string {
  if (pct >= 80) return "#00ff88";
  if (pct >= 50) return "#00d4ff";
  if (pct >= 25) return "#a855f7";
  return "#ff6b35";
}

export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

export function getLast365Days(): Date[] {
  const days: Date[] = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
}

export function getLast12Months(): { month: string; value: number }[] {
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (11 - i));
    return { month: format(d, "MMM"), value: 0 };
  });
}

export function calculateMomentumScore(params: {
  tasksCompleted: number;
  habitsCompleted: number;
  codingDays: number;
  workoutsThisWeek: number;
  pagesReadThisWeek: number;
}): number {
  const { tasksCompleted, habitsCompleted, codingDays, workoutsThisWeek, pagesReadThisWeek } = params;
  const score =
    Math.min(tasksCompleted * 3, 25) +
    Math.min(habitsCompleted * 5, 30) +
    Math.min(codingDays * 3, 20) +
    Math.min(workoutsThisWeek * 5, 15) +
    Math.min(pagesReadThisWeek * 2, 10);
  return Math.min(score, 100);
}

export function getHeatmapColor(value: number, max: number, isDark = true): string {
  const levels = [0, 0.25, 0.5, 0.75, 1];
  const pct = max > 0 ? value / max : 0;
  const level = levels.findIndex((l) => pct <= l);

  if (isDark) {
    const colors = ["#1a1f2e", "#0d3a4a", "#0e6b7a", "#009eb5", "#00d4ff"];
    return colors[Math.min(level, 4)];
  } else {
    const colors = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
    return colors[Math.min(level, 4)];
  }
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function randomId(): string {
  return Math.random().toString(36).slice(2, 9);
}
