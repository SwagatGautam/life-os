import { Metadata } from "next";
import { GymWidget } from "@/components/widgets/gym-widget";

export const metadata: Metadata = { title: "Gym | DevLife OS" };

export default function GymPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-heading">Gym & Fitness</h1>
        <p className="text-muted-foreground text-sm">Log your workouts and track volume</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GymWidget />
      </div>
    </div>
  );
}
