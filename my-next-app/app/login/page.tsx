"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, PenLine } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace("/dashboard/notes");
  }, [isAuthenticated, isLoading, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const result = await login(form);
    if (result.success) router.replace("/dashboard/notes");
    else setError(result.error ?? "Login failed");

    setIsSubmitting(false);
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f8fc] px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-[#dfe5f3] bg-white p-6 shadow-sm">
        <Link href="/" className="mb-8 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#8da2f7] text-[#5c7be8]">
            <PenLine size={20} />
          </span>
          <span className="text-2xl font-black text-[#25306f]">markIT</span>
        </Link>

        <h1 className="text-3xl font-black tracking-tight text-[#141827]">Welcome back</h1>
        <p className="mt-2 text-sm leading-6 text-[#687089]">Sign in to manage your notes, pinned ideas, and task lists.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            value={form.username}
            onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
            className="app-input"
            placeholder="Username"
            required
          />
          <input
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
            className="app-input"
            placeholder="Password"
            type="password"
            required
          />

          {error && <div className="rounded-xl border border-[#ffd5d5] bg-[#fff5f5] p-3 text-sm font-semibold text-[#a73838]">{error}</div>}

          <button disabled={isSubmitting} className="app-button w-full bg-[#5c7be8] text-white">
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
            Sign in
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm">
          <Link href="/forgot-password" className="font-bold text-[#5c7be8]">
            Forgot password?
          </Link>
          <Link href="/signup" className="font-bold text-[#5c7be8]">
            Create account
          </Link>
        </div>
      </section>
    </main>
  );
}
