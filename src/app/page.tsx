import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <main className="flex w-full max-w-md flex-col items-center gap-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          test-nextjs-auth
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          A Next.js authentication demo with login, registration, and protected routes.
        </p>
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="flex h-12 w-full items-center justify-center rounded-lg bg-zinc-900 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 sm:w-40"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="flex h-12 w-full items-center justify-center rounded-lg border border-zinc-300 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800 sm:w-40"
          >
            Create account
          </Link>
        </div>
      </main>
    </div>
  );
}
