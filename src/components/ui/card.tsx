import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const cardVariants = cva(
  "rounded-2xl border text-card-foreground transition-all duration-200",
  {
    variants: {
      variant: {
        default: "bg-card border-border shadow-sm hover:shadow-md",
        glass: "glass border-white/20 shadow-lg",
        "glass-subtle": "glass-subtle border-white/10",
        elevated: "bg-card border-border shadow-elevated hover:shadow-floating",
        gradient: "bg-gradient-to-br from-card to-muted/50 border-border/50 shadow-sm",
        outline: "bg-transparent border-2 border-border hover:border-primary/30",
        ghost: "bg-transparent border-transparent hover:bg-muted/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, className }))}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight text-lg", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

// Additional component for card with accent border
const CardAccent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { accentColor?: string }
>(({ className, accentColor = "primary", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border text-card-foreground bg-card shadow-sm overflow-hidden relative",
      className
    )}
    {...props}
  >
    <div 
      className={cn(
        "absolute top-0 left-0 right-0 h-1",
        accentColor === "primary" && "bg-primary",
        accentColor === "success" && "bg-emerald-500",
        accentColor === "warning" && "bg-amber-500",
        accentColor === "destructive" && "bg-destructive",
        accentColor === "gradient" && "bg-gradient-to-r from-primary via-violet-500 to-fuchsia-500",
      )} 
    />
    <div className="pt-6">{props.children}</div>
  </div>
));
CardAccent.displayName = "CardAccent";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, CardAccent, cardVariants };
