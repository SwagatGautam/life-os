import { Metadata } from "next";
import { TasksWidget } from "@/components/widgets/tasks-widget";

export const metadata: Metadata = { title: "Tasks" };

export default function TasksPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Tasks & Kanban</h1>
        <p className="text-muted-foreground text-sm">Manage your work across projects</p>
      </div>
      <div className="max-w-4xl">
        <TasksWidget />
      </div>
    </div>
  );
}
