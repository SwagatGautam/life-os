"use client";

import { motion } from "framer-motion";
import { BookOpen, Plus, Star, BookMarked } from "lucide-react";

const CURRENT_BOOK = {
  title: "The Pragmatic Programmer",
  author: "David Thomas, Andrew Hunt",
  cover: null,
  currentPage: 187,
  totalPages: 352,
  startDate: "Feb 1",
};

const BOOKS_THIS_YEAR = 14;
const YEARLY_GOAL = 24;
const YEARLY_PCT = Math.round((BOOKS_THIS_YEAR / YEARLY_GOAL) * 100);

const RECENT_BOOKS = [
  { title: "Clean Code", author: "Robert Martin", rating: 5, pages: 431 },
  { title: "System Design Interview", author: "Alex Xu", rating: 4, pages: 309 },
  { title: "DDIA", author: "Martin Kleppmann", rating: 5, pages: 562 },
];

export function ReadingWidget() {
  const progress = Math.round((CURRENT_BOOK.currentPage / CURRENT_BOOK.totalPages) * 100);

  return (
    <div className="widget-card h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <BookOpen size={16} className="text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Reading</h3>
            <p className="text-[11px] text-muted-foreground">{BOOKS_THIS_YEAR} books in 2026</p>
          </div>
        </div>
        <button className="w-7 h-7 rounded-lg bg-secondary/50 flex items-center justify-center hover:bg-secondary transition-colors">
          <Plus size={14} />
        </button>
      </div>

      {/* Current book */}
      <div className="bg-secondary/40 rounded-xl p-3 mb-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-14 rounded-md bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-border/50 flex items-center justify-center flex-shrink-0">
            <BookMarked size={16} className="text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate">{CURRENT_BOOK.title}</p>
            <p className="text-[10px] text-muted-foreground truncate">{CURRENT_BOOK.author}</p>
            <div className="mt-2">
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-muted-foreground">Page {CURRENT_BOOK.currentPage} of {CURRENT_BOOK.totalPages}</span>
                <span className="text-blue-400 font-semibold">{progress}%</span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Yearly challenge */}
      <div className="mb-3">
        <div className="flex justify-between text-[11px] mb-1">
          <span className="text-muted-foreground">2026 Challenge</span>
          <span className="font-semibold">{BOOKS_THIS_YEAR}/{YEARLY_GOAL} books</span>
        </div>
        <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #3b82f6, #a855f7)" }}
            initial={{ width: 0 }}
            animate={{ width: `${YEARLY_PCT}%` }}
            transition={{ duration: 1 }}
          />
        </div>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {YEARLY_GOAL - BOOKS_THIS_YEAR} more to reach your goal 📖
        </p>
      </div>

      {/* Recent books */}
      <div className="space-y-1.5">
        {RECENT_BOOKS.map((book) => (
          <div key={book.title} className="flex items-center gap-2">
            <div className="w-5 h-7 rounded bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-border/50 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium truncate">{book.title}</p>
              <p className="text-[10px] text-muted-foreground">{book.pages}p</p>
            </div>
            <div className="flex">
              {Array.from({ length: book.rating }, (_, i) => (
                <Star key={i} size={9} className="text-yellow-400 fill-yellow-400" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
