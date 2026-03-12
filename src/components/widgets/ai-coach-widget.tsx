"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Loader2, ChevronDown, ChevronUp } from "lucide-react";

const QUICK_PROMPTS = [
  "Summarize my week",
  "What should I focus on tomorrow?",
  "Analyze my productivity patterns",
  "Give me a motivational boost",
];

const SAMPLE_RESPONSES: Record<string, string> = {
  "Summarize my week": `**This week in numbers:**\n\n🔥 **Coding**: 34h total, 7-day streak maintained\n✅ **Tasks**: 23 completed, 4 in-progress\n🎯 **Goals**: MVP at 80% — you're crushing it!\n📚 **Reading**: 67 pages read (on track for yearly goal)\n💪 **Gym**: 4/5 workouts completed\n\n**Highlight**: Your longest uninterrupted coding block was 3.5h on Thursday — your peak performance window.\n\n**Next week focus**: Push MVP to 100% and start reading "Clean Architecture".`,
  "What should I focus on tomorrow?": `Based on your current momentum:\n\n1. **🚀 Ship the drawer navigation feature** — it's 80% done and blocking your MVP milestone\n2. **📚 Read 30 pages** of The Pragmatic Programmer — you're behind your weekly target\n3. **🏋️ Do your workout** — you've skipped 2 days, don't break the streak\n\n💡 Pro tip: Block 2-4 PM for deep work on the feature — that's your highest-focus window.`,
};

export function AICoachWidget() {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setLoading(true);
    setExpanded(true);

    setMessages((prev) => [...prev, { role: "user", text: msg }]);

    // Simulated AI response — replace with real OpenAI call
    await new Promise((r) => setTimeout(r, 1200));
    const response = SAMPLE_RESPONSES[msg] ||
      "I've analyzed your dashboard data. You're making great progress! Your coding streak is impressive. Focus on completing your top 3 tasks today and keep the momentum going. 🚀";

    setMessages((prev) => [...prev, { role: "ai", text: response }]);
    setLoading(false);
  };

  return (
    <div className="widget-card">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20 flex items-center justify-center">
            <Sparkles size={16} className="text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AI Coach</h3>
            <p className="text-[11px] text-muted-foreground">Powered by your data + GPT-4</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-green-400">Online</span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-2 text-muted-foreground hover:text-foreground"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Quick prompts */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {QUICK_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => sendMessage(p)}
            className="text-[11px] px-2.5 py-1 rounded-full border border-border/50 hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-purple-400 transition-all"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat */}
      <AnimatePresence>
        {expanded && messages.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-3 mb-3 pr-1">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "ai" && (
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles size={10} className="text-purple-400" />
                    </div>
                  )}
                  <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-primary/20 text-primary-foreground"
                      : "bg-secondary/60 text-foreground"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles size={10} className="text-purple-400" />
                  </div>
                  <div className="bg-secondary/60 rounded-xl px-3 py-2">
                    <Loader2 size={12} className="animate-spin text-purple-400" />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about your productivity, goals, patterns..."
          className="flex-1 bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-purple-500/30 focus:ring-1 focus:ring-purple-500/20 placeholder:text-muted-foreground transition-all"
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          className="w-9 h-9 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 flex items-center justify-center disabled:opacity-40 transition-all flex-shrink-0"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        </button>
      </div>
    </div>
  );
}
