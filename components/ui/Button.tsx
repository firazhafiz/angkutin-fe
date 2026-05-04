"use client";

import React from "react";
import { cn } from "@/lib/cn";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      children,
      ...props
    },
    ref,
  ) => {
    const variants = {
      primary: "bg-primary text-white hover:bg-primary/90 ",
      secondary: "bg-secondary text-white hover:bg-secondary/90 ",
      outline: "border-2 border-gray-200 bg-white text-dark hover:bg-gray-50",
      ghost: "text-primary hover:bg-primary/10",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs",
      md: "h-11 px-6 text-sm font-semibold",
      lg: "h-14 px-8 text-base font-bold",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-full transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className,
        )}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button };
