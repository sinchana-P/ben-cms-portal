import { cn } from "@/lib/utils";

export function BenMark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 64 64" className="h-8 w-8 shrink-0" aria-hidden>
        <rect width="64" height="64" rx="14" fill="hsl(var(--ben-heading))" />
        <path
          d="M20 16h13c6 0 10 3.4 10 8.6 0 3.3-1.7 5.7-4.6 7 3.6 1.1 5.8 3.8 5.8 7.6 0 5.6-4.3 8.8-11 8.8H20z"
          fill="none"
          stroke="hsl(var(--ben-highlight))"
          strokeWidth="3.4"
          strokeLinejoin="round"
        />
      </svg>
      <div className="leading-tight">
        <div className="text-sm font-bold tracking-tight text-foreground">BEN</div>
        <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Case Management</div>
      </div>
    </div>
  );
}
