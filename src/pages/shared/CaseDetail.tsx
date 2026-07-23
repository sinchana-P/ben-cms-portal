import { useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSession } from "@/context/session";
import { CASES } from "@/data/cases";
import { formById } from "@/data/forms";
import { operatorById } from "@/data/operators";
import { siteById } from "@/data/sites";
import type { BenCase, CaseState, TimelineEntry } from "@/types";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { FormRenderer } from "@/components/shared/FormRenderer";
import { ApprovalChain, CaseTimeline } from "@/components/shared/ApprovalTimeline";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription, DialogClose,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeft, Check, X, PenLine, CreditCard, MessageSquare, Building2, MapPin, CheckCircle2,
} from "lucide-react";

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { persona } = useSession();
  const base = CASES.find((c) => c.id === id);
  const [caseItem, setCaseItem] = useState<BenCase | undefined>(base);
  const [flash, setFlash] = useState<string | null>(null);

  const form = useMemo(() => (caseItem ? formById(caseItem.formId) : undefined), [caseItem]);

  if (!caseItem || !form) {
    return (
      <div>
        <Button variant="ghost" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /> Back</Button>
        <p className="mt-6 text-muted-foreground">Case not found.</p>
      </div>
    );
  }

  const operator = operatorById(caseItem.operatorId);
  const site = siteById(caseItem.siteId);

  function advance(next: CaseState, entry: Omit<TimelineEntry, "at">, msg: string) {
    setCaseItem((prev) =>
      prev
        ? {
            ...prev,
            state: next,
            timeline: [...prev.timeline, { ...entry, at: new Date().toISOString() }],
          }
        : prev
    );
    setFlash(msg);
  }

  // Role/state-driven actions
  const isBeo = persona.role === "beo";
  const isChief = persona.role === "chief";
  const isOperatorOwner = persona.role === "operator" && persona.id === caseItem.operatorId;
  const chainHasChief = form.approvalChain.includes("chief");

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-3 -ml-2">
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <PageHeader
        eyebrow={`${form.code} · ${caseItem.id}`}
        title={caseItem.title}
        description={form.description}
        actions={<StatusBadge state={caseItem.state} />}
      />

      {flash && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-success/30 bg-success-soft px-4 py-2.5 text-sm font-medium text-success animate-fade-in" role="status">
          <CheckCircle2 className="h-4 w-4" /> {flash}
        </div>
      )}

      {/* Approval chain */}
      <Card className="mb-5">
        <CardContent className="py-4">
          <div className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Approval workflow</div>
          <ApprovalChain form={form} currentState={caseItem.state} />
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          {/* Meta */}
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Building2 className="h-4 w-4" /> {operator?.name}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-4 w-4" /> {site?.name}
            </span>
            {caseItem.period && <span className="text-muted-foreground">Period: {caseItem.period}</span>}
            {typeof caseItem.setAside === "number" && (
              <span className="font-medium text-primary">Set-aside due: {formatCurrency(caseItem.setAside)}</span>
            )}
          </div>

          <FormRenderer form={form} initial={caseItem.values} readOnly />
        </div>

        <div className="space-y-5">
          {/* Actions */}
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {/* BEO tier-1 */}
              {isBeo && caseItem.state === "beo_review" && (
                <>
                  <ApproveDialog
                    label={chainHasChief ? "Approve & route to Chief" : "Approve"}
                    onConfirm={(note) =>
                      advance(
                        chainHasChief ? "chief_review" : "approved",
                        { state: chainHasChief ? "beo_approved" : "approved", actor: persona.name, role: "beo", note: note || "BEO approved" },
                        chainHasChief ? "Approved — routed to Chief for final approval." : "Approved."
                      )
                    }
                  />
                  <RejectDialog onConfirm={(note) => advance("rejected", { state: "rejected", actor: persona.name, role: "beo", note }, "Returned to operator.")} />
                </>
              )}
              {/* Chief tier-2 */}
              {isChief && (caseItem.state === "chief_review" || caseItem.state === "beo_approved") && (
                <>
                  <ApproveDialog
                    label="Give final approval"
                    onConfirm={(note) => advance("approved", { state: "approved", actor: persona.name, role: "chief", note: note || "Final approval" }, "Final approval granted — operator notified.")}
                  />
                  <RejectDialog onConfirm={(note) => advance("rejected", { state: "rejected", actor: persona.name, role: "chief", note }, "Rejected — operator notified.")} />
                </>
              )}
              {/* Operator sign (reverse-init reviews) */}
              {isOperatorOwner && caseItem.state === "awaiting_ack" && (
                <Button className="w-full" onClick={() => advance(chainHasChief ? "chief_review" : "acknowledged", { state: "acknowledged", actor: persona.name, role: "operator", note: "Reviewed & signed acknowledgement" }, "Signed. Routed to Chief for sign-off.")}>
                  <PenLine className="h-4 w-4" /> Review & sign
                </Button>
              )}
              {/* Operator pay (inbound after approval) */}
              {isOperatorOwner && caseItem.state === "approved" && form.producesPayment === "inbound" && (
                <Button variant="success" className="w-full" onClick={() => advance("paid", { state: "paid", actor: persona.name, role: "operator", note: "Set-aside paid via ACH" }, "Payment received — loop complete. Thank you.")}>
                  <CreditCard className="h-4 w-4" /> Pay set-aside {caseItem.setAside ? formatCurrency(caseItem.setAside) : ""}
                </Button>
              )}
              {/* Terminal / no action */}
              {["approved", "paid", "rejected", "acknowledged", "reviewed", "closed"].includes(caseItem.state) &&
                !(isOperatorOwner && caseItem.state === "approved" && form.producesPayment === "inbound") && (
                  <p className="text-sm text-muted-foreground">No action required in your role at this stage.</p>
                )}
              {!isBeo && !isChief && !isOperatorOwner && !["approved", "paid", "rejected"].includes(caseItem.state) && (
                <p className="text-sm text-muted-foreground">You have view access to this submission.</p>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-1.5 text-sm">
                <MessageSquare className="h-4 w-4" /> Audit trail
              </CardTitle>
            </CardHeader>
            <CardContent><CaseTimeline caseItem={caseItem} /></CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ApproveDialog({ label, onConfirm }: { label: string; onConfirm: (note: string) => void }) {
  const [note, setNote] = useState("");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full"><Check className="h-4 w-4" /> {label}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>Add an optional comment. This is recorded in the audit trail.</DialogDescription>
        </DialogHeader>
        <Textarea placeholder="Comment (optional)…" value={note} onChange={(e) => setNote(e.target.value)} />
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <DialogClose asChild><Button onClick={() => onConfirm(note)}><Check className="h-4 w-4" /> Confirm</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RejectDialog({ onConfirm }: { onConfirm: (note: string) => void }) {
  const [note, setNote] = useState("");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full"><X className="h-4 w-4" /> Return / reject</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Return to operator</DialogTitle>
          <DialogDescription>A reason is required and will be sent to the operator.</DialogDescription>
        </DialogHeader>
        <Textarea placeholder="Reason for return…" value={note} onChange={(e) => setNote(e.target.value)} />
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" disabled={!note.trim()} onClick={() => onConfirm(note)}>Return</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
