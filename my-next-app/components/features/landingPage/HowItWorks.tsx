export default function HowItWorks() {
  const steps = [
    ["01", "Sign in", "Create an account or log in through the deployed JWT backend."],
    ["02", "Capture ideas", "Create color-coded notes, pin favorites, and edit them anytime."],
    ["03", "Plan tasks", "Build task lists, add items, mark them done, and clean up old work."],
    ["04", "Stay in flow", "Use search and settings without breaking your workspace rhythm."],
  ];

  return (
    <section className="bg-white px-5 py-16 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#5c7be8]">How it works</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#141827] md:text-4xl">
            From blank page to organized workspace
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {steps.map(([step, title, content]) => (
            <article key={step} className="border-t-4 border-[#5c7be8] bg-[#f7f8fc] p-5">
              <p className="text-sm font-black text-[#5c7be8]">{step}</p>
              <h3 className="mt-4 text-lg font-black text-[#25306f]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#687089]">{content}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
