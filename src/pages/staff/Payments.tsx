import { PAYMENT_KIND_LABEL, LOANS } from "@/data/payments";
import { useAppData } from "@/context/appData";
import { operatorById } from "@/data/operators";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowDownLeft, ArrowUpRight, Landmark } from "lucide-react";

export default function Payments() {
  const { payments: PAYMENTS } = useAppData();
  const inbound = PAYMENTS.filter((p) => p.direction === "inbound");
  const outbound = PAYMENTS.filter((p) => p.direction === "outbound");
  const inTotal = inbound.filter(p => p.status === "completed").reduce((a, p) => a + p.amount, 0);
  const outTotal = outbound.filter(p => p.status === "completed").reduce((a, p) => a + p.amount, 0);

  return (
    <div>
      <PageHeader
        title="Payments & Loans"
        description="Inbound (set-aside, loan repayment, initial stock) and outbound (reimbursements, commissions, stipends, loan disbursements) via Credit/Debit + ACH through the State Treasurer gateway."
      />

      <div className="mb-4 flex items-start gap-2 rounded-lg border border-info/30 bg-info-soft/60 px-4 py-2.5 text-sm text-info">
        <Landmark className="mt-0.5 h-4 w-4 shrink-0" />
        <span>Money moves through the State Treasurer-approved gateway (CyberSource): operators pay <strong>inbound</strong> by Card/ACH; Fiscal/Admin issue <strong>outbound</strong> disbursements by ACH/check. The system records status only — the gateway tokenizes payment details (PCI SAQ-A). Orchestrated by Koodisi.</span>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-3">
        <StatCard label="Inbound (completed)" value={formatCurrency(inTotal)} sub="set-aside & repayments" icon={ArrowDownLeft} tone="success" />
        <StatCard label="Outbound (completed)" value={formatCurrency(outTotal)} sub="reimbursements & disbursements" icon={ArrowUpRight} tone="info" />
        <StatCard label="Active Loans" value={LOANS.filter(l => l.status === "active").length} sub={formatCurrency(LOANS.reduce((a, l) => a + l.balance, 0)) + " outstanding"} icon={Landmark} tone="warning" />
      </div>

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
    </div>
  );
}
