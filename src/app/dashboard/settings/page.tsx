import { Metadata } from "next";
import { PomodoroWidget } from "@/components/widgets/pomodoro-widget";

export const metadata: Metadata = { title: "Settings | DevLife OS" };

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-heading">Settings</h1>
        <p className="text-muted-foreground text-sm">Configure your dashboard and personal preferences</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
            <section className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4">Pomodoro Configuration</h3>
                <PomodoroWidget />
            </section>
        </div>
      </div>
    </div>
  );
}
