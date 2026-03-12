import { Metadata } from "next";
import { NotesWidget } from "@/components/widgets/notes-widget";

export const metadata: Metadata = { title: "Notes | DevLife OS" };

export default function NotesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-heading">Notes & Knowledge</h1>
        <p className="text-muted-foreground text-sm">Organize your thoughts and code snippets</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NotesWidget />
      </div>
    </div>
  );
}
