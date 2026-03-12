"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingUp, TrendingDown, Plus, PieChart } from "lucide-react";
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";

const EXPENSES = [
  { category: "Housing", amount: 1200, color: "#00d4ff" },
  { category: "Food", amount: 480, color: "#a855f7" },
  { category: "Transport", amount: 150, color: "#00ff88" },
  { category: "Tech", amount: 320, color: "#ff6b35" },
  { category: "Other", amount: 250, color: "#ff2d78" },
];

const INCOME = 5800;
const TOTAL_EXPENSES = EXPENSES.reduce((a, b) => a + b.amount, 0);
const SAVINGS = INCOME - TOTAL_EXPENSES;
const SAVINGS_PCT = Math.round((SAVINGS / INCOME) * 100);

export function FinancesWidget() {
  return (
    <div className="widget-card h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
            <DollarSign size={16} className="text-yellow-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Finances</h3>
            <p className="text-[11px] text-muted-foreground">March 2026</p>
          </div>
        </div>
        <button className="w-7 h-7 rounded-lg bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors">
          <Plus size={14} />
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 text-center">
          <TrendingUp size={12} className="text-green-400 mx-auto mb-1" />
          <div className="text-sm font-bold text-green-400">{formatCurrency(INCOME)}</div>
          <div className="text-[10px] text-muted-foreground">Income</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-center">
          <TrendingDown size={12} className="text-red-400 mx-auto mb-1" />
          <div className="text-sm font-bold text-red-400">{formatCurrency(TOTAL_EXPENSES)}</div>
          <div className="text-[10px] text-muted-foreground">Expenses</div>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-2 text-center">
          <DollarSign size={12} className="text-primary mx-auto mb-1" />
          <div className="text-sm font-bold text-primary">{formatCurrency(SAVINGS)}</div>
          <div className="text-[10px] text-muted-foreground">{SAVINGS_PCT}% saved</div>
        </div>
      </div>

      {/* Pie chart + breakdown */}
      <div className="flex gap-3 items-center">
        <div className="w-20 h-20 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RePieChart>
              <Pie data={EXPENSES} cx="50%" cy="50%" innerRadius={20} outerRadius={36} dataKey="amount" strokeWidth={0}>
                {EXPENSES.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
                formatter={(v: number) => [formatCurrency(v), ""]}
              />
            </RePieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-1.5">
          {EXPENSES.map((exp) => {
            const pct = Math.round((exp.amount / TOTAL_EXPENSES) * 100);
            return (
              <div key={exp.category}>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: exp.color }} />
                    <span>{exp.category}</span>
                  </div>
                  <span className="text-muted-foreground">{formatCurrency(exp.amount)}</span>
                </div>
                <div className="h-1 bg-secondary/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: exp.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
