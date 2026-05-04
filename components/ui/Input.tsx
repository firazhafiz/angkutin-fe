"use client";

import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === "password";

    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-sm font-semibold text-dark block px-1">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={isPassword ? (showPassword ? "text" : "password") : type}
            className={cn(
              "flex h-12 w-full rounded-md border-2 border-gray-200 bg-white px-4 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none  focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-all",
              error && "border-red-500 focus-visible:ring-red-500/20",
              isPassword && "pr-12",
              className,
            )}
            ref={ref}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-500 font-medium px-1">{error}</p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
