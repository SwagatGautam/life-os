"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Video, Plus, Copy, Check, Users, Clock, ExternalLink,
  Mic, MicOff, VideoIcon, VideoOff, MonitorUp,
  PhoneOff, MessageSquare, Hand, Smile
} from "lucide-react";
import { generateRoomCode, formatDate } from "@/lib/utils";
import { toast } from "sonner";

interface Meeting {
  id: string;
  title: string;
  code: string;
  scheduledAt?: Date;
  participants: number;
  isActive: boolean;
}

const MOCK_MEETINGS: Meeting[] = [
  { id: "1", title: "Team Standup", code: "ABC-DEF-GHI", scheduledAt: new Date(Date.now() + 3600000), participants: 4, isActive: false },
  { id: "2", title: "Design Review", code: "XYZ-123-456", participants: 2, isActive: true },
];

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>(MOCK_MEETINGS);
  const [activeRoom, setActiveRoom] = useState<Meeting | null>(null);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [copied, setCopied] = useState("");

  // In-room state
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: "Alice", text: "Hey everyone! 👋", time: "2m ago" },
    { id: 2, user: "Bob", text: "Ready to start!", time: "1m ago" },
  ]);

  const createMeeting = () => {
    if (!newTitle.trim()) return;
    const m: Meeting = {
      id: Math.random().toString(36).slice(2),
      title: newTitle,
      code: generateRoomCode(),
      participants: 1,
      isActive: false,
    };
    setMeetings((prev) => [m, ...prev]);
    setNewTitle("");
    setCreating(false);
    toast.success("Meeting created! Share the code to invite others.");
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(""), 2000);
    toast.success("Room code copied!");
  };

  const sendChat = () => {
    if (!chatMsg.trim()) return;
    setChatMessages((prev) => [...prev, {
      id: Date.now(),
      user: "You",
      text: chatMsg,
      time: "now",
    }]);
    setChatMsg("");
  };

  if (activeRoom) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col z-50">
        {/* Video grid */}
        <div className="flex-1 grid grid-cols-2 gap-2 p-4">
          {/* Local video */}
          <div className="relative bg-zinc-900 rounded-xl overflow-hidden flex items-center justify-center">
            {camOn ? (
              <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                    <span className="text-2xl">👤</span>
                  </div>
                  <p className="text-sm text-white/70">You (Camera Preview)</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-white/40">
                <VideoOff size={32} />
                <span className="text-sm">Camera off</span>
              </div>
            )}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 rounded-lg px-2 py-1">
              {micOn ? <Mic size={12} className="text-green-400" /> : <MicOff size={12} className="text-red-400" />}
              <span className="text-white text-xs">You</span>
            </div>
          </div>

          {/* Remote participants */}
          {["Alice", "Bob"].map((name, i) => (
            <div key={name} className="relative bg-zinc-900 rounded-xl overflow-hidden flex items-center justify-center">
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${["#0d3a4a", "#2d1b4e"][i]}, ${["#1a0d3a", "#0d4a2d"][i]})` }}
              >
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl"
                    style={{ background: ["rgba(0,212,255,0.2)", "rgba(168,85,247,0.2)"][i] }}>
                    {["👩‍💻", "👨‍💻"][i]}
                  </div>
                  <p className="text-sm text-white/70">{name}</p>
                </div>
              </div>
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 rounded-lg px-2 py-1">
                <Mic size={12} className="text-green-400" />
                <span className="text-white text-xs">{name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Meeting info bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white/70 text-sm font-medium">{activeRoom.title}</span>
            <span className="text-white/40 text-xs">{activeRoom.code}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={14} className="text-white/40" />
            <span className="text-white/40 text-sm">3 participants</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-950">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMicOn(!micOn)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                micOn ? "bg-zinc-800 hover:bg-zinc-700" : "bg-red-500/20 hover:bg-red-500/30"
              }`}
            >
              {micOn ? <Mic size={18} className="text-white" /> : <MicOff size={18} className="text-red-400" />}
            </button>
            <button
              onClick={() => setCamOn(!camOn)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                camOn ? "bg-zinc-800 hover:bg-zinc-700" : "bg-red-500/20 hover:bg-red-500/30"
              }`}
            >
              {camOn ? <VideoIcon size={18} className="text-white" /> : <VideoOff size={18} className="text-red-400" />}
            </button>
            <button className="w-12 h-12 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center">
              <MonitorUp size={18} className="text-white" />
            </button>
          </div>

          <button
            onClick={() => setActiveRoom(null)}
            className="w-14 h-12 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all"
          >
            <PhoneOff size={20} className="text-white" />
          </button>

          <div className="flex items-center gap-3">
            <button className="w-12 h-12 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center">
              <Hand size={18} className="text-white" />
            </button>
            <button className="w-12 h-12 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center">
              <Smile size={18} className="text-white" />
            </button>
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                chatOpen ? "bg-primary/20" : "bg-zinc-800 hover:bg-zinc-700"
              }`}
            >
              <MessageSquare size={18} className={chatOpen ? "text-primary" : "text-white"} />
            </button>
          </div>
        </div>

        {/* Chat panel */}
        {chatOpen && (
          <div className="absolute right-0 top-0 bottom-24 w-80 bg-zinc-950 border-l border-zinc-800 flex flex-col">
            <div className="p-4 border-b border-zinc-800">
              <h3 className="text-white font-semibold text-sm">Meeting Chat</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((m) => (
                <div key={m.id}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-white/70">{m.user}</span>
                    <span className="text-[10px] text-white/30">{m.time}</span>
                  </div>
                  <p className="text-sm text-white/80 bg-zinc-900 rounded-lg px-3 py-2">{m.text}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-zinc-800 flex gap-2">
              <input
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
                placeholder="Type a message..."
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-primary/50"
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Meetings</h1>
          <p className="text-muted-foreground text-sm">Video conferences & collaboration</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all"
        >
          <Plus size={16} /> New Meeting
        </button>
      </div>

      {/* Create meeting form */}
      {creating && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="widget-card"
        >
          <h3 className="font-semibold mb-3">Create New Meeting</h3>
          <div className="flex gap-3">
            <input
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createMeeting()}
              placeholder="Meeting title..."
              className="flex-1 bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/50"
            />
            <button onClick={createMeeting} className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90">
              Create
            </button>
            <button onClick={() => setCreating(false)} className="px-4 py-2.5 bg-secondary text-foreground rounded-xl text-sm">
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Meetings grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {meetings.map((meeting, i) => (
          <motion.div
            key={meeting.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="widget-card"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">{meeting.title}</h3>
                {meeting.scheduledAt && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock size={11} />
                    {formatDate(meeting.scheduledAt)}
                  </p>
                )}
              </div>
              {meeting.isActive && (
                <span className="flex items-center gap-1 text-[10px] bg-green-500/20 text-green-400 border border-green-500/20 rounded-full px-2 py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  LIVE
                </span>
              )}
            </div>

            <div className="bg-secondary/40 rounded-xl px-3 py-2 mb-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground">Room Code</p>
                <p className="font-mono text-sm font-bold">{meeting.code}</p>
              </div>
              <button
                onClick={() => copyCode(meeting.code)}
                className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
              >
                {copied === meeting.code ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users size={12} />
                {meeting.participants} participant{meeting.participants !== 1 ? "s" : ""}
              </div>
              <button
                onClick={() => setActiveRoom(meeting)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-xs font-semibold transition-all"
              >
                <Video size={12} /> Join
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
