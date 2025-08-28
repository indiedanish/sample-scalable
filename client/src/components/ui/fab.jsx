import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

const FloatingActionButton = React.forwardRef(
  (
    { className, variant = "default", size = "default", children, ...props },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "fixed bottom-8 right-8 rounded-full shadow-material-4 hover:shadow-material-8 fab-hover z-50",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);
FloatingActionButton.displayName = "FloatingActionButton";

export { FloatingActionButton };
