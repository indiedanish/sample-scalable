import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ripple material-transition",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary-600 shadow-material-2 hover:shadow-material-4 hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-material-2 hover:shadow-material-4 hover:-translate-y-0.5",
        outline:
          "border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground shadow-material-1 hover:shadow-material-3 hover:-translate-y-0.5",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-600 shadow-material-2 hover:shadow-material-4 hover:-translate-y-0.5",
        ghost:
          "hover:bg-accent hover:text-accent-foreground hover:shadow-material-1",
        link: "text-primary underline-offset-4 hover:underline",
        accent:
          "bg-accent text-accent-foreground hover:bg-accent-600 shadow-material-2 hover:shadow-material-4 hover:-translate-y-0.5",
        success:
          "bg-success text-success-foreground hover:bg-success/90 shadow-material-2 hover:shadow-material-4 hover:-translate-y-0.5",
        warning:
          "bg-warning text-warning-foreground hover:bg-warning/90 shadow-material-2 hover:shadow-material-4 hover:-translate-y-0.5",
        info: "bg-info text-info-foreground hover:bg-info/90 shadow-material-2 hover:shadow-material-4 hover:-translate-y-0.5",
        fab: "bg-primary text-primary-foreground rounded-full shadow-material-4 hover:shadow-material-8 hover:-translate-y-1 hover:scale-105",
      },
      size: {
        default: "h-11 px-6 py-3",
        sm: "h-9 rounded-lg px-4 py-2",
        lg: "h-12 rounded-lg px-8 py-3 text-base",
        xl: "h-14 rounded-lg px-10 py-4 text-lg",
        icon: "h-11 w-11",
        fab: "h-16 w-16",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
