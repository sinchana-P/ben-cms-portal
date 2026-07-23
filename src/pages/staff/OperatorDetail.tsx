import { useParams, useNavigate, Link } from "react-router-dom";
import { operatorById, OPERATOR_LIFECYCLE, OPERATOR_STATUS_LABEL } from "@/data/operators";
import { siteById, SITE_TYPE_LABEL } from "@/data/sites";
import { assignmentsForOperator } from "@/data/assignments";
import { casesForOperator } from "@/data/cases";
import { paymentsForOperator } from "@/data/payments";
import { LOANS } from "@/data/payments";
import { formById } from "@/data/forms";
import { personaById } from "@/data/personas";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { ArrowLeft, Check, Circle } from "lucide-react";

export default function OperatorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const o = operatorById(id ?? "");
  if (!o) return <p className="text-muted-foreground">Operator not found.</p>;

  const cases = casesForOperator(o.id);
  const payments = paymentsForOperator(o.id);
  const loan = LOANS.find((l) => l.operatorId === o.id);
  const activeIdx = OPERATOR_LIFECYCLE.indexOf(o.status as any);

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-3 -ml-2"><ArrowLeft className="h-4 w-4" /> Back</Button>
      <PageHeader eyebrow="Operator" title={o.name} description={`${o.email} · ${o.phone} · ${o.visualAccommodation}`} actions={<StatusBadge state={o.status} />} />

      {/* Lifecycle stepper */}
      <Card className="mb-5">
        <CardContent className="py-5">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Operator lifecycle</div>
          <div className="flex flex-wrap items-center gap-1.5">
            {OPERATOR_LIFECYCLE.map((s, i) => {
              const done = activeIdx >= 0 && i <= activeIdx;
              const active = i === activeIdx;
              return (
                <div key={s} className="flex items-center gap-1.5">
                  <div className={cn("flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium",
                    done && !active && "border-success/30 bg-success-soft text-success",
                    active && "border-primary bg-primary/10 text-primary",
                    !done && "border-border text-muted-foreground")}>
                    {done && !active ? <Check className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                    {OPERATOR_STATUS_LABEL[s]}
                  </div>
                  {i < OPERATOR_LIFECYCLE.length - 1 && <span className="text-muted-foreground">→</span>}
                </div>
              );
            })}
          </div>
          {o.status === "interim" && <p className="mt-3 text-xs text-muted-foreground">Interim operatorship — 12–18 months of enhanced review before full licensing.</p>}
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Assigned sites</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {o.siteIds.length === 0 && <p className="text-sm text-muted-foreground">No sites assigned yet.</p>}
            {o.siteIds.map((sid) => {
              const s = siteById(sid);
              if (!s) return null;
              return (
                <Link key={sid} to="/staff/sites" className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent">
                  <div>
                    <div className="text-sm font-medium">{s.name}</div>
                    <div className="text-xs text-muted-foreground">{SITE_TYPE_LABEL[s.type]} · {s.hostAgency}</div>
                  </div>
                  <div className="text-right text-sm tabular-nums text-muted-foreground">{formatCurrency(s.monthlyRevenue)}/mo</div>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Account summary</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Assigned BEO" value={personaById(o.assignedBeoId)?.name ?? "—"} />
            <Row label="Licensed on" value={o.licensedOn ? formatDate(o.licensedOn) : "—"} />
            <Separator />
            <Row label="Outstanding loan" value={loan ? formatCurrency(loan.balance) : formatCurrency(0)} />
            {loan && <Row label="Monthly repayment" value={`${formatCurrency(loan.monthlyPayment)} · auto from P&L`} muted />}
            <Row label="Set-aside paid (recent)" value={formatCurrency(payments.filter(p => p.kind === "set_aside" && p.status === "completed").reduce((a,p)=>a+p.amount,0))} />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-5">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Sites managed</CardTitle>
          <p className="text-sm text-muted-foreground">Current and historical assignments from the assignment table — preserved across every reassignment.</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {assignmentsForOperator(o.id).map((a) => {
            const s = siteById(a.siteId);
            const active = !a.endDate;
            return (
              <Link key={a.id} to={`/staff/sites/${a.siteId}`} className={cn("flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 hover:bg-accent", !active && "opacity-70")}>
                <div className="flex items-center gap-3">
                  <StatusBadge state={active ? "active" : "closed"} label={a.role} />
                  <div>
                    <div className="text-sm font-medium">{s?.name}</div>
                    <div className="text-xs text-muted-foreground">{formatDate(a.startDate)} → {a.endDate ? formatDate(a.endDate) : "present"} · by {a.assignedBy}{a.notes ? ` · ${a.notes}` : ""}</div>
                  </div>
                </div>
                <span className="text-xs font-medium">{active ? "Active" : "Ended"}</span>
              </Link>
            );
          })}
          {assignmentsForOperator(o.id).length === 0 && <p className="text-sm text-muted-foreground">No site assignments on record.</p>}
        </CardContent>
      </Card>

      <Card className="mt-5">
        <CardHeader className="pb-2"><CardTitle className="text-base">Submissions</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {cases.map((c) => (
            <Link key={c.id} to={`/staff/cases/${c.id}`} className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent">
              <div>
                <div className="text-sm font-medium">{c.title}</div>
                <div className="text-xs text-muted-foreground">{formById(c.formId)?.code} · {formatDate(c.submittedOn)}</div>
              </div>
              <StatusBadge state={c.state} />
            </Link>
          ))}
          {cases.length === 0 && <p className="text-sm text-muted-foreground">No submissions.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn("font-medium tabular-nums", muted && "text-muted-foreground")}>{value}</span>
    </div>
  );
}
