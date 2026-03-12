"use client";

import { useDashboardStore } from "@/store/dashboard-store";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckSquare, Target, Flame, DollarSign, Dumbbell, BookOpen, FileText, Video } from "lucide-react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";

const MODAL_CONFIG = {
  task: { title: "New Task", icon: CheckSquare, color: "text-purple-400", api: "/api/tasks" },
  goal: { title: "New Goal", icon: Target, color: "text-green-400", api: "/api/goals" },
  habit: { title: "New Habit", icon: Flame, color: "text-orange-400", api: "/api/habits" },
  finance: { title: "New Transaction", icon: DollarSign, color: "text-yellow-400", api: "/api/finances/expenses" },
  gym: { title: "Log Workout", icon: Dumbbell, color: "text-pink-400", api: "/api/gym/workouts" },
  reading: { title: "Add Book", icon: BookOpen, color: "text-blue-400", api: "/api/reading" },
  note: { title: "New Note", icon: FileText, color: "text-purple-400", api: "/api/notes" },
  meeting: { title: "Schedule Meeting", icon: Video, color: "text-green-400", api: "/api/meetings" },
};

export function GlobalModals() {
  const { activeModal, closeModal } = useDashboardStore();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const config = activeModal ? MODAL_CONFIG[activeModal] : null;

  const createMutation = useMutation({
    mutationFn: (data: any) => fetcher(config?.api!, { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [activeModal === "task" ? "tasks" : activeModal === "habit" ? "habits" : activeModal] });
      toast.success(`${config?.title} created!`);
      closeModal();
      setFormData({});
    },
    onError: () => toast.error("Something went wrong"),
    onSettled: () => setLoading(false),
  });

  if (!config) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    createMutation.mutate(formData);
  };

  return (
    <AnimatePresence>
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-card border border-border shadow-2xl rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <config.icon size={18} className={config.color} />
                <h2 className="font-semibold">{config.title}</h2>
              </div>
              <button onClick={closeModal} className="p-1 hover:bg-secondary rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Title / Name</label>
                <input
                  required
                  autoFocus
                  value={formData.title || formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, [activeModal === "habit" ? "name" : "title"]: e.target.value })}
                  placeholder={`Enter ${activeModal}...`}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              {activeModal === "task" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Priority</label>
                    <select
                      value={formData.priority || "MEDIUM"}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-sm outline-none"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</label>
                    <select
                      value={formData.status || "TODO"}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-sm outline-none"
                    >
                      <option value="TODO">Todo</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="DONE">Done</option>
                    </select>
                  </div>
                </div>
              )}

              {activeModal === "goal" && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Target Value (%)</label>
                  <input
                    type="number"
                    value={formData.target || 100}
                    onChange={(e) => setFormData({ ...formData, target: parseFloat(e.target.value) })}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2 text-sm outline-none"
                  />
                </div>
              )}
              
              {activeModal === "finance" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount</label>
                    <input
                      type="number"
                      required
                      value={formData.amount || ""}
                      onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2 text-sm outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</label>
                    <input
                      value={formData.category || ""}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Food"
                      className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-2 text-sm outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4 gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  Create {activeModal}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
