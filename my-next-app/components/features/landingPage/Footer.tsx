import { PenLine } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#dfe5f3] bg-white px-5 py-8 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 text-sm text-[#687089] md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-[#8da2f7] text-[#5c7be8]">
            <PenLine size={18} />
          </span>
          <span className="font-black text-[#25306f]">markIT</span>
        </div>
        <p>(c) 2026 markIT. Notes, tasks, and focused planning.</p>
        
        <p>Made by Chahinez Habouchi <br /> #CREATING</p>
        
        
      </div>
    </footer>
  );
}
