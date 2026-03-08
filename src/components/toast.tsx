"use client";

import { useEffect, useState, useCallback } from "react";

export type ToastType = "success" | "error";

interface ToastMessage {
  id: number;
  type: ToastType;
  text: string;
}

let toastId = 0;
let addToastFn: ((type: ToastType, text: string) => void) | null = null;

/**
 * Show a toast notification from anywhere in the app.
 * The ToastProvider must be mounted for this to work.
 */
export function showToast(type: ToastType, text: string) {
  if (addToastFn) {
    addToastFn(type, text);
  }
}

export function ToastProvider() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastType, text: string) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, text }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    addToastFn = addToast;
    return () => {
      addToastFn = null;
    };
  }, [addToast]);

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const bgColor =
    toast.type === "success"
      ? "bg-green-600 dark:bg-green-700"
      : "bg-red-600 dark:bg-red-700";

  return (
    <div
      role="alert"
      className={`${bgColor} flex min-w-[280px] items-center justify-between rounded-lg px-4 py-3 text-sm text-white shadow-lg`}
    >
      <span>{toast.text}</span>
      <button
        onClick={onDismiss}
        className="ml-3 rounded p-1 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Dismiss notification"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
