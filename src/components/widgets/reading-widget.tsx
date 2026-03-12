"use client";

import { motion } from "framer-motion";
import { BookOpen, Plus, Star, BookMarked, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/api";
import { useMemo } from "react";

interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  currentPage: number;
  totalPages: number;
  status: "WANT_TO_READ" | "READING" | "COMPLETED" | "ABANDONED";
  rating?: number;
}

export function ReadingWidget() {
  const { data: books = [], isLoading } = useQuery<Book[]>({
    queryKey: ["books"],
    queryFn: () => fetcher("/api/reading"),
  });

  const { currentBook, booksThisYear, recentBooks } = useMemo(() => {
    const reading = books.find(b => b.status === "READING");
    const completed = books.filter(b => b.status === "COMPLETED");
    const sorted = [...books].sort((a, b) => b.title.localeCompare(a.title)); // Placeholder sort

    return {
      currentBook: reading || null,
      booksThisYear: completed.length,
      recentBooks: completed.slice(0, 3),
    };
  }, [books]);

  const YEARLY_GOAL = 24;
  const yearlyPct = Math.round((booksThisYear / YEARLY_GOAL) * 100);

  if (isLoading) {
    return (
      <div className="widget-card h-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="widget-card h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <BookOpen size={16} className="text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Reading</h3>
            <p className="text-[11px] text-muted-foreground">{booksThisYear} books in {new Date().getFullYear()}</p>
          </div>
        </div>
        <button className="w-7 h-7 rounded-lg bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors">
          <Plus size={14} />
        </button>
      </div>

      {/* Current book */}
      {currentBook ? (
        <div className="bg-secondary/40 rounded-xl p-3 mb-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-14 rounded-md bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-border/50 flex items-center justify-center flex-shrink-0">
              <BookMarked size={16} className="text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate">{currentBook.title}</p>
              <p className="text-[10px] text-muted-foreground truncate">{currentBook.author}</p>
              <div className="mt-2">
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-muted-foreground">Page {currentBook.currentPage} of {currentBook.totalPages}</span>
                  <span className="text-blue-400 font-semibold">{Math.round((currentBook.currentPage / currentBook.totalPages) * 100)}%</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round((currentBook.currentPage / currentBook.totalPages) * 100)}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-secondary/20 rounded-xl p-4 mb-3 border border-dashed border-border flex items-center justify-center text-[11px] text-muted-foreground">
          No book currently being read.
        </div>
      )}

      {/* Yearly challenge */}
      <div className="mb-3">
        <div className="flex justify-between text-[11px] mb-1">
          <span className="text-muted-foreground">{new Date().getFullYear()} Challenge</span>
          <span className="font-semibold">{booksThisYear}/{YEARLY_GOAL} books</span>
        </div>
        <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #3b82f6, #a855f7)" }}
            initial={{ width: 0 }}
            animate={{ width: `${yearlyPct}%` }}
            transition={{ duration: 1 }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {Math.max(0, YEARLY_GOAL - booksThisYear)} more to reach your goal 📖
        </p>
      </div>

      {/* Recent books */}
      <div className="space-y-1.5">
        {recentBooks.map((book) => (
          <div key={book.id} className="flex items-center gap-2">
            <div className="w-5 h-7 rounded bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-border/50 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium truncate">{book.title}</p>
              <p className="text-[10px] text-muted-foreground">{book.totalPages}p</p>
            </div>
            <div className="flex">
              {book.rating && Array.from({ length: book.rating }, (_, i) => (
                <Star key={i} size={9} className="text-yellow-400 fill-yellow-400" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
