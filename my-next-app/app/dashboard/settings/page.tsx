"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Shield, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";
import { changePassword, getErrorMessage } from "@/services/authService";

export default function SettingsPage() {
  const router = useRouter();
  const { user, deleteAccount } = useAuth();
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handlePasswordChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const data = await changePassword(passwords.oldPassword, passwords.newPassword);
      setMessage(data.message);
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (err) {
      setError(getErrorMessage(err, "Could not update password"));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteAccount() {
    setError("");
    await deleteAccount();
    router.replace("/");
  }

  return (
    <div className="max-w-3xl px-5 py-8 md:px-8">
      <header className="mb-8">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#6d7893]">Account</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-[#141827]">Settings</h1>
      </header>

      <section className="mb-5 rounded-2xl border border-[#dfe5f3] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[#eef2ff] text-lg font-black uppercase text-[#5c7be8]">
            {user?.username?.slice(0, 1) ?? "U"}
          </span>
          <div>
            <h2 className="text-lg font-black text-[#141827]">{user?.username ?? "User"}</h2>
            <p className="text-sm text-[#687089]">{user?.email ?? "Authenticated workspace"}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#dfe5f3] bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <Shield size={21} className="text-[#5c7be8]" />
          <h2 className="text-xl font-black text-[#141827]">Change password</h2>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <input
            value={passwords.oldPassword}
            onChange={(event) => setPasswords((current) => ({ ...current, oldPassword: event.target.value }))}
            className="app-input"
            placeholder="Current password"
            type="password"
            required
          />
          <input
            value={passwords.newPassword}
            onChange={(event) => setPasswords((current) => ({ ...current, newPassword: event.target.value }))}
            className="app-input"
            placeholder="New password"
            type="password"
            required
          />

          {message && <div className="rounded-xl border border-[#cfe8d8] bg-[#f2fbf5] p-3 text-sm font-semibold text-[#2f7b4b]">{message}</div>}
          {error && <div className="rounded-xl border border-[#ffd5d5] bg-[#fff5f5] p-3 text-sm font-semibold text-[#a73838]">{error}</div>}

          <button disabled={isSaving} className="app-button bg-[#5c7be8] text-white">
            {isSaving && <Loader2 size={17} className="animate-spin" />}
            Update password
          </button>
        </form>
      </section>

      <section className="mt-5 rounded-2xl border border-[#ffd5d5] bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black text-[#141827]">Danger zone</h2>
        <p className="mt-2 text-sm leading-6 text-[#687089]">
          Deleting your account signs you out and disables the account on the backend.
        </p>
        <button onClick={handleDeleteAccount} className="app-button mt-4 border border-[#ffd5d5] bg-[#fff5f5] text-[#bd3f3f]">
          <Trash2 size={17} />
          Delete account
        </button>
      </section>
    </div>
  );
}
