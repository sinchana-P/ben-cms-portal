import { useState } from "react";
import { useSession } from "@/context/session";
import { PAYMENT_KIND_LABEL, LOANS } from "@/data/payments";
import { useAppData } from "@/context/appData";
import { operatorById } from "@/data/operators";
import { formById } from "@/data/forms";
import type { BenCase, Payment } from "@/types";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StatCard } from "@/components/shared/StatCard";
import { PaymentGatewayDialog, type PayMethod } from "@/components/shared/PaymentGatewayDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight, Landmark, Banknote, Clock } from "lucide-react";

function outboundKind(c: BenCase): Payment["kind"] {
  if (c.formId === "loan-application") return "loan_disbursement";
  if (c.formId === "insurance-reimbursement") return String(c.values.claim_type ?? "").includes("Life") ? "life_reimbursement" : "medical_reimbursement";
  return "medical_reimbursement";
}

export default function Payments() {
  const { persona } = useSession();
  const { payments: PAYMENTS, cases, updateCase, addPayment } = useAppData();
  const inbound = PAYMENTS.filter((p) => p.direction === "inbound");
  const outbound = PAYMENTS.filter((p) => p.direction === "outbound");
  const inTotal = inbound.filter(p => p.status === "completed").reduce((a, p) => a + p.amount, 0);
  const outTotal = outbound.filter(p => p.status === "completed").reduce((a, p) => a + p.amount, 0);

  // Approved outbound cases awaiting a disbursement. Executed via the State
  // Treasurer's Office; the in-app trigger is Admin-only. Fiscal is view-only.
  const canIssue = persona.role === "admin";
  const awaiting = cases.filter((c) => c.state === "approved" && formById(c.formId)?.producesPayment === "outbound");
  const [payCase, setPayCase] = useState<BenCase | null>(null);

  return (
    <div>
      <PageHeader
        title="Payments & Loans"
        description="Inbound (set-aside, loan repayment, initial stock) and outbound (reimbursements, commissions, stipends, loan disbursements) via Credit/Debit + ACH through the State Treasurer gateway."
      />

      <div className="mb-4 flex items-start gap-2 rounded-lg border border-info/30 bg-info-soft/60 px-4 py-2.5 text-sm text-info">
        <Landmark className="mt-0.5 h-4 w-4 shrink-0" />
        <span>Money moves through the State Treasurer-approved gateway (CyberSource): <strong>operators pay inbound</strong> by Card/ACH; <strong>outbound disbursements are executed via the State Treasurer's Office</strong> (recorded in-app by the Admin Assistant). <strong>Fiscal is view-only</strong> (RFP §5.1.2). The system records status only — the gateway tokenizes payment details (PCI SAQ-A). Orchestrated by Koodisi.</span>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard label="Inbound (completed)" value={formatCurrency(inTotal)} sub="set-aside & repayments" icon={ArrowDownLeft} tone="success" />
        <StatCard label="Outbound (completed)" value={formatCurrency(outTotal)} sub="reimbursements & disbursements" icon={ArrowUpRight} tone="info" />
        <StatCard label="Active Loans" value={LOANS.filter(l => l.status === "active").length} sub={formatCurrency(LOANS.reduce((a, l) => a + l.balance, 0)) + " outstanding"} icon={Landmark} tone="warning" />
      </div>

      {awaiting.length > 0 && (
        <Card className="mb-5 border-warning/40">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base"><Banknote className="h-4 w-4" /> Awaiting disbursement ({awaiting.length})</CardTitle>
            <p className="text-sm text-muted-foreground">
              {canIssue
                ? "Chief-approved disbursements ready to record/issue (ACH / check). Execution runs through the State Treasurer's Office."
                : "Chief-approved disbursements — view only. Recorded by the Admin Assistant and executed via the State Treasurer's Office."}
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {awaiting.map((c) => (
              <div key={c.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3">
                <div>
                  <div className="text-sm font-medium">{PAYMENT_KIND_LABEL[outboundKind(c)]} — {operatorById(c.operatorId)?.name}</div>
                  <div className="text-xs text-muted-foreground">{c.id} · {formById(c.formId)?.shortTitle}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold tabular-nums">{formatCurrency(c.amount ?? 0)}</span>
                  {canIssue
                    ? <Button size="sm" onClick={() => setPayCase(c)}><Banknote className="h-4 w-4" /> Issue payment</Button>
                    : <Badge variant="warning"><Clock className="h-3 w-3" /> Disbursement pending</Badge>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="payments">
        <TabsList>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="loans">Loans</TabsTrigger>
        </TabsList>

        <TabsContent value="payments">
          <Card>
            <CardContent className="px-0 py-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Operator</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PAYMENTS.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-mono text-xs">{p.reference}</TableCell>
                      <TableCell className="text-sm">{PAYMENT_KIND_LABEL[p.kind]}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{operatorById(p.operatorId)?.name}</TableCell>
                      <TableCell>
                        {p.direction === "inbound"
                          ? <Badge variant="success"><ArrowDownLeft className="h-3 w-3" /> In</Badge>
                          : <Badge variant="info"><ArrowUpRight className="h-3 w-3" /> Out</Badge>}
                      </TableCell>
                      <TableCell className="text-sm uppercase text-muted-foreground">{p.method}</TableCell>
                      <TableCell><StatusBadge state={p.status} /></TableCell>
                      <TableCell className="text-right tabular-nums font-medium">{formatCurrency(p.amount)}</TableCell>
                      <TableCell className="text-right text-sm text-muted-foreground">{formatDate(p.date)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loans">
          <div className="grid gap-4 sm:grid-cols-2">
            {LOANS.map((l) => {
              const paid = l.principal - l.balance;
              const pct = Math.round((paid / l.principal) * 100);
              return (
                <Card key={l.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{operatorById(l.operatorId)?.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{l.purpose}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Balance</span>
                      <span className="font-semibold tabular-nums">{formatCurrency(l.balance)} <span className="text-muted-foreground">/ {formatCurrency(l.principal)}</span></span>
                    </div>
                    <Progress value={pct} indicatorClassName="bg-success" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{pct}% repaid</span>
                      <span>{formatCurrency(l.monthlyPayment)}/mo · auto from P&L profit</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {payCase && (
        <PaymentGatewayDialog
          open={!!payCase}
          onOpenChange={(v) => { if (!v) setPayCase(null); }}
          direction="outbound"
          amount={payCase.amount ?? 0}
          operatorName={operatorById(payCase.operatorId)?.name ?? ""}
          kindLabel={PAYMENT_KIND_LABEL[outboundKind(payCase)]}
          onComplete={(_status, method: PayMethod) => {
            addPayment({ direction: "outbound", kind: outboundKind(payCase), operatorId: payCase.operatorId, siteId: null, amount: payCase.amount ?? 0, method, status: "processing", reference: `OUT-${payCase.id}` });
            updateCase(payCase.id, { state: "paid" }, { state: "paid", actor: persona.name, role: persona.role, note: `${PAYMENT_KIND_LABEL[outboundKind(payCase)]} of ${formatCurrency(payCase.amount ?? 0)} issued via ${method.toUpperCase()}` });
          }}
        />
      )}
    </div>
  );
}
