import { AlarmClock, ListTodo, Palette, Pin, Search, Type } from "lucide-react";

export default function Features() {
  const features = [
    { title: "Rich notes", content: "Create, edit, delete, pin, and color-code every note.", icon: Type },
    { title: "Pinned focus", content: "Important notes stay at the top of the dashboard.", icon: Pin },
    { title: "Task lists", content: "Create named lists and add tasks without leaving the page.", icon: ListTodo },
    { title: "Due dates", content: "Attach dates to lists for daily planning and deadlines.", icon: AlarmClock },
    { title: "Fast search", content: "Search note titles and filter task content instantly.", icon: Search },
    { title: "Pastel palette", content: "Choose clean, readable backgrounds for note cards.", icon: Palette },
  ];

  return (
    <section className="bg-[#f7f8fc] px-5 py-16 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#5c7be8]">Features</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#141827] md:text-4xl">
            Built for thinkers and doers
          </h2>
          <p className="mt-4 text-lg leading-8 text-[#687089]">
            Every core backend feature has a matching frontend workflow.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="rounded-2xl border border-[#dfe5f3] bg-white p-5 shadow-sm">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#eef2ff] text-[#5c7be8]">
                  <Icon size={22} />
                </span>
                <h3 className="mt-4 text-lg font-black text-[#25306f]">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#687089]">{feature.content}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
