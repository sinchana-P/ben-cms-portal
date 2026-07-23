import { Link } from "react-router-dom";
import { useSession } from "@/context/session";
import { casesForOperator } from "@/data/cases";
import { operatorById } from "@/data/operators";
import { siteById, SITE_TYPE_LABEL } from "@/data/sites";
import { paymentsForOperator, LOANS } from "@/data/payments";
import { equipmentForSites } from "@/data/equipment";
import { formById } from "@/data/forms";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  FilePlus2, PenLine, CreditCard, Wrench, ArrowRight, CalendarClock, Receipt,
} from "lucide-react";

export default function OperatorDashboard() {
  const { persona } = useSession();
  const op = operatorById(persona.id);
  const siteIds = persona.siteIds ?? [];
  const cases = casesForOperator(persona.id);
  const payments = paymentsForOperator(persona.id);
  const loan = LOANS.find((l) => l.operatorId === persona.id);
  const equip = equipmentForSites(siteIds);

  const toSign = cases.filter((c) => c.state === "awaiting_ack");
  const toPay = cases.filter((c) => c.state === "approved" && formById(c.formId)?.producesPayment === "inbound");

  return (
    <div>
      <PageHeader
        eyebrow="Operator Portal"
        title={`Hello, ${persona.name.split(" ")[0]}`}
        description="Your sites, submissions, equipment, and account — everything you need to run your BEN business."
      />

      {/* This month's tasks */}
      <Card className="mb-5 border-primary/30 bg-primary/[0.03]">
        <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><CalendarClock className="h-4 w-4 text-primary" /> This month</CardTitle></CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          <Button asChild variant="outline" className="justify-start"><Link to="/operator/new/pnl"><FilePlus2 className="h-4 w-4" /> Submit August P&amp;L <span className="ml-auto text-xs text-muted-foreground">due 20th</span></Link></Button>
          <Button asChild variant="outline" className="justify-start"><Link to="/operator/new/throw-log"><FilePlus2 className="h-4 w-4" /> Submit monthly Throw Log</Link></Button>
          {toSign.length > 0 && (
            <Button asChild variant="outline" className="justify-start"><Link to={`/operator/submissions/${toSign[0].id}`}><PenLine className="h-4 w-4 text-warning" /> Sign your site review <span className="ml-auto"><StatusBadge state="awaiting_ack" /></span></Link></Button>
          )}
          {toPay.length > 0 && (
            <Button asChild variant="outline" className="justify-start"><Link to={`/operator/submissions/${toPay[0].id}`}><CreditCard className="h-4 w-4 text-success" /> Pay set-aside {toPay[0].setAside ? formatCurrency(toPay[0].setAside) : ""}</Link></Button>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">My recent submissions</CardTitle>
            <Button asChild variant="ghost" size="sm"><Link to="/operator/submissions">View all <ArrowRight className="h-4 w-4" /></Link></Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {cases.slice(0, 5).map((c) => (
              <Link key={c.id} to={`/operator/submissions/${c.id}`} className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent">
                <div><div className="text-sm font-medium">{c.title}</div><div className="text-xs text-muted-foreground">{formById(c.formId)?.shortTitle} · {formatDate(c.submittedOn)}</div></div>
                <StatusBadge state={c.state} />
              </Link>
            ))}
            {cases.length === 0 && <p className="text-sm text-muted-foreground">No submissions yet.</p>}
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><Receipt className="h-4 w-4" /> My account</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Loan balance</span><span className="font-semibold tabular-nums">{loan ? formatCurrency(loan.balance) : formatCurrency(0)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Set-aside paid (recent)</span><span className="font-semibold tabular-nums">{formatCurrency(payments.filter(p => p.kind === "set_aside" && p.status === "completed").reduce((a, p) => a + p.amount, 0))}</span></div>
              <Button asChild variant="ghost" size="sm" className="w-full"><Link to="/operator/account">Full statement <ArrowRight className="h-4 w-4" /></Link></Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-base">My sites</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {siteIds.map((sid) => { const s = siteById(sid); return s ? (
                <div key={sid} className="rounded-lg border p-3">
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{SITE_TYPE_LABEL[s.type]} · {equip.filter(e => e.siteId === sid).length} items</div>
                </div>
              ) : null; })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
