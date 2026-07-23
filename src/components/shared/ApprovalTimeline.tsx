import type { BenCase, BenForm, Role } from "@/types";
import { ROLE_LABEL } from "@/data/personas";
import { formatDateTime } from "@/lib/utils";
import { Check, Circle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Visualizes the uniform two-tier approval chain (Operator → BEO → Chief)
 *  and the actual case timeline. Handles the reverse-init (operator signs)
 *  and BEO-only (Throw Log) shapes. */
export function ApprovalChain({ form, currentState }: { form: BenForm; currentState: string }) {
  const steps: { role: Role; label: string }[] = [];
  if (form.operatorAcknowledges) {
    steps.push({ role: "beo", label: "BEO completes" });
    steps.push({ role: "operator", label: "Operator signs" });
    form.approvalChain.forEach((r) => steps.push({ role: r, label: `${ROLE_LABEL[r]} approves` }));
  } else {
    steps.push({ role: "operator", label: "Operator submits" });
    form.approvalChain.forEach((r) => steps.push({ role: r, label: `${ROLE_LABEL[r]} approves` }));
  }

  const doneStates = ["approved", "paid", "acknowledged", "reviewed", "closed"];
  const isDone = doneStates.includes(currentState);
  const activeIndex = isDone
    ? steps.length
    : currentState === "submitted" || currentState === "beo_review"
    ? 1
    : currentState === "beo_approved" || currentState === "chief_review"
    ? 2
    : currentState === "awaiting_ack"
    ? 1
    : 1;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {steps.map((s, i) => {
        const complete = i < activeIndex;
        const active = i === activeIndex && !isDone;
        return (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                complete && "border-success/30 bg-success-soft text-success",
                active && "border-warning/40 bg-warning-soft text-warning",
                !complete && !active && "border-border bg-muted/50 text-muted-foreground"
              )}
            >
              {complete ? <Check className="h-3 w-3" aria-hidden /> : <Circle className="h-3 w-3" aria-hidden />}
              {s.label}
            </div>
            {i < steps.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />}
          </div>
        );
      })}
    </div>
  );
}

export function CaseTimeline({ caseItem }: { caseItem: BenCase }) {
  return (
    <ol className="space-y-0">
      {caseItem.timeline.map((t, i) => {
        const last = i === caseItem.timeline.length - 1;
        return (
          <li key={i} className="relative flex gap-3 pb-5 last:pb-0">
            {!last && <span className="absolute left-[9px] top-5 h-full w-px bg-border" aria-hidden />}
            <span
              className={cn(
                "mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full",
                last ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}
            >
              <Check className="h-3 w-3" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-medium capitalize">{t.state.replace(/_/g, " ")}</p>
                <time className="text-xs text-muted-foreground">{formatDateTime(t.at)}</time>
              </div>
              <p className="text-xs text-muted-foreground">
                {t.actor} · {ROLE_LABEL[t.role]}
              </p>
              {t.note && <p className="mt-1 text-sm text-foreground/80">{t.note}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
