/**
 * Label component following shadcn/ui patterns.
 */

import { LabelHTMLAttributes, forwardRef } from "react";

const Label = forwardRef<
  HTMLLabelElement,
  LabelHTMLAttributes<HTMLLabelElement>
>(({ className = "", ...props }, ref) => {
  const classes = [
    "text-sm font-medium leading-none",
    "peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    className,
  ].join(" ");

  return <label ref={ref} className={classes} {...props} />;
});

Label.displayName = "Label";

export { Label };
