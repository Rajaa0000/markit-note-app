import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f8fc] px-4">
      <div className="flex items-center gap-3 rounded-2xl border border-[#dfe5f3] bg-white px-5 py-4 text-sm font-bold text-[#687089] shadow-sm">
        <Loader2 size={18} className="animate-spin text-[#5c7be8]" />
        Loading workspace...
      </div>
    </main>
  );
}
