"use client";

import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-sky-500 text-white hover:bg-sky-600 shadow-md hover:shadow-lg active:scale-[0.98]",
  secondary:
    "bg-slate-100 text-slate-700 hover:bg-slate-200 active:scale-[0.98]",
  outline:
    "border-2 border-sky-500 text-sky-600 hover:bg-sky-50 active:scale-[0.98]",
  navy: "bg-sky-900 text-white hover:bg-sky-950 shadow-md hover:shadow-lg active:scale-[0.98]",
  ghost: "text-slate-600 hover:bg-slate-100 active:scale-[0.98]",
  danger: "bg-red-500 text-white hover:bg-red-600 active:scale-[0.98]",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-xl",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  disabled,
  loading,
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
