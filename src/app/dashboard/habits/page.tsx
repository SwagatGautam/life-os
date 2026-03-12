import { Metadata } from "next";
import { HabitsWidget } from "@/components/widgets/habits-widget";

export const metadata: Metadata = { title: "Habits | DevLife OS" };

export default function HabitsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-heading">Habits & Consistency</h1>
        <p className="text-muted-foreground text-sm">Build consistency with daily tracking</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <HabitsWidget />
      </div>
    </div>
  );
}
