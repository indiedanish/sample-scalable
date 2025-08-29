import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full bg-white border-2 border-black px-4 py-3 text-sm font-mono shadow-[inset_2px_2px_0px_rgba(0,0,0,0.1)] transition-all duration-200 focus:outline-none focus:border-primary focus:shadow-[inset_2px_2px_0px_rgba(0,0,0,0.1),0_0_0_2px_rgba(0,50,40,0.2)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
