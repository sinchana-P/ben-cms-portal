import { useState } from "react";
import { TRACKER, TRACKER_SUMMARY } from "@/data/featureTracker";
import type { TrackerStatus } from "@/types";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, CircleDashed, CircleDot, Accessibility, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const STATUS_META: Record<TrackerStatus, { variant: "success" | "warning" | "destructive"; Icon: typeof CheckCircle2 }> = {
  Have: { variant: "success", Icon: CheckCircle2 },
  Partial: { variant: "warning", Icon: CircleDot },
  Gap: { variant: "destructive", Icon: CircleDashed },
};

export default function Coverage() {
  const [filter, setFilter] = useState<TrackerStatus | "all">("all");
  const areas = Array.from(new Set(TRACKER.map((t) => t.area)));
  const rows = TRACKER.filter((t) => filter === "all" || t.status === filter);

  return (
    <div>
      <PageHeader
        eyebrow="RFP 90DETR-S3794"
        title="RFP Requirement Coverage"
        description="Live map of every RFP requirement against the solution — Have, Partial (configure/extend), or Gap (build). Scored presentation factors are flagged."
      />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Built (Have)" value={TRACKER_SUMMARY.have} icon={CheckCircle2} tone="success" />
        <StatCard label="Configure / Extend" value={TRACKER_SUMMARY.partial} icon={CircleDot} tone="warning" />
        <StatCard label="Build (Gap)" value={TRACKER_SUMMARY.gap} icon={CircleDashed} />
        <StatCard label="Total tracked" value={TRACKER_SUMMARY.total} icon={FileText} tone="info" />
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
          <Accessibility className="h-6 w-6 shrink-0 text-primary" />
          <div><div className="text-sm font-semibold">Presentation Factor #1 — Accessibility</div><div className="text-xs text-muted-foreground">500 points · the largest user group is blind</div></div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 p-3">
          <FileText className="h-6 w-6 shrink-0 text-primary" />
          <div><div className="text-sm font-semibold">Presentation Factor #2 — BEN Forms &amp; Workflows</div><div className="text-xs text-muted-foreground">400 points · the P&L → approval loop</div></div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", "Have", "Partial", "Gap"] as const).map((s) => (
          <Button key={s} variant={filter === s ? "default" : "outline"} size="sm" onClick={() => setFilter(s)}>
            {s === "all" ? "All" : s}
          </Button>
        ))}
      </div>

      <div className="space-y-5">
        {areas.map((area) => {
          const items = rows.filter((t) => t.area === area);
          if (items.length === 0) return null;
          return (
            <div key={area}>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{area}</h2>
              <Card>
                <CardContent className="divide-y p-0">
                  {items.map((t) => {
                    const meta = STATUS_META[t.status];
                    return (
                      <div key={t.id} className="flex items-start gap-3 p-3.5">
                        <meta.Icon className={cn("mt-0.5 h-4 w-4 shrink-0",
                          t.status === "Have" ? "text-success" : t.status === "Partial" ? "text-warning" : "text-destructive")} />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs text-muted-foreground">{t.id}</span>
                            <span className="text-sm font-medium">{t.requirement}</span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            <span>{t.ref}</span>·<span>{t.buildType}</span>·<span>{t.priority}</span>
                            {t.notes && <>·<span className="italic">{t.notes}</span></>}
                          </div>
                        </div>
                        <Badge variant={meta.variant}>{t.status}</Badge>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
