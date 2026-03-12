"use client";

import { motion } from "framer-motion";
import { Check, Zap, Shield, Crown, Sparkles } from "lucide-react";
import { useState } from "react";
import { fetcher } from "@/lib/api";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

const PLANS = [
  {
    id: "FREE",
    name: "Free",
    price: "0",
    description: "Perfect for beginners",
    features: ["5 tasks per day", "3 habits tracking", "Basic analytics", "Limited AI advice"],
    color: "#94a3b8",
    icon: Sparkles,
  },
  {
    id: "PRO",
    name: "Pro",
    price: "500",
    description: "Level up your productivity",
    features: ["Unlimited tasks", "Unlimited habits", "Advanced radar charts", "24/7 AI Coach", "Custom themes"],
    color: "#00d4ff",
    icon: Zap,
    popular: true,
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    price: "2000",
    description: "Ultimate power for teams",
    features: ["Team sync", "Advanced business stats", "Premium support", "Custom integrations", "Unlimited everything"],
    color: "#a855f7",
    icon: Crown,
  },
];

export default function PricingPage() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: string) => {
    if (!session) {
      toast.error("Please sign in to subscribe");
      return;
    }
    
    if (plan === "FREE") return;

    setLoading(plan);
    try {
      const response = await fetcher<{ url: string; config: any }>("/api/payments/create", {
        method: "POST",
        body: JSON.stringify({ plan }),
      });

      if (response.url) {
        // Create a hidden form and submit it to eSewa (POST)
        const form = document.createElement("form");
        form.method = "POST";
        form.action = response.url;
        form.enctype = "application/x-www-form-urlencoded";

        Object.entries(response.config).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });

        document.body.appendChild(form);
        // Small delay to ensure DOM is settled
        setTimeout(() => form.submit(), 100);
      }
    } catch (error) {
      toast.error("Could not initiate payment");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold tracking-tight"
          >
            Choose Your <span className="text-primary">Plan</span>
          </motion.h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Unlock the full potential of DevLife OS. Transition from static goals to dynamic success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-8 rounded-3xl bg-card border ${plan.popular ? "border-primary shadow-lg shadow-primary/10" : "border-border/50"} flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                  MOST POPULAR
                </div>
              )}

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-secondary/50">
                  <plan.icon size={24} style={{ color: plan.color }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-xs text-muted-foreground">{plan.description}</p>
                </div>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-bold">NPR {plan.price}</span>
                <span className="text-muted-foreground text-sm"> / Month</span>
              </div>

              <div className="space-y-4 flex-1 mb-8">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-sm">
                    <Check size={16} className="text-green-400 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                disabled={loading !== null || (session?.user as any)?.plan === plan.id}
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full py-3 px-6 rounded-xl text-sm font-semibold transition-all ${
                  plan.id === "FREE"
                    ? "bg-secondary text-foreground cursor-default"
                    : "bg-primary text-primary-foreground hover:opacity-90 shadow-md shadow-primary/20"
                } disabled:opacity-50`}
              >
                {loading === plan.id ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Redirecting...
                    </div>
                ) : (session?.user as any)?.plan === plan.id ? "Current Plan" : "Subscribe Now"}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="text-center pt-8">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Shield size={14} /> Payments secured by eSewa
          </p>
        </div>
      </div>
    </div>
  );
}
