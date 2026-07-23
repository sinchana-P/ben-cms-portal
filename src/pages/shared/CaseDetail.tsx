import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSession } from "@/context/session";
import { useAppData } from "@/context/appData";
import { formById, SET_ASIDE_RATE } from "@/data/forms";
import { operatorById } from "@/data/operators";
import { siteById } from "@/data/sites";
import { PAYMENT_KIND_LABEL } from "@/data/payments";
import type { CaseState, Payment } from "@/types";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { FormRenderer } from "@/components/shared/FormRenderer";
import { ApprovalChain, CaseTimeline } from "@/components/shared/ApprovalTimeline";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription, DialogClose,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowLeft, Check, X, PenLine, CreditCard, MessageSquare, Building2, MapPin, CheckCircle2, Banknote,
} from "lucide-react";

function num(v: unknown) { const n = typeof v === "number" ? v : parseFloat(String(v ?? "")); return isNaN(n) ? 0 : n; }

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { persona } = useSession();
  const { cases, updateCase, addPayment } = useAppData();
  const caseItem = cases.find((c) => c.id === id);
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
  const rate = site ? site.setAsidePct / 100 : SET_ASIDE_RATE;

  // Live P&L math from the submitted values, at the site's rate
  const v = caseItem.values;
  const netProfit = (num(v.rev_taxable) + num(v.rev_nontaxable) + num(v.rev_vending)) - (num(v.exp_cogs) + num(v.exp_operating) + num(v.exp_payroll));
  const setAside = caseItem.formId === "pnl" ? Math.max(0, Math.round(netProfit * rate)) : (caseItem.setAside ?? 0);
  const outboundAmount = caseItem.amount ?? num(v.amount);

  function advance(next: CaseState, entry: { state: CaseState; actor: string; role: any; note?: string }, msg: string) {
    updateCase(caseItem!.id, { state: next }, entry);
    setFlash(msg);
  }

  function outboundKind(): Payment["kind"] {
    if (caseItem!.formId === "loan-application") return "loan_disbursement";
    if (caseItem!.formId === "insurance-reimbursement") return String(v.claim_type ?? "").includes("Life") ? "life_reimbursement" : "medical_reimbursement";
    return "medical_reimbursement";
  }

  const isBeo = persona.role === "beo";
  const isChief = persona.role === "chief";
  const isOperatorOwner = persona.role === "operator" && persona.id === caseItem.operatorId;
  const isFiscalOrAdmin = persona.role === "fiscal" || persona.role === "admin";
  const chainHasChief = form.approvalChain.includes("chief");

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-3 -ml-2"><ArrowLeft className="h-4 w-4" /> Back</Button>

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

      <Card className="mb-5">
        <CardContent className="py-4">
          <div className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Approval workflow</div>
          <ApprovalChain form={form} currentState={caseItem.state} />
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground"><Building2 className="h-4 w-4" /> {operator?.name}</span>
            <span className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="h-4 w-4" /> {site?.name}</span>
            {caseItem.period && <span className="text-muted-foreground">Period: {caseItem.period}</span>}
            {caseItem.formId === "pnl" && (
              <>
                <span className="text-muted-foreground">Net profit: <span className="font-medium text-success">{formatCurrency(netProfit)}</span></span>
                <span className="font-medium text-primary">Set-aside ({site?.setAsidePct ?? 6.5}%): {formatCurrency(setAside)}</span>
              </>
            )}
            {form.producesPayment === "outbound" && outboundAmount > 0 && (
              <span className="font-medium text-info">Payout: {formatCurrency(outboundAmount)}</span>
            )}
          </div>

          <FormRenderer form={form} initial={caseItem.values} readOnly setAsideRate={rate} />
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {isBeo && caseItem.state === "beo_review" && (
                <>
                  <ApproveDialog
                    label={chainHasChief ? "Approve & route to Chief" : "Approve"}
                    onConfirm={(note) => advance(chainHasChief ? "chief_review" : "approved",
                      { state: chainHasChief ? "beo_approved" : "approved", actor: persona.name, role: "beo", note: note || "BEO approved" },
                      chainHasChief ? "Approved — routed to Chief for final approval." : "Approved.")}
                  />
                  <RejectDialog onConfirm={(note) => advance("rejected", { state: "rejected", actor: persona.name, role: "beo", note }, "Returned to operator.")} />
                </>
              )}
              {isChief && (caseItem.state === "chief_review" || caseItem.state === "beo_approved") && (
                <>
                  <ApproveDialog label="Give final approval"
                    onConfirm={(note) => advance("approved", { state: "approved", actor: persona.name, role: "chief", note: note || "Final approval" },
                      form.producesPayment === "outbound" ? "Approved — Fiscal will issue the payment to the operator." : "Final approval granted — operator notified.")}
                  />
                  <RejectDialog onConfirm={(note) => advance("rejected", { state: "rejected", actor: persona.name, role: "chief", note }, "Rejected — operator notified.")} />
                </>
              )}
              {isOperatorOwner && caseItem.state === "awaiting_ack" && (
                <Button className="w-full" onClick={() => advance(chainHasChief ? "chief_review" : "acknowledged", { state: "acknowledged", actor: persona.name, role: "operator", note: "Reviewed & signed acknowledgement" }, "Signed. Routed to Chief for sign-off.")}>
                  <PenLine className="h-4 w-4" /> Review & sign
                </Button>
              )}
              {/* Inbound: operator pays set-aside → posts to ledger + their statement */}
              {isOperatorOwner && caseItem.state === "approved" && form.producesPayment === "inbound" && (
                <Button variant="success" className="w-full" onClick={() => {
                  addPayment({ direction: "inbound", kind: "set_aside", operatorId: caseItem.operatorId, siteId: caseItem.siteId, amount: setAside, method: "ach", status: "completed", reference: `SA-${caseItem.id}` });
                  advance("paid", { state: "paid", actor: persona.name, role: "operator", note: `Set-aside ${formatCurrency(setAside)} paid via ACH` }, `Payment of ${formatCurrency(setAside)} received — recorded to your account. Loop complete.`);
                }}>
                  <CreditCard className="h-4 w-4" /> Pay set-aside {formatCurrency(setAside)}
                </Button>
              )}
              {/* Outbound: Fiscal/Admin issues the payment to the operator */}
              {isFiscalOrAdmin && caseItem.state === "approved" && form.producesPayment === "outbound" && (
                <Button className="w-full" onClick={() => {
                  addPayment({ direction: "outbound", kind: outboundKind(), operatorId: caseItem.operatorId, siteId: null, amount: outboundAmount, method: "check", status: "processing", reference: `OUT-${caseItem.id}` });
                  advance("paid", { state: "paid", actor: persona.name, role: persona.role, note: `${PAYMENT_KIND_LABEL[outboundKind()]} of ${formatCurrency(outboundAmount)} issued to operator` }, `Payment of ${formatCurrency(outboundAmount)} issued to ${operator?.name} — posted to their account statement.`);
                }}>
                  <Banknote className="h-4 w-4" /> Issue payment {formatCurrency(outboundAmount)}
                </Button>
              )}
              {isChief && caseItem.state === "approved" && form.producesPayment === "outbound" && (
                <p className="text-sm text-muted-foreground">Approved. Awaiting Fiscal/Admin to issue the payment.</p>
              )}
              {["paid", "rejected", "acknowledged", "reviewed", "closed"].includes(caseItem.state) &&
                !(isFiscalOrAdmin && caseItem.state === "approved") && (
                  <p className="text-sm text-muted-foreground">No action required in your role at this stage.</p>
                )}
              {caseItem.state === "approved" && form.producesPayment == null && !isOperatorOwner && (
                <p className="text-sm text-muted-foreground">Approved — no payment associated with this form.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="flex items-center gap-1.5 text-sm"><MessageSquare className="h-4 w-4" /> Audit trail</CardTitle></CardHeader>
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
      <DialogTrigger asChild><Button className="w-full"><Check className="h-4 w-4" /> {label}</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{label}</DialogTitle><DialogDescription>Add an optional comment. This is recorded in the audit trail.</DialogDescription></DialogHeader>
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
      <DialogTrigger asChild><Button variant="outline" className="w-full"><X className="h-4 w-4" /> Return / reject</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Return to operator</DialogTitle><DialogDescription>A reason is required and will be sent to the operator.</DialogDescription></DialogHeader>
        <Textarea placeholder="Reason for return…" value={note} onChange={(e) => setNote(e.target.value)} />
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <DialogClose asChild><Button variant="destructive" disabled={!note.trim()} onClick={() => onConfirm(note)}>Return</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
