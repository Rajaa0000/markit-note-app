import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ReadyToget() {
  return (
    <section className="bg-[#25306f] px-5 py-16 text-white md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">Ready to make your mark?</h2>
          <p className="mt-3 max-w-xl leading-7 text-[#d9e0ff]">
            Start with an account, then build your personal notes and tasks workspace.
          </p>
        </div>
        <Link href="/signup" className="app-button bg-white text-[#25306f]">
          Create account
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
