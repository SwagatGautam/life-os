"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";
import { FileText, Plus, Search, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export function NotesWidget() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  
  const { data: notes = [], isLoading } = useQuery<Note[]>({
    queryKey: ["notes"],
    queryFn: () => fetcher("/api/notes"),
  });

  const createNote = useMutation({
    mutationFn: (data: { title: string; content?: string }) => 
        fetcher("/api/notes", { method: "POST", body: JSON.stringify({ ...data, content: data.content || "New Note Content" }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note created");
    },
  });

  const filteredNotes = notes.filter((n: Note) => 
    n.title.toLowerCase().includes(search.toLowerCase()) || 
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="widget-card h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <FileText size={16} className="text-orange-400" />
          </div>
          <h3 className="font-semibold text-sm">Notes & Wiki</h3>
        </div>
        <button 
          onClick={() => createNote.mutate({ title: "New Note", content: "" })}
          disabled={createNote.isPending}
          className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
        >
          {createNote.isPending ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
        </button>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={12} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes..."
          className="w-full bg-secondary/50 border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-primary/20"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1">
        {isLoading ? (
          <div className="flex justify-center py-4 text-muted-foreground"><Loader2 size={24} className="animate-spin" /></div>
        ) : filteredNotes.length === 0 ? (
          <p className="text-center text-xs text-muted-foreground py-4">No notes found.</p>
        ) : (
          filteredNotes.map(note => (
            <div key={note.id} className="p-3 rounded-xl bg-secondary/30 border border-border/50 hover:border-primary/30 transition-all cursor-pointer group">
              <h4 className="text-xs font-semibold mb-1 group-hover:text-primary transition-colors">{note.title}</h4>
              <p className="text-[10px] text-muted-foreground line-clamp-2">{note.content || "Empty note..."}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
