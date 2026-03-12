"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, SkipForward, Coffee, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

const MODES = [
  { id: "work", label: "Focus", minutes: 25, color: "#00d4ff", icon: Brain },
  { id: "break", label: "Break", minutes: 5, color: "#00ff88", icon: Coffee },
  { id: "long", label: "Long Break", minutes: 15, color: "#a855f7", icon: Coffee },
] as const;

type Mode = (typeof MODES)[number]["id"];

export function PomodoroWidget() {
  const [mode, setMode] = useState<Mode>("work");
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(25 * 60);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(null);

  const currentMode = MODES.find((m) => m.id === mode)!;
  const totalSeconds = currentMode.minutes * 60;
  const progress = (seconds / totalSeconds) * 100;

  const tick = useCallback(() => {
    setSeconds((s) => {
      if (s <= 1) {
        setRunning(false);
        setSessions((prev) => prev + 1);
        // Play sound notification
        try {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 800;
          gain.gain.setValueAtTime(0.3, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.5);
        } catch {}
        return 0;
      }
      return s - 1;
    });
  }, []);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, tick]);

  const reset = () => {
    setRunning(false);
    setSeconds(currentMode.minutes * 60);
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setRunning(false);
    setSeconds(MODES.find((m) => m.id === newMode)!.minutes * 60);
  };

  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");

  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference * (1 - progress / 100);

  return (
    <div className="widget-card h-full flex flex-col items-center">
      {/* Mode tabs */}
      <div className="flex bg-secondary/50 rounded-lg p-0.5 mb-4 w-full">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => switchMode(m.id)}
            className={cn(
              "flex-1 text-xs py-1.5 rounded-md font-medium transition-all",
              mode === m.id
                ? "bg-card shadow text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Timer circle */}
      <div className="relative flex items-center justify-center mb-4">
        <svg width="128" height="128" className="-rotate-90">
          <circle cx="64" cy="64" r="54" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
          <motion.circle
            cx="64" cy="64" r="54"
            fill="none"
            stroke={currentMode.color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ filter: `drop-shadow(0 0 8px ${currentMode.color}60)` }}
            transition={{ duration: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="timer-display text-2xl font-bold">{mins}:{secs}</span>
          <span className="text-[10px] text-muted-foreground mt-0.5">{currentMode.label}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={reset}
          className="w-9 h-9 rounded-full bg-secondary/50 hover:bg-secondary flex items-center justify-center transition-colors"
        >
          <RotateCcw size={14} />
        </button>
        <button
          onClick={() => setRunning(!running)}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
          style={{
            background: currentMode.color,
            boxShadow: running ? `0 0 20px ${currentMode.color}60` : "none",
          }}
        >
          {running ? (
            <Pause size={18} className="text-background" />
          ) : (
            <Play size={18} className="text-background ml-0.5" />
          )}
        </button>
        <button
          onClick={() => switchMode(mode === "work" ? "break" : "work")}
          className="w-9 h-9 rounded-full bg-secondary/50 hover:bg-secondary flex items-center justify-center transition-colors"
        >
          <SkipForward size={14} />
        </button>
      </div>

      {/* Session dots */}
      <div className="flex items-center gap-1.5">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className={cn("w-2 h-2 rounded-full transition-all", i < sessions % 4 ? "scale-110" : "opacity-30")}
            style={{ background: i < sessions % 4 ? currentMode.color : "hsl(var(--border))" }}
          />
        ))}
        <span className="text-[10px] text-muted-foreground ml-1">{sessions} sessions</span>
      </div>
    </div>
  );
}
