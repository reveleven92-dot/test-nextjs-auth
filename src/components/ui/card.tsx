/**
 * Card components following shadcn/ui patterns.
 */

import { HTMLAttributes, forwardRef } from "react";

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => {
    const classes = [
      "rounded-lg border border-zinc-200 bg-white text-zinc-950 shadow-sm",
      "dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50",
      className,
    ].join(" ");
    return <div ref={ref} className={classes} {...props} />;
  }
);
Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => {
    const classes = ["flex flex-col space-y-1.5 p-6", className].join(" ");
    return <div ref={ref} className={classes} {...props} />;
  }
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<
  HTMLHeadingElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className = "", ...props }, ref) => {
  const classes = [
    "text-2xl font-semibold leading-none tracking-tight",
    className,
  ].join(" ");
  return <h3 ref={ref} className={classes} {...props} />;
});
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className = "", ...props }, ref) => {
  const classes = ["text-sm text-zinc-500 dark:text-zinc-400", className].join(
    " "
  );
  return <p ref={ref} className={classes} {...props} />;
});
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => {
    const classes = ["p-6 pt-0", className].join(" ");
    return <div ref={ref} className={classes} {...props} />;
  }
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => {
    const classes = ["flex items-center p-6 pt-0", className].join(" ");
    return <div ref={ref} className={classes} {...props} />;
  }
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
