import { useState } from "react";
import { useSession } from "@/context/session";
import { PAYMENT_KIND_LABEL, LOANS } from "@/data/payments";
import { useAppData } from "@/context/appData";
import { siteById } from "@/data/sites";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StatCard } from "@/components/shared/StatCard";
import { PaymentGatewayDialog, type PayMethod } from "@/components/shared/PaymentGatewayDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight, CreditCard, CheckCircle2 } from "lucide-react";

export default function MyAccount() {
  const { persona } = useSession();
  const { payments: all, addPayment } = useAppData();
  const payments = all.filter((p) => p.operatorId === persona.id);
  const loan = LOANS.find((l) => l.operatorId === persona.id);
  const paidIn = payments.filter((p) => p.direction === "inbound" && p.status === "completed").reduce((a, p) => a + p.amount, 0);
  const paidOut = payments.filter((p) => p.direction === "outbound" && p.status === "completed").reduce((a, p) => a + p.amount, 0);

  // Outstanding set-aside for the current month (primary site, on net profit)
  const site = siteById(persona.siteIds?.[0] ?? null);
  const gross = site?.monthlyRevenue ?? 12000;
  const dueAmount = Math.round(gross * 0.33 * ((site?.setAsidePct ?? 6.5) / 100));
  const [gatewayOpen, setGatewayOpen] = useState(false);
  const alreadyPaid = payments.some((p) => p.kind === "set_aside" && p.reference?.includes("AUG"));

  return (
    <div>
      <PageHeader title="My account statement" description="Your full payment history — set-aside and loan repayments you've paid, and reimbursements and commissions paid to you." />

      {/* Pay set-aside — the operator's entry point to the payment gateway */}
      {site && (
        <Card className="mb-5 border-primary/30 bg-primary/[0.04]">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
            {alreadyPaid ? (
              <div className="flex items-center gap-2 text-sm font-medium text-success"><CheckCircle2 className="h-5 w-5" /> August set-aside paid — thank you.</div>
            ) : (
              <>
                <div>
                  <div className="text-sm font-semibold" style={{ color: "hsl(var(--ben-heading))" }}>Set-aside due — August 2026</div>
                  <div className="text-xs text-muted-foreground">{site.name} · {site.setAsidePct}% of net profit · due the 20th</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right"><div className="text-2xl font-bold tabular-nums text-primary">{formatCurrency(dueAmount)}</div></div>
                  <Button onClick={() => setGatewayOpen(true)}><CreditCard className="h-4 w-4" /> Pay now</Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Paid to BEN" value={formatCurrency(paidIn)} sub="set-aside & repayments" icon={ArrowUpRight} tone="info" />
        <StatCard label="Paid to you" value={formatCurrency(paidOut)} sub="reimbursements & commissions" icon={ArrowDownLeft} tone="success" />
        <StatCard label="Loan balance" value={loan ? formatCurrency(loan.balance) : formatCurrency(0)} sub={loan ? `${formatCurrency(loan.monthlyPayment)}/mo from P&L` : "no active loan"} tone="warning" />
      </div>

      {loan && (
        <Card className="mb-5">
          <CardHeader className="pb-2"><CardTitle className="text-base">Loan repayment</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">{loan.purpose}</span><span className="font-semibold tabular-nums">{formatCurrency(loan.principal - loan.balance)} / {formatCurrency(loan.principal)}</span></div>
            <Progress value={Math.round(((loan.principal - loan.balance) / loan.principal) * 100)} indicatorClassName="bg-success" />
            <p className="text-xs text-muted-foreground">Repaid automatically from your monthly P&amp;L profit.</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Transaction history</CardTitle></CardHeader>
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Reference</TableHead><TableHead>Type</TableHead><TableHead>Direction</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="text-right">Date</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.reference}</TableCell>
                  <TableCell className="text-sm">{PAYMENT_KIND_LABEL[p.kind]}</TableCell>
                  <TableCell>{p.direction === "inbound" ? <Badge variant="info"><ArrowUpRight className="h-3 w-3" /> To BEN</Badge> : <Badge variant="success"><ArrowDownLeft className="h-3 w-3" /> To you</Badge>}</TableCell>
                  <TableCell className="text-sm uppercase text-muted-foreground">{p.method}</TableCell>
                  <TableCell><StatusBadge state={p.status} /></TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{formatCurrency(p.amount)}</TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{formatDate(p.date)}</TableCell>
                </TableRow>
              ))}
              {payments.length === 0 && <TableRow><TableCell colSpan={7} className="py-8 text-center text-sm text-muted-foreground">No transactions yet.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PaymentGatewayDialog
        open={gatewayOpen}
        onOpenChange={setGatewayOpen}
        direction="inbound"
        amount={dueAmount}
        operatorName={persona.name}
        kindLabel="Set-aside due — August 2026"
        onComplete={(status: "completed" | "processing" | "failed", method: PayMethod) => {
          addPayment({ direction: "inbound", kind: "set_aside", operatorId: persona.id, siteId: site?.id ?? null, amount: dueAmount, method, status: status === "failed" ? "failed" : "completed", reference: `SA-AUG-${persona.id}` });
        }}
      />
    </div>
  );
}
