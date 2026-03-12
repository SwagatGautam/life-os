import { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = { title: "Pricing | DevLife OS" };

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute top-8 left-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
          <ChevronLeft size={16} /> Back to Dashboard
        </Link>
      </div>
      
      <div className="max-w-md space-y-4">
        <h1 className="text-4xl font-bold font-heading gradient-text">Coming Soon</h1>
        <p className="text-muted-foreground">We're building something special for power users. Advanced analytics, team collaboration, and unlimited storage are on the way.</p>
        <div className="pt-8">
            <Link href="/dashboard" className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
                Stay in the Loop
            </Link>
        </div>
      </div>
    </div>
  );
}
