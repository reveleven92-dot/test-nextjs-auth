"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/toast";

interface UserData {
  id: string;
  email: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const json = await res.json();
        setUser(json.data.user);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [router]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    showToast("success", "You have been logged out.");
    router.push("/login");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <main className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="mb-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Dashboard
        </h1>
        <p className="mb-6 text-sm text-zinc-500 dark:text-zinc-400">
          Welcome! You are signed in.
        </p>

        {user && (
          <div className="mb-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium text-zinc-600 dark:text-zinc-300">
                  Email
                </dt>
                <dd className="text-zinc-900 dark:text-zinc-100">
                  {user.email}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-zinc-600 dark:text-zinc-300">
                  User ID
                </dt>
                <dd className="text-zinc-900 dark:text-zinc-100">{user.id}</dd>
              </div>
            </dl>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex h-11 w-full items-center justify-center rounded-lg border border-zinc-300 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/20 focus:ring-offset-2 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:focus:ring-zinc-100/20"
        >
          Sign out
        </button>
      </main>
    </div>
  );
}
