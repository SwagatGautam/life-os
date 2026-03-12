"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Terminal, Cpu, Zap, Code2, GitBranch, Activity,
  Eye, EyeOff, ArrowRight, Loader2
} from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be 8+ characters"),
});
type FormData = z.infer<typeof schema>;

const FLOATING_ICONS = [Terminal, Cpu, Zap, Code2, GitBranch, Activity];

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const res = await signIn("credentials", {
      ...data,
      redirect: false,
    });
    if (res?.error) {
      toast.error("Invalid email or password");
      return;
    }
    router.push(callbackUrl);
  };

  const handleGoogle = async () => {
    setIsGoogleLoading(true);
    await signIn("google", { callbackUrl });
  };

  return (
    <div className="min-h-screen bg-background bg-grid flex items-center justify-center p-4 overflow-hidden relative">
      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Floating icons */}
      {FLOATING_ICONS.map((Icon, i) => (
        <motion.div
          key={i}
          className="absolute text-primary/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: [0.05, 0.15, 0.05],
            y: [0, -20, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 6 + i * 2,
            repeat: Infinity,
            delay: i * 0.8,
          }}
          style={{
            left: `${10 + i * 15}%`,
            top: `${15 + (i % 3) * 25}%`,
          }}
        >
          <Icon size={24 + i * 4} />
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 mb-4"
            animate={{ boxShadow: ["0 0 10px rgba(0,212,255,0.2)", "0 0 30px rgba(0,212,255,0.4)", "0 0 10px rgba(0,212,255,0.2)"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Terminal className="text-primary" size={28} />
          </motion.div>
          <h1 className="text-3xl font-bold gradient-text mb-1">DevLife OS</h1>
          <p className="text-muted-foreground text-sm">Your Developer Operating System</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 border border-border/50 shadow-2xl">
          <h2 className="text-xl font-semibold mb-1">Welcome back</h2>
          <p className="text-muted-foreground text-sm mb-6">Sign in to your dashboard</p>

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 mb-4 text-sm font-medium disabled:opacity-60"
          >
            {isGoogleLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@company.com"
                className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
              />
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 pr-10 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Don&apos;t have an account?{" "}
            <a href="/auth/register" className="text-primary hover:underline font-medium">
              Create one free
            </a>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground/50 mt-6">
          10 modules. One dashboard. Zero friction. 🚀
        </p>
      </motion.div>
    </div>
  );
}
