import { Metadata } from "next";
import { ReadingWidget } from "@/components/widgets/reading-widget";

export const metadata: Metadata = { title: "Reading | DevLife OS" };

export default function ReadingPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold font-heading">Reading Library</h1>
        <p className="text-muted-foreground text-sm">Manage your library and track reading goals</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReadingWidget />
      </div>
    </div>
  );
}
