"use client";

import { AlertTriangle } from "lucide-react";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f8fc] px-4">
      <section className="max-w-md rounded-2xl border border-[#ffd5d5] bg-white p-6 text-center shadow-sm">
        <AlertTriangle className="mx-auto text-[#bd3f3f]" size={34} />
        <h1 className="mt-4 text-2xl font-black text-[#141827]">Workspace error</h1>
        <p className="mt-2 text-sm leading-6 text-[#687089]">
          Something failed while loading this dashboard page. You can retry without leaving the app.
        </p>
        <button onClick={reset} className="app-button mt-5 bg-[#5c7be8] text-white">
          Try again
        </button>
      </section>
    </main>
  );
}
