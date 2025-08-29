import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-bold uppercase tracking-wider transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-white border-2 border-black text-black hover:bg-black hover:text-white shadow-[3px_3px_0px_rgba(0,0,0,0.8)] hover:shadow-[5px_5px_0px_rgba(0,0,0,0.8)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_rgba(0,0,0,0.8)]",
        destructive:
          "bg-white border-2 border-destructive text-destructive hover:bg-destructive hover:text-white shadow-[3px_3px_0px_rgba(220,38,38,0.8)] hover:shadow-[5px_5px_0px_rgba(220,38,38,0.8)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_rgba(220,38,38,0.8)]",
        outline:
          "bg-white border-2 border-black text-black hover:bg-black hover:text-white shadow-[3px_3px_0px_rgba(0,0,0,0.8)] hover:shadow-[5px_5px_0px_rgba(0,0,0,0.8)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_rgba(0,0,0,0.8)]",
        secondary:
          "bg-white border-2 border-secondary text-secondary hover:bg-secondary hover:text-white shadow-[3px_3px_0px_rgba(59,130,246,0.8)] hover:shadow-[5px_5px_0px_rgba(59,130,246,0.8)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_rgba(59,130,246,0.8)]",
        ghost:
          "bg-transparent border-2 border-transparent text-black hover:bg-black hover:text-white hover:border-black shadow-[3px_3px_0px_rgba(0,0,0,0.8)] hover:shadow-[5px_5px_0px_rgba(0,0,0,0.8)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_rgba(0,0,0,0.8)]",
        link: "bg-transparent border-2 border-transparent text-primary underline-offset-4 hover:underline hover:bg-transparent hover:border-transparent shadow-none hover:shadow-none hover:translate-x-0 hover:translate-y-0",
      },
      size: {
        default: "h-12 px-6 py-3 text-sm",
        sm: "h-10 px-4 py-2 text-xs",
        lg: "h-14 px-8 py-4 text-base",
        icon: "h-12 w-12",
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
        className={cn(
          buttonVariants({ variant, size, className }),
          "font-mono"
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
