import { Metadata } from "next";
import { auth } from "@/lib/auth";
import { DashboardGrid } from "@/components/dashboard/dashboard-grid";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-6 animate-fade-in">
      <DashboardHeader user={session!.user} />
      <DashboardGrid />
    </div>
  );
}
