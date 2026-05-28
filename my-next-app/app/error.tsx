"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f8fc] px-4">
      <section className="max-w-md rounded-2xl border border-[#dfe5f3] bg-white p-6 text-center shadow-sm">
        <h1 className="text-2xl font-black text-[#141827]">Something went wrong</h1>
        <p className="mt-2 text-sm leading-6 text-[#687089]">The workspace hit an unexpected error. Try reloading the current view.</p>
        <button onClick={reset} className="app-button mt-5 bg-[#5c7be8] text-white">
          Try again
        </button>
      </section>
    </main>
  );
}
