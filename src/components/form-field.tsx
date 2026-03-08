"use client";

const INPUT_CLASS =
  "h-11 rounded-lg border border-zinc-300 bg-white px-3 text-sm text-zinc-900 " +
  "outline-none transition focus:border-zinc-900 focus:ring-2 focus:ring-zinc-900/20 " +
  "dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 " +
  "dark:focus:border-zinc-100 dark:focus:ring-zinc-100/20";

interface FormFieldProps {
  id: string;
  label: string;
  type: "email" | "password" | "text";
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

/**
 * A labelled form input with inline error display.
 * Reused across the login and register forms.
 */
export function FormField({
  id,
  label,
  type,
  autoComplete,
  value,
  onChange,
  error,
}: FormFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={INPUT_CLASS}
      />
      {error && (
        <p id={errorId} className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
