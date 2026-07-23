import { Badge } from "@/components/ui/badge";
import {
  CircleDot, Clock, CheckCircle2, XCircle, PenLine, Eye,
  DollarSign, Loader2, PauseCircle, Archive, AlertTriangle,
} from "lucide-react";

type Meta = { label: string; variant: "success" | "warning" | "info" | "destructive" | "muted" | "secondary"; Icon: typeof CircleDot };

const MAP: Record<string, Meta> = {
  // case states
  draft: { label: "Draft", variant: "muted", Icon: CircleDot },
  submitted: { label: "Submitted", variant: "info", Icon: Clock },
  beo_review: { label: "BEO Review", variant: "warning", Icon: Eye },
  beo_approved: { label: "BEO Approved", variant: "info", Icon: CheckCircle2 },
  chief_review: { label: "Chief Review", variant: "warning", Icon: Eye },
  approved: { label: "Approved", variant: "success", Icon: CheckCircle2 },
  rejected: { label: "Rejected", variant: "destructive", Icon: XCircle },
  awaiting_ack: { label: "Awaiting Signature", variant: "warning", Icon: PenLine },
  acknowledged: { label: "Signed", variant: "success", Icon: CheckCircle2 },
  reviewed: { label: "Reviewed", variant: "success", Icon: CheckCircle2 },
  paid: { label: "Paid", variant: "success", Icon: DollarSign },
  closed: { label: "Closed", variant: "muted", Icon: Archive },
  // ticket states
  under_review: { label: "Under Review", variant: "warning", Icon: Eye },
  assigned: { label: "Assigned", variant: "info", Icon: CircleDot },
  in_progress: { label: "In Progress", variant: "warning", Icon: Loader2 },
  resolved: { label: "Resolved", variant: "success", Icon: CheckCircle2 },
  rescheduled: { label: "Rescheduled", variant: "info", Icon: Clock },
  // operator statuses
  applicant: { label: "Applicant", variant: "muted", Icon: CircleDot },
  orientation: { label: "Orientation", variant: "info", Icon: CircleDot },
  training: { label: "BEN Training", variant: "info", Icon: CircleDot },
  interim: { label: "Interim", variant: "warning", Icon: Clock },
  licensed: { label: "Licensed", variant: "success", Icon: CheckCircle2 },
  suspended: { label: "Suspended", variant: "destructive", Icon: PauseCircle },
  archived: { label: "Archived", variant: "muted", Icon: Archive },
  // payment statuses
  pending: { label: "Pending", variant: "muted", Icon: Clock },
  processing: { label: "Processing", variant: "warning", Icon: Loader2 },
  completed: { label: "Completed", variant: "success", Icon: CheckCircle2 },
  failed: { label: "Failed", variant: "destructive", Icon: AlertTriangle },
  // site / generic
  active: { label: "Active", variant: "success", Icon: CheckCircle2 },
  onboarding: { label: "Onboarding", variant: "info", Icon: CircleDot },
  open: { label: "Open", variant: "success", Icon: CircleDot },
  awarded: { label: "Awarded", variant: "info", Icon: CheckCircle2 },
};

export function StatusBadge({ state, label }: { state: string; label?: string }) {
  const meta = MAP[state] ?? { label: label ?? state, variant: "muted" as const, Icon: CircleDot };
  const { Icon } = meta;
  return (
    <Badge variant={meta.variant} className="font-medium">
      <Icon aria-hidden className={state === "in_progress" || state === "processing" ? "animate-spin" : ""} />
      {label ?? meta.label}
    </Badge>
  );
}
