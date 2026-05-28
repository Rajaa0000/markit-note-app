import { Star } from "lucide-react";

export default function Feedbacks() {
  const feedbacks = [
    "Clean enough for daily notes, structured enough for a portfolio project.",
    "Pinned notes and task lists make the app feel practical instead of just pretty.",
    "The interface keeps the backend features visible without making the workspace noisy.",
  ];

  return (
    <section className="bg-[#f7f8fc] px-5 py-16 md:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#5c7be8]">Why it works</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-[#141827] md:text-4xl">
          Designed like a real product
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {feedbacks.map((content) => (
            <article key={content} className="rounded-2xl border border-[#dfe5f3] bg-white p-5 shadow-sm">
              <div className="mb-4 flex gap-1 text-[#f0b84b]">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} size={17} fill="currentColor" />
                ))}
              </div>
              <p className="text-sm leading-6 text-[#53617d]">{content}</p>
              <p className="text-sm leading-4 text-[#53617d] pt-2 text-black font-semibold " >The creator  </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
