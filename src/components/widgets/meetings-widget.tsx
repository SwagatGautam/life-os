"use client";

import { motion } from "framer-motion";
import { Video, Users, Clock, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";
import Link from "next/link";

interface Meeting {
  id: string;
  title: string;
  roomCode: string;
  participants: number;
  isActive: boolean;
  scheduledAt?: string;
}

export function MeetingsWidget() {
  const { data: meetings = [], isLoading } = useQuery<Meeting[]>({
    queryKey: ["meetings"],
    queryFn: () => fetcher("/api/meetings"),
  });

  const activeMeetings = meetings.filter(m => m.isActive);

  return (
    <div className="widget-card h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <Video size={16} className="text-green-400" />
          </div>
          <h3 className="font-semibold text-sm">Active Meetings</h3>
        </div>
        <Link href="/dashboard/meetings" className="text-[10px] text-primary hover:underline font-medium">View All</Link>
      </div>

      <div className="flex-1 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-4"><Loader2 size={24} className="animate-spin text-muted-foreground" /></div>
        ) : activeMeetings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-xs text-muted-foreground mb-3">No live meetings right now.</p>
            <Link 
              href="/dashboard/meetings"
              className="px-3 py-1.5 bg-secondary hover:bg-secondary/80 rounded-lg text-[10px] font-semibold transition-all"
            >
              Start New Room
            </Link>
          </div>
        ) : (
          activeMeetings.map(meeting => (
            <div key={meeting.id} className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between group hover:border-primary/40 transition-all">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <h4 className="text-xs font-semibold truncate">{meeting.title}</h4>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Users size={10} /> {meeting.participants}</span>
                  <span className="font-mono">{meeting.roomCode}</span>
                </div>
              </div>
              <Link 
                href="/dashboard/meetings"
                className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all"
              >
                <Video size={14} />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
