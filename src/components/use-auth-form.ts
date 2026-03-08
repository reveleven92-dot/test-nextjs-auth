"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/components/toast";
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  type ValidationError,
} from "@/lib/validation";

interface UseAuthFormOptions {
  mode: "login" | "register";
}

/**
 * Custom hook encapsulating auth-form state, validation, and submission.
 */
export function useAuthForm({ mode }: UseAuthFormOptions) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const isRegister = mode === "register";

  function runClientValidation(): boolean {
    const errors: Record<string, string> = {};
    const emailErr = validateEmail(email);
    if (emailErr) errors[emailErr.field] = emailErr.message;

    const passErr = validatePassword(password);
    if (passErr) errors[passErr.field] = passErr.message;

    if (isRegister) {
      const confirmErr = validateConfirmPassword(password, confirmPassword);
      if (confirmErr) errors[confirmErr.field] = confirmErr.message;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function applyServerErrors(error: string | ValidationError[] | null) {
    if (!error) return;
    if (typeof error === "string") {
      showToast("error", error);
      return;
    }
    const mapped: Record<string, string> = {};
    for (const e of error) {
      mapped[e.field] = e.message;
    }
    setFieldErrors(mapped);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!runClientValidation()) return;

    setSubmitting(true);
    setFieldErrors({});

    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const payload: Record<string, string> = { email, password };
    if (isRegister) payload.confirmPassword = confirmPassword;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        applyServerErrors(json.error);
        return;
      }

      showToast("success", isRegister ? "Account created!" : "Welcome back!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      showToast("error", "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return {
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
  };
}
