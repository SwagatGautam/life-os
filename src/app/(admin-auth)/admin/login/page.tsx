"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Eye, EyeOff, ArrowRight, Loader2, Terminal } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid admin credentials");
        setLoading(false);
        return;
      }

      // Verify the user is actually an admin
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      if (session?.user?.role !== "ADMIN") {
        toast.error("Access denied. You are not an admin.");
        // Sign out non-admin user
        await signIn("credentials", { redirect: false });
        setLoading(false);
        return;
      }

      toast.success("Welcome back, Admin!");
      router.push("/admin");
    } catch (error) {
      toast.error("Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background bg-grid flex items-center justify-center p-4 overflow-hidden relative">
      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-4"
            animate={{ boxShadow: ["0 0 10px rgba(239,68,68,0.2)", "0 0 30px rgba(239,68,68,0.4)", "0 0 10px rgba(239,68,68,0.2)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Shield className="text-red-400" size={28} />
          </motion.div>
          <h1 className="text-3xl font-bold mb-1">Admin Panel</h1>
          <p className="text-muted-foreground text-sm">DevLife OS — Administration</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 border border-border/50 shadow-2xl">
          <div className="flex items-center gap-2 mb-6 p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
            <Shield size={16} className="text-red-400" />
            <p className="text-xs text-red-400 font-medium">Restricted access — Admin credentials required</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Admin Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@devlife-os.com"
                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all placeholder:text-muted-foreground"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 pr-10 text-sm outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all placeholder:text-muted-foreground"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-600 transition-all disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>Access Admin Panel <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-border/50">
            <a
              href="/auth/signin"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              <Terminal size={12} />
              Go to regular sign in
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground/50 mt-6">
          Administrative access is logged and monitored. 🔒
        </p>
      </motion.div>
    </div>
  );
}
