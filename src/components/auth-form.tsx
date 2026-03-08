"use client";

import Link from "next/link";
import { FormField } from "@/components/form-field";
import { useAuthForm } from "@/components/use-auth-form";

interface AuthFormProps {
  mode: "login" | "register";
}

/**
 * Shared login / register form component.
 * Logic lives in useAuthForm; field rendering uses FormField.
 */
export function AuthForm({ mode }: AuthFormProps) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    fieldErrors,
    submitting,
    isRegister,
    handleSubmit,
  } = useAuthForm({ mode });

  const title = isRegister ? "Create an account" : "Sign in to your account";
  const submitLabel = isRegister ? "Create account" : "Sign in";
  const altText = isRegister
    ? "Already have an account?"
    : "Don\u2019t have an account?";
  const altLink = isRegister ? "/login" : "/register";
  const altLinkLabel = isRegister ? "Sign in" : "Create one";

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <main className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="mb-6 text-center text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          {title}
        </h1>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <FormField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={setEmail}
            error={fieldErrors.email}
          />

          <FormField
            id="password"
            label="Password"
            type="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            value={password}
            onChange={setPassword}
            error={fieldErrors.password}
          />

          {isRegister && (
            <FormField
              id="confirmPassword"
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              error={fieldErrors.confirmPassword}
            />
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 flex h-11 items-center justify-center rounded-lg bg-zinc-900 text-sm font-medium text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-900/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus:ring-zinc-100/50"
          >
            {submitting ? "Please wait\u2026" : submitLabel}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {altText}{" "}
          <Link
            href={altLink}
            className="font-medium text-zinc-900 underline underline-offset-2 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
          >
            {altLinkLabel}
          </Link>
        </p>
      </main>
    </div>
  );
}
