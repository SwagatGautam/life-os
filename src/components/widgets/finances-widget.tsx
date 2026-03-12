"use client";

import { motion } from "framer-motion";
import { DollarSign, TrendingUp, TrendingDown, Plus, Loader2 } from "lucide-react";
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";
import { useMemo } from "react";

interface Transaction {
  amount: number;
  category?: string;
  source?: string;
  date: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Housing: "#00d4ff",
  Food: "#a855f7",
  Transport: "#00ff88",
  Tech: "#ff6b35",
  Entertainment: "#ff2d78",
  Health: "#6366f1",
  Other: "#a1a1aa",
};

export function FinancesWidget() {
  const { data: expenses = [], isLoading: loadingExpenses } = useQuery<Transaction[]>({
    queryKey: ["expenses"],
    queryFn: () => fetcher("/api/finances/expenses"),
  });

  const { data: income = [], isLoading: loadingIncome } = useQuery<Transaction[]>({
    queryKey: ["income"],
    queryFn: () => fetcher("/api/finances/income"),
  });

  const { totalIncome, totalExpenses, aggregatedExpenses } = useMemo(() => {
    const tInc = income.reduce((acc, curr) => acc + curr.amount, 0);
    const tExp = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    const agg = expenses.reduce((acc: Record<string, { category: string; amount: number; color: string }>, curr) => {
      const cat = curr.category || "Other";
      if (!acc[cat]) {
        acc[cat] = { category: cat, amount: 0, color: CATEGORY_COLORS[cat] || CATEGORY_COLORS.Other };
      }
      acc[cat].amount += curr.amount;
      return acc;
    }, {});

    return {
      totalIncome: tInc,
      totalExpenses: tExp,
      aggregatedExpenses: Object.values(agg).sort((a, b) => b.amount - a.amount),
    };
  }, [expenses, income]);

  if (loadingExpenses || loadingIncome) {
    return (
      <div className="widget-card h-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const savings = totalIncome - totalExpenses;
  const savingsPct = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;

  return (
    <div className="widget-card h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
            <DollarSign size={16} className="text-yellow-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Finances</h3>
            <p className="text-[11px] text-muted-foreground">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
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
          <div className="text-sm font-bold text-green-400">{formatCurrency(totalIncome)}</div>
          <div className="text-[10px] text-muted-foreground">Income</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2 text-center">
          <TrendingDown size={12} className="text-red-400 mx-auto mb-1" />
          <div className="text-sm font-bold text-red-400">{formatCurrency(totalExpenses)}</div>
          <div className="text-[10px] text-muted-foreground">Expenses</div>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-2 text-center">
          <DollarSign size={12} className="text-primary mx-auto mb-1" />
          <div className="text-sm font-bold text-primary">{formatCurrency(savings)}</div>
          <div className="text-[10px] text-muted-foreground">{savingsPct}% saved</div>
        </div>
      </div>

      {/* Pie chart + breakdown */}
      <div className="flex gap-3 items-center">
        {aggregatedExpenses.length > 0 ? (
          <>
            <div className="w-20 h-20 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={aggregatedExpenses} cx="50%" cy="50%" innerRadius={20} outerRadius={36} dataKey="amount" strokeWidth={0}>
                    {aggregatedExpenses.map((entry, i) => (
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

            <div className="flex-1 space-y-1.5 h-20 overflow-y-auto no-scrollbar">
              {aggregatedExpenses.slice(0, 4).map((exp) => {
                const pct = Math.round((exp.amount / totalExpenses) * 100);
                return (
                  <div key={exp.category}>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: exp.color }} />
                        <span className="truncate max-w-[60px]">{exp.category}</span>
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
          </>
        ) : (
          <p className="text-[11px] text-center text-muted-foreground w-full py-4">No expenses recorded yet.</p>
        )}
      </div>
    </div>
  );
}
