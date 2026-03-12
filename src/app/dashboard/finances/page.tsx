import { Metadata } from "next";
import { FinancesWidget } from "@/components/widgets/finances-widget";

export const metadata: Metadata = { title: "Finances | DevLife OS" };

export default function FinancesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-heading">Finances & Expenses</h1>
        <p className="text-muted-foreground text-sm">Monitor your income and spending</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FinancesWidget />
      </div>
    </div>
  );
}
