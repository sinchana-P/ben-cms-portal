import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { announcementById } from "@/data/announcements";
import { applicationsForAnnouncement, APPLICATION_STAGES } from "@/data/siteApplications";
import { operatorById } from "@/data/operators";
import { SITE_TYPE_LABEL } from "@/data/sites";
import type { SiteApplication } from "@/types";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription, DialogClose,
} from "@/components/ui/dialog";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import {
  ArrowLeft, FileText, FileCheck2, UploadCloud, Check, X, Award, AlertTriangle, Users, CalendarClock,
} from "lucide-react";

export default function ApplicationReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ann = announcementById(id ?? "");
  const [apps, setApps] = useState<SiteApplication[]>(() => applicationsForAnnouncement(id ?? ""));
  const [flash, setFlash] = useState<string | null>(null);

  if (!ann) return <p className="text-muted-foreground">Announcement not found.</p>;

  const awarded = apps.find((a) => a.outcome === "awarded");

  function setApp(appId: string, patch: Partial<SiteApplication>) {
    setApps((prev) => prev.map((a) => (a.id === appId ? { ...a, ...patch } : a)));
  }
  function award(app: SiteApplication) {
    setApps((prev) => prev.map((a) =>
      a.id === app.id ? { ...a, outcome: "awarded", stage: "assignment", awardLetter: true }
      : { ...a, outcome: a.outcome === "awarded" ? "in_progress" : "declined" }
    ));
    setFlash(`${app.applicantName} awarded ${ann!.siteName}. Site.assigned_operator set; ${app.applicantName}'s lifecycle advanced. Others marked not selected.`);
  }

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => navigate("/staff/announcements")} className="mb-3 -ml-2"><ArrowLeft className="h-4 w-4" /> Announcements</Button>
      <PageHeader
        eyebrow={`${ann.id} · Application review`}
        title={ann.siteName}
        description={`${SITE_TYPE_LABEL[ann.siteType]} · ${ann.hostAgency} · ${apps.length} application${apps.length !== 1 ? "s" : ""}`}
        actions={<Badge variant={ann.status === "open" ? "success" : "muted"}>{ann.status === "open" ? "Open" : "Closed"}</Badge>}
      />

      {flash && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-success/30 bg-success-soft px-4 py-2.5 text-sm font-medium text-success" role="status">
          <Award className="h-4 w-4" /> {flash}
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5"><CalendarClock className="h-4 w-4" /> Apply by {formatDate(ann.closesOn)}</span>
        {ann.estimatedAnnual != null && <span className="flex items-center gap-1.5">Est. {formatCurrency(ann.estimatedAnnual)}/yr</span>}
        <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> Reviewed on merit — no automated ranking</span>
      </div>

      <div className="space-y-4">
        {apps.map((app) => {
          const op = operatorById(app.operatorId);
          const atMax = (op?.siteIds.length ?? 0) >= 2;
          const stageIdx = APPLICATION_STAGES.findIndex((s) => s.key === app.stage);
          const isAwarded = app.outcome === "awarded";
          const isDeclined = app.outcome === "declined";
          return (
            <Card key={app.id} className={cn(isAwarded && "border-success/40", isDeclined && "opacity-70")}>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{app.applicantName}</CardTitle>
                    <p className="text-xs text-muted-foreground">{app.id} · submitted {formatDate(app.submittedOn)} · {op ? `${op.siteIds.length}/2 sites held` : "new applicant"}</p>
                  </div>
                  {isAwarded ? <Badge variant="success"><Award className="h-3 w-3" /> Awarded</Badge>
                    : isDeclined ? <Badge variant="destructive">Not selected</Badge>
                    : <StatusBadge state={app.stage === "submitted" ? "submitted" : "beo_review"} label={APPLICATION_STAGES[stageIdx]?.label} />}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {app.narrative && <p className="text-sm text-muted-foreground">"{app.narrative}"</p>}

                {/* Operator-submitted docs (M10 VR-1) */}
                <div>
                  <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Applicant documents</div>
                  <div className="flex flex-wrap gap-2">
                    <DocChip label="Business plan" ok={!!app.docs?.businessPlan} />
                    <DocChip label="Resume" ok={!!app.docs?.resume} />
                    <DocChip label={`Letters (${app.docs?.letters ?? 0})`} ok={(app.docs?.letters ?? 0) > 0} />
                  </div>
                </div>

                <Separator />

                {/* Staff-uploaded review artifacts (M10 §5) */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Staff review</span>
                  <Button size="sm" variant={app.scoringSheet ? "secondary" : "outline"} onClick={() => setApp(app.id, { scoringSheet: true })}>
                    {app.scoringSheet ? <><FileCheck2 className="h-4 w-4" /> Scoring sheet uploaded</> : <><UploadCloud className="h-4 w-4" /> Upload scoring sheet</>}
                  </Button>
                  <Button size="sm" variant={app.awardLetter ? "secondary" : "outline"} onClick={() => setApp(app.id, { awardLetter: true })} disabled={!isAwarded && !app.awardLetter}>
                    {app.awardLetter ? <><FileCheck2 className="h-4 w-4" /> Award letter uploaded</> : <><UploadCloud className="h-4 w-4" /> Upload award letter</>}
                  </Button>
                </div>

                {!awarded && !isDeclined && (
                  <div className="flex flex-wrap items-center gap-2">
                    <AwardDialog app={app} atMax={atMax} deadlinePassed={false} onConfirm={() => award(app)} />
                    <Button size="sm" variant="outline" onClick={() => setApp(app.id, { outcome: "declined" })}><X className="h-4 w-4" /> Not selected</Button>
                    {atMax && <span className="flex items-center gap-1 text-xs text-warning"><AlertTriangle className="h-3.5 w-3.5" /> Already at 2-site maximum</span>}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function DocChip({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium",
      ok ? "border-success/30 bg-success-soft text-success" : "border-destructive/30 bg-destructive/10 text-destructive")}>
      {ok ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />} {label}
    </span>
  );
}

function AwardDialog({ app, atMax, deadlinePassed, onConfirm }: { app: SiteApplication; atMax: boolean; deadlinePassed: boolean; onConfirm: () => void }) {
  const blocked = atMax || deadlinePassed;
  return (
    <Dialog>
      <DialogTrigger asChild><Button size="sm"><Award className="h-4 w-4" /> Approve &amp; award</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Award site to {app.applicantName}?</DialogTitle>
          <DialogDescription>
            This sets the site's assigned operator, advances their lifecycle, and marks the other applications as not selected.
          </DialogDescription>
        </DialogHeader>
        {blocked ? (
          <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            {atMax ? "This operator already holds 2 sites (the program maximum). Reassign one of their sites before awarding." : "The application deadline has passed."}
          </div>
        ) : (
          <div className="flex items-start gap-2 rounded-md border border-success/30 bg-success-soft px-3 py-2 text-sm text-success">
            <FileText className="mt-0.5 h-4 w-4 shrink-0" /> An award letter will be recorded and the operator notified.
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <DialogClose asChild><Button disabled={blocked} onClick={onConfirm}><Award className="h-4 w-4" /> Confirm award</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
