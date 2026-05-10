import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "flex w-full rounded-xl border bg-transparent px-4 py-2.5 text-sm shadow-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-input bg-background hover:border-primary/30",
        filled: "border-transparent bg-muted hover:bg-muted/80",
        glass: "border-white/20 bg-white/50 backdrop-blur-sm hover:bg-white/80",
      },
      sizing: {
        default: "h-11",
        sm: "h-9 px-3 py-1.5 text-xs",
        lg: "h-13 px-5 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      sizing: "default",
    },
  }
);

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & VariantProps<typeof inputVariants>
>(({ className, variant, sizing, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(inputVariants({ variant, sizing, className }))}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input, inputVariants };