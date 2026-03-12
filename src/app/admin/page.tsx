"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Activity,
  DollarSign,
  UserCheck,
  Package,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";

const COLORS = ["#00d4ff", "#a855f7", "#00ff88", "#ff6b35"];

interface AdminStats {
  totalUsers: number;
  totalRevenue: number;
  activeSubscriptions: number;
  conversionRate: number;
  revenueHistory: { date: string; amount: number }[];
  tierDistribution: { name: string; count: number }[];
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: () => fetcher("/api/admin/stats"),
  });

  if (isLoading) return <div className="h-96 flex items-center justify-center">Loading Analytics...</div>;

  const cards = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, trend: "+12%", color: "#00d4ff" },
    { label: "Total Revenue", value: `NPR ${stats?.totalRevenue || 0}`, icon: DollarSign, trend: "+8%", color: "#00ff88" },
    { label: "Active Subscriptions", value: stats?.activeSubscriptions || 0, icon: UserCheck, trend: "+5%", color: "#a855f7" },
    { label: "Conversion Rate", value: `${stats?.conversionRate || 0}%`, icon: Activity, trend: "-2%", color: "#ff6b35" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-secondary/50">
                <card.icon size={18} style={{ color: card.color }} />
              </div>
              <span className={`text-xs font-medium flex items-center ${card.trend.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                {card.trend}
                {card.trend.startsWith("+") ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <h3 className="text-2xl font-bold">{card.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Revenue Growth</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.revenueHistory || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#00ff88" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Distribution */}
        <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Subscription Tier Distribution</h3>
          <div className="h-72 flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.tierDistribution || []}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {stats?.tierDistribution?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
