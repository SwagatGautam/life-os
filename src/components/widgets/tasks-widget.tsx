"use client";

import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { CheckSquare, Plus, Flag, Circle, CheckCircle2, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Priority = "low" | "medium" | "high" | "urgent";
type Status = "todo" | "in_progress" | "done";

interface Task {
  id: string;
  title: string;
  priority: Priority;
  status: Status;
  tags?: string[];
}

const MOCK_TASKS: Task[] = [
  { id: "1", title: "Fix 422 error in API endpoint", priority: "urgent", status: "todo", tags: ["bug"] },
  { id: "2", title: "Implement drawer navigation", priority: "high", status: "in_progress", tags: ["feat"] },
  { id: "3", title: "Write unit tests for auth", priority: "medium", status: "todo", tags: ["test"] },
  { id: "4", title: "Update README with deploy guide", priority: "low", status: "done" },
  { id: "5", title: "Design new dashboard layout", priority: "high", status: "in_progress", tags: ["design"] },
  { id: "6", title: "Set up CI/CD pipeline", priority: "medium", status: "todo" },
];

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string }> = {
  urgent: { label: "Urgent", color: "#ff2d78" },
  high: { label: "High", color: "#ff6b35" },
  medium: { label: "Medium", color: "#00d4ff" },
  low: { label: "Low", color: "#a855f7" },
};

const COLUMNS: { id: Status; label: string; color: string }[] = [
  { id: "todo", label: "To Do", color: "#a855f7" },
  { id: "in_progress", label: "In Progress", color: "#00d4ff" },
  { id: "done", label: "Done", color: "#00ff88" },
];

export function TasksWidget() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [addingTo, setAddingTo] = useState<Status | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const getColumnTasks = (status: Status) => tasks.filter((t) => t.status === status);

  const moveTask = (id: string, newStatus: Status) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: newStatus } : t));
  };

  const addTask = (status: Status) => {
    if (!newTaskTitle.trim()) return;
    setTasks((prev) => [...prev, {
      id: Math.random().toString(36).slice(2),
      title: newTaskTitle.trim(),
      priority: "medium",
      status,
    }]);
    setNewTaskTitle("");
    setAddingTo(null);
  };

  const removeTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const todoCount = getColumnTasks("todo").length;
  const doneCount = getColumnTasks("done").length;

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
                      onClick={() => moveTask(task.id, col.id === "done" ? "todo" : "done")}
                      className="mt-0.5 flex-shrink-0"
                    >
                      {col.id === "done" ? (
                        <CheckCircle2 size={12} className="text-green-400" />
                      ) : (
                        <Circle size={12} className="text-muted-foreground/50 hover:text-primary" />
                      )}
                    </button>
                    <p className={cn("text-xs leading-tight flex-1", col.id === "done" && "line-through text-muted-foreground")}>
                      {task.title}
                    </p>
                    <button
                      onClick={() => removeTask(task.id)}
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
                      if (e.key === "Enter") addTask(col.id);
                      if (e.key === "Escape") { setAddingTo(null); setNewTaskTitle(""); }
                    }}
                    placeholder="Task title..."
                    className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                  />
                  <div className="flex gap-1 mt-1.5">
                    <button onClick={() => addTask(col.id)} className="text-[10px] bg-primary/20 text-primary rounded px-1.5 py-0.5">Add</button>
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
          {getColumnTasks("in_progress").slice(0, 3).map((task) => (
            <div key={task.id} className="flex items-center gap-2 text-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="truncate">{task.title}</span>
            </div>
          ))}
          {getColumnTasks("in_progress").length === 0 && (
            <p className="text-xs text-muted-foreground">No tasks in progress</p>
          )}
        </div>
      </div>
    </div>
  );
}
