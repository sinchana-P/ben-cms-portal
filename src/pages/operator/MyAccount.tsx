import { useSession } from "@/context/session";
import { paymentsForOperator, PAYMENT_KIND_LABEL, LOANS } from "@/data/payments";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

export default function MyAccount() {
  const { persona } = useSession();
  const payments = paymentsForOperator(persona.id);
  const loan = LOANS.find((l) => l.operatorId === persona.id);
  const paidIn = payments.filter((p) => p.direction === "inbound" && p.status === "completed").reduce((a, p) => a + p.amount, 0);
  const paidOut = payments.filter((p) => p.direction === "outbound" && p.status === "completed").reduce((a, p) => a + p.amount, 0);

  return (
    <div>
      <PageHeader title="My account statement" description="Your full payment history — set-aside and loan repayments you've paid, and reimbursements and commissions paid to you." />

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
    </div>
  );
}
