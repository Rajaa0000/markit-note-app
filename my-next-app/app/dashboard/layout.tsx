"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckSquare, FileText, LogOut, Menu, PenLine, Search, Settings, X } from "lucide-react";
import { useAuth } from "@/lib/AuthProvider";

const navItems = [
  { href: "/dashboard/notes", label: "My Notes", icon: FileText },
  { href: "/dashboard/todolists", label: "My Tasks", icon: CheckSquare },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isSigningOut) router.replace("/login");
  }, [isAuthenticated, isLoading, isSigningOut, router]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  async function handleLogout() {
    setIsSigningOut(true);
    try {
      await logout();
    } finally {
      router.replace("/");
    }
  }

  if (isLoading || isSigningOut) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8fc]">
        <div className="rounded-xl border border-[#dfe5f3] bg-white px-5 py-4 text-sm font-semibold text-[#5d6680] shadow-sm">
          {isSigningOut ? "Signing you out..." : "Restoring your workspace..."}
        </div>
      </main>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <main className="grid min-h-screen bg-[#f7f8fc] text-[#141827] lg:grid-cols-[304px_1fr]">
      <aside className="hidden border-b border-[#dfe5f3] bg-white lg:flex lg:min-h-screen lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex w-full items-center justify-between gap-4 border-b border-[#dfe5f3] px-6 py-5 lg:h-[72px]">
          <Link href="/dashboard/notes" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#8da2f7] text-[#5c7be8]">
              <PenLine size={20} />
            </span>
            <span className="text-2xl font-black tracking-tight text-[#25306f]">markIT</span>
          </Link>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-4 py-4 lg:flex-col lg:overflow-visible">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-w-fit items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                  active
                    ? "bg-[#eef2ff] text-[#5c7be8]"
                    : "text-[#60708d] hover:bg-[#f4f6fb] hover:text-[#25306f]"
                }`}
              >
                <Icon size={19} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto hidden border-t border-[#dfe5f3] p-6 lg:block">
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#eef2ff] text-sm font-black uppercase text-[#5c7be8]">
              {user?.username?.slice(0, 1) ?? "U"}
            </span>
            <div className="min-w-0">
              <p className="truncate font-bold text-[#141827]">{user?.username ?? "Workspace"}</p>
              <p className="truncate text-sm text-[#687089]">{user?.email ?? "Signed in"}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-bold text-[#60708d] hover:bg-[#f4f6fb]"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      <section className="min-w-0">
        <div className="sticky top-0 z-10 flex h-[72px] items-center gap-4 border-b border-[#dfe5f3] bg-[#f7f8fc]/95 px-5 backdrop-blur md:px-8">
          <Link href="/dashboard/notes" className="flex items-center gap-3 lg:hidden">
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#8da2f7] text-[#5c7be8]">
              <PenLine size={20} />
            </span>
            <span className="text-2xl font-black tracking-tight text-[#25306f]">markIT</span>
          </Link>
          <div className="hidden w-full max-w-xl items-center gap-2 rounded-2xl border border-[#dfe5f3] bg-[#eef3fb] px-4 py-3 text-[#8b96ad] md:flex">
            <Search size={18} />
            <span className="text-sm">Use the page search to find notes and tasks fast</span>
          </div>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="ml-auto grid h-11 w-11 place-items-center rounded-xl border border-[#dfe5f3] bg-white text-[#60708d] shadow-sm lg:hidden"
            aria-label="Open menu"
            aria-expanded={isMenuOpen}
          >
            <Menu size={21} />
          </button>
        </div>
        {children}
      </section>

      {isMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <button
            className="absolute inset-0 bg-[#111827]/35 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu overlay"
          />
          <aside className="absolute right-0 top-0 flex h-full w-full max-w-[320px] flex-col border-l border-[#dfe5f3] bg-white shadow-2xl">
            <div className="flex h-[72px] items-center justify-between border-b border-[#dfe5f3] px-5">
              <Link href="/dashboard/notes" className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-[#8da2f7] text-[#5c7be8]">
                  <PenLine size={20} />
                </span>
                <span className="text-2xl font-black tracking-tight text-[#25306f]">markIT</span>
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-xl hover:bg-[#f4f6fb]"
                aria-label="Close menu"
              >
                <X size={21} />
              </button>
            </div>

            <nav className="flex flex-col gap-2 p-4">
              {navItems.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                      active
                        ? "bg-[#eef2ff] text-[#5c7be8]"
                        : "text-[#60708d] hover:bg-[#f4f6fb] hover:text-[#25306f]"
                    }`}
                  >
                    <Icon size={19} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto border-t border-[#dfe5f3] p-5">
              <div className="mb-4 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#eef2ff] text-sm font-black uppercase text-[#5c7be8]">
                  {user?.username?.slice(0, 1) ?? "U"}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-bold text-[#141827]">{user?.username ?? "Workspace"}</p>
                  <p className="truncate text-sm text-[#687089]">{user?.email ?? "Signed in"}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-[#60708d] hover:bg-[#f4f6fb]"
              >
                <LogOut size={18} />
                Sign out
              </button>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
