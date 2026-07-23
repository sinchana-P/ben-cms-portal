import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Sparkline } from "./Sparkline";
import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

export function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  tone = "default",
  data,
  trend,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon?: LucideIcon;
  tone?: "default" | "success" | "warning" | "info";
  data?: number[];
  trend?: { dir: "up" | "down"; label: string };
}) {
  const toneRing = {
    default: "text-primary bg-primary/10",
    success: "text-success bg-success-soft",
    warning: "text-warning bg-warning-soft",
    info: "text-info bg-info-soft",
  }[tone];
  const sparkTone = {
    default: "text-primary",
    success: "text-success",
    warning: "text-warning",
    info: "text-info",
  }[tone];

  return (
    <Card interactive className="relative overflow-hidden p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="mt-1.5 text-2xl font-bold tabular-nums tracking-tight text-foreground">{value}</div>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs">
            {trend && (
              <span className={cn("inline-flex items-center gap-0.5 font-semibold", trend.dir === "up" ? "text-success" : "text-destructive")}>
                {trend.dir === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {trend.label}
              </span>
            )}
            {sub && <span className="truncate text-muted-foreground">{sub}</span>}
          </div>
        </div>
        {Icon && (
          <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", toneRing)}>
            <Icon className="h-5 w-5" aria-hidden />
          </div>
        )}
      </div>
      {data && data.length > 1 && (
        <div className="mt-2 -mb-1"><Sparkline data={data} strokeClassName={sparkTone} /></div>
      )}
    </Card>
  );
}
