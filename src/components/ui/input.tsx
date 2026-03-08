/**
 * Input component following shadcn/ui patterns.
 */

import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", error = false, ...props }, ref) => {
    const classes = [
      "flex h-10 w-full rounded-md border px-3 py-2 text-sm",
      "ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium",
      "placeholder:text-zinc-500",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "dark:ring-offset-zinc-950 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300",
      error
        ? "border-red-500 dark:border-red-400"
        : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950",
      className,
    ].join(" ");

    return <input ref={ref} className={classes} {...props} />;
  }
);

Input.displayName = "Input";

export { Input };
