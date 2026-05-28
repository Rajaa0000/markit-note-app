"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { getErrorMessage, requestPasswordReset } from "@/services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError("");

    try {
      const data = await requestPasswordReset(email);
      setMessage(data.message);
    } catch (err) {
      setError(getErrorMessage(err, "Could not request reset link"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f7f8fc] px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-[#dfe5f3] bg-white p-6 shadow-sm">
        <Link href="/login" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-[#5c7be8]">
          <ArrowLeft size={17} />
          Back to sign in
        </Link>
        <h1 className="text-3xl font-black tracking-tight text-[#141827]">Reset password</h1>
        <p className="mt-2 text-sm leading-6 text-[#687089]">Enter your email and the backend will generate a reset link.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="app-input"
            placeholder="Email"
            type="email"
            required
          />
          {message && <div className="rounded-xl border border-[#cfe8d8] bg-[#f2fbf5] p-3 text-sm font-semibold text-[#2f7b4b]">{message}</div>}
          {error && <div className="rounded-xl border border-[#ffd5d5] bg-[#fff5f5] p-3 text-sm font-semibold text-[#a73838]">{error}</div>}
          <button disabled={isSubmitting} className="app-button w-full bg-[#5c7be8] text-white">
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            Send reset link
          </button>
        </form>
      </section>
    </main>
  );
}
