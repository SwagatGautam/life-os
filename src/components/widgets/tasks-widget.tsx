"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckSquare, Plus, Flag, Circle, CheckCircle2, Clock, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";
import { toast } from "sonner";

type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
type Status = "TODO" | "IN_PROGRESS" | "DONE";

interface Task {
  id: string;
  title: string;
  priority: Priority;
  status: Status;
  tags: string[];
}

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  URGENT: { label: "Urgent", color: "#ff2d78" },
  HIGH: { label: "High", color: "#ff6b35" },
  MEDIUM: { label: "Medium", color: "#00d4ff" },
  LOW: { label: "Low", color: "#a855f7" },
};

const COLUMNS: { id: Status; label: string; color: string }[] = [
  { id: "TODO", label: "To Do", color: "#a855f7" },
  { id: "IN_PROGRESS", label: "In Progress", color: "#00d4ff" },
  { id: "DONE", label: "Done", color: "#00ff88" },
];

export function TasksWidget() {
  const queryClient = useQueryClient();
  const [addingTo, setAddingTo] = useState<Status | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: () => fetcher("/api/tasks"),
  });

  const createTask = useMutation({
    mutationFn: (data: Partial<Task>) => fetcher("/api/tasks", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created");
    },
  });

  const updateTask = useMutation({
    mutationFn: ({ id, ...data }: Partial<Task> & { id: string }) => 
      fetcher(`/api/tasks/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: (id: string) => fetcher(`/api/tasks/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted");
    },
  });

  const getColumnTasks = (status: Status) => tasks.filter((t) => t.status === status);

  const handleAddTask = (status: Status) => {
    if (!newTaskTitle.trim()) return;
    createTask.mutate({ title: newTaskTitle.trim(), status });
    setNewTaskTitle("");
    setAddingTo(null);
  };

  const toggleTaskStatus = (task: Task) => {
    const newStatus: Status = task.status === "DONE" ? "TODO" : "DONE";
    updateTask.mutate({ id: task.id, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="widget-card h-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const doneCount = getColumnTasks("DONE").length;
  const todoCount = getColumnTasks("TODO").length;

  return (
    <div className="widget-card h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <CheckSquare size={16} className="text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Tasks & Kanban</h3>
            <p className="text-[11px] text-muted-foreground">{doneCount}/{tasks.length} complete</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="stats-badge bg-purple-500/10 text-purple-400">{todoCount} pending</span>
        </div>
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-3 gap-2 overflow-x-auto">
        {COLUMNS.map((col) => (
          <div key={col.id} className="min-w-0">
            {/* Column header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                <span className="text-xs font-semibold">{col.label}</span>
              </div>
              <span className="text-xs text-muted-foreground bg-secondary/50 rounded-full w-5 h-5 flex items-center justify-center">
                {getColumnTasks(col.id).length}
              </span>
            </div>

            {/* Tasks */}
            <div className="space-y-1.5 min-h-20">
              {getColumnTasks(col.id).map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group bg-secondary/40 border border-border/50 rounded-lg p-2 cursor-pointer hover:border-primary/20 transition-all"
                >
                  <div className="flex items-start gap-1.5">
                    <button
                      onClick={() => toggleTaskStatus(task)}
                      className="mt-0.5 flex-shrink-0"
                    >
                      {task.status === "DONE" ? (
                        <CheckCircle2 size={12} className="text-green-400" />
                      ) : (
                        <Circle size={12} className="text-muted-foreground/50 hover:text-primary" />
                      )}
                    </button>
                    <p className={cn("text-xs leading-tight flex-1", task.status === "DONE" && "line-through text-muted-foreground")}>
                      {task.title}
                    </p>
                    <button
                      onClick={() => deleteTask.mutate(task.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} className="text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 ml-3.5">
                    <Flag size={9} style={{ color: PRIORITY_CONFIG[task.priority].color }} />
                    <span className="text-[9px]" style={{ color: PRIORITY_CONFIG[task.priority].color }}>
                      {PRIORITY_CONFIG[task.priority].label}
                    </span>
                    {task.tags?.map((tag) => (
                      <span key={tag} className="text-[9px] bg-secondary rounded px-1 text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Add task */}
              {addingTo === col.id ? (
                <div className="bg-secondary/40 border border-primary/30 rounded-lg p-2">
                  <input
                    autoFocus
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddTask(col.id);
                      if (e.key === "Escape") { setAddingTo(null); setNewTaskTitle(""); }
                    }}
                    placeholder="Task title..."
                    className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                  />
                  <div className="flex gap-1 mt-1.5">
                    <button 
                      onClick={() => handleAddTask(col.id)} 
                      disabled={createTask.isPending}
                      className="text-[10px] bg-primary/20 text-primary rounded px-1.5 py-0.5 disabled:opacity-50"
                    >
                      {createTask.isPending ? "Adding..." : "Add"}
                    </button>
                    <button onClick={() => { setAddingTo(null); setNewTaskTitle(""); }} className="text-[10px] text-muted-foreground">Cancel</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAddingTo(col.id)}
                  className="w-full flex items-center gap-1 text-[11px] text-muted-foreground/50 hover:text-muted-foreground p-1.5 rounded-lg hover:bg-secondary/30 transition-all"
                >
                  <Plus size={10} /> Add
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Today's focus */}
      <div className="mt-4 pt-3 border-t border-border/50">
        <div className="flex items-center gap-1.5 mb-2">
          <Clock size={12} className="text-primary" />
          <span className="text-xs font-semibold text-primary">Today&apos;s Focus</span>
        </div>
        <div className="space-y-1">
          {getColumnTasks("IN_PROGRESS").slice(0, 3).map((task) => (
            <div key={task.id} className="flex items-center gap-2 text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="truncate">{task.title}</span>
            </div>
          ))}
          {getColumnTasks("IN_PROGRESS").length === 0 && (
            <p className="text-xs text-muted-foreground">No tasks in progress</p>
          )}
        </div>
      </div>
    </div>
  );
}
