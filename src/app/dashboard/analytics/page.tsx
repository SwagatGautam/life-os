import { Metadata } from "next";
import { AnalyticsWidget } from "@/components/widgets/analytics-widget";

export const metadata: Metadata = { title: "Analytics | DevLife OS" };

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-heading">Personal Analytics</h1>
        <p className="text-muted-foreground text-sm">Deep dive into your productivity trends</p>
      </div>
      <div className="max-w-4xl">
        <AnalyticsWidget />
      </div>
    </div>
  );
}
