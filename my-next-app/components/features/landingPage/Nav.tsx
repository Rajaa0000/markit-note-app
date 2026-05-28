import Link from "next/link";
import { PenLine } from "lucide-react";
import SignButton from "@/components/common/Nav.tsx/SignButton";

export default function Nav() {
  return (
    <nav className="sticky top-0 z-20 flex items-center justify-between border-b border-[#e4e8f5] bg-[#fbfcff]/90 px-5 py-4 backdrop-blur md:px-10">
      <Link href="/" className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#8da2f7] text-[#5c7be8]">
          <PenLine size={20} />
        </span>
        <span className="text-2xl font-black tracking-tight text-[#25306f]">markIT</span>
      </Link>
      <SignButton />
    </nav>
  );
}
