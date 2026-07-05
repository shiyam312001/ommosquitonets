import { cn } from "@/lib/utils";

export default function Card({
  children,
  className,
  hover = false,
  padding = true,
  ...props
}) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-slate-100 shadow-sm",
        hover && "transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
        padding && "p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
