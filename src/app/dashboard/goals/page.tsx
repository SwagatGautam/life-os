import { Metadata } from "next";
import { GoalsWidget } from "@/components/widgets/goals-widget";

export const metadata: Metadata = { title: "Goals | DevLife OS" };

export default function GoalsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-heading">Goals & Milestones</h1>
        <p className="text-muted-foreground text-sm">Track your progress and achieve your targets</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GoalsWidget />
      </div>
    </div>
  );
}
