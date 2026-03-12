import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Profile | DevLife OS" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-heading">User Profile</h1>
        <p className="text-muted-foreground text-sm">Manage your account information</p>
      </div>
      
      <div className="max-w-2xl bg-card border border-border rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 rounded-full ring-4 ring-primary/20 overflow-hidden">
            <img 
                src={session.user.image ?? `https://api.dicebear.com/7.x/shapes/svg?seed=${session.user.email}`} 
                alt={session.user.name ?? "User"} 
                className="w-full h-full object-cover"
            />
        </div>
        <div className="space-y-4 text-center md:text-left">
            <div>
                <h2 className="text-xl font-bold">{session.user.name ?? "Developer"}</h2>
                <p className="text-muted-foreground">{session.user.email}</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-medium">Pro Member</span>
                <span className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-xs text-orange-400 font-medium">Beta Tester</span>
            </div>
        </div>
      </div>
    </div>
  );
}
