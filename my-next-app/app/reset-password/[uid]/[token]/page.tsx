"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { confirmPasswordReset, getErrorMessage } from "@/services/authService";

export default function ResetPasswordConfirmPage() {
  const params = useParams<{ uid: string; token: string }>();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setError("");

    try {
      const data = await confirmPasswordReset(params.uid, params.token, password);
      setMessage(data.message);
      setPassword("");
    } catch (err) {
      setError(getErrorMessage(err, "Could not reset password"));
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
        <h1 className="text-3xl font-black tracking-tight text-[#141827]">Choose a new password</h1>
        <p className="mt-2 text-sm leading-6 text-[#687089]">Your existing sessions will be invalidated after this update.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="app-input"
            placeholder="New password"
            type="password"
            required
          />
          {message && <div className="rounded-xl border border-[#cfe8d8] bg-[#f2fbf5] p-3 text-sm font-semibold text-[#2f7b4b]">{message}</div>}
          {error && <div className="rounded-xl border border-[#ffd5d5] bg-[#fff5f5] p-3 text-sm font-semibold text-[#a73838]">{error}</div>}
          <button disabled={isSubmitting} className="app-button w-full bg-[#5c7be8] text-white">
            {isSubmitting && <Loader2 size={18} className="animate-spin" />}
            Update password
          </button>
        </form>
      </section>
    </main>
  );
}
