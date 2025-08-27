import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border-2 border-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border-primary hover:bg-foreground hover:text-background hover:border-foreground",
        secondary:
          "bg-secondary text-secondary-foreground border-secondary hover:bg-foreground hover:text-background hover:border-foreground",
        destructive:
          "bg-destructive text-destructive-foreground border-destructive hover:bg-foreground hover:text-background hover:border-foreground",
        outline: "text-foreground border-foreground hover:bg-foreground hover:text-background",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
