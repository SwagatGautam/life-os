import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/admin/login");
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar user={session.user} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav user={session.user} />
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-muted-foreground">Business analytics and system management</p>
              </div>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
