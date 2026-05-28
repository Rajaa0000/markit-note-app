import Link from "next/link";
import { ArrowRight, CheckCircle2, Pin, Search, Sparkles } from "lucide-react";
import SignButton from "@/components/common/Nav.tsx/SignButton";

export default function MainPart() {
  const features = ["Pinnable notes", "Pastel colors", "Task lists", "Due dates", "Search"];

  return (
    <section className="relative overflow-hidden bg-[#fbfcff] px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dbe3ff] bg-[#eef2ff] px-3 py-1 text-sm font-bold text-[#5c7be8]">
            <Sparkles size={16} />
            Your digital stationery suite
          </div>
          <h1 className="max-w-3xl text-5xl font-black tracking-tight text-[#18205a] md:text-7xl">
            Organize your thoughts, beautifully.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5f6b8a]">
            A polished workspace for notes and tasks with JWT authentication, pinned ideas,
            color-coded cards, and focused task lists.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <SignButton />
            <Link href="/signup" className="app-button border border-[#dfe5f3] bg-white text-[#25306f]">
              Create account
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {features.map((feature) => (
              <span key={feature} className="rounded-full border border-[#dfe5f3] bg-white px-3 py-1 text-sm font-bold text-[#53617d]">
                {feature}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#dfe5f3] bg-white p-4 shadow-xl shadow-[#dfe5f3]/60">
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-[#eef3fb] px-4 py-3 text-sm text-[#8b96ad]">
            <Search size={18} />
            Search notes and tasks...
          </div>
          <div className="grid gap-3">
            <div className="rounded-2xl border border-[#efdcb8] bg-[#fff4df] p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#9a7c3a]">Pinned</p>
                  <h2 className="mt-2 text-xl font-black text-[#25306f]">Portfolio ideas</h2>
                </div>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#5c7be8] text-white">
                  <Pin size={16} />
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#60708d]">
                Finish the dashboard, verify API flows, and keep the code clean enough to show.
              </p>
            </div>
            <div className="rounded-2xl border border-[#dfe5f3] bg-[#fbfcff] p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-black text-[#25306f]">Launch checklist</h2>
                <span className="rounded-full bg-[#eef2ff] px-3 py-1 text-sm font-bold text-[#5369c9]">2/3</span>
              </div>
              {["Connect deployed backend", "Style responsive pages", "Run production build"].map((task, index) => (
                <div key={task} className="flex items-center gap-3 border-t border-[#edf1f8] py-3 first:border-t-0">
                  <CheckCircle2 className={index < 2 ? "text-[#5c7be8]" : "text-[#cdd7ef]"} size={20} />
                  <span className={index < 2 ? "text-[#253047]" : "text-[#8b96ad]"}>{task}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
