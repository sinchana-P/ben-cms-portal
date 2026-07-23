import { Link } from "react-router-dom";
import { useSession } from "@/context/session";
import { useAppData } from "@/context/appData";
import { operatorById } from "@/data/operators";
import { siteById, SITE_TYPE_LABEL } from "@/data/sites";
import { LOANS } from "@/data/payments";
import { equipmentForSites } from "@/data/equipment";
import { formById, SET_ASIDE_RATE } from "@/data/forms";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  FileText, PenLine, CreditCard, Wrench, ArrowRight, CalendarClock, Receipt,
  DollarSign, TrendingUp, Package, MapPin, ShieldCheck, Plus,
} from "lucide-react";

export default function OperatorDashboard() {
  const { persona } = useSession();
  const { cases: allCases, payments: allPayments } = useAppData();
  const op = operatorById(persona.id);
  const siteIds = persona.siteIds ?? [];
  const primarySite = siteById(siteIds[0] ?? null);
  const cases = allCases.filter((c) => c.operatorId === persona.id);
  const payments = allPayments.filter((p) => p.operatorId === persona.id);
  const loan = LOANS.find((l) => l.operatorId === persona.id);
  const equip = equipmentForSites(siteIds);

  const toSign = cases.filter((c) => c.state === "awaiting_ack");
  const toPay = cases.filter((c) => c.state === "approved" && formById(c.formId)?.producesPayment === "inbound");
  const setAsidePaid = payments.filter((p) => p.kind === "set_aside" && p.status === "completed").reduce((a, p) => a + p.amount, 0);

  // Synthesized 6-month trends for the site (illustrative)
  const g = primarySite?.monthlyRevenue ?? 12000;
  const netTrend = [0.86, 0.92, 0.88, 0.97, 1.02, 1].map((m) => Math.round(g * 0.33 * m));
  const setAsideTrend = netTrend.map((n) => Math.round(n * ((primarySite?.setAsidePct ?? 6.5) / 100)));

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-card">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/12 via-transparent to-[hsl(var(--ben-highlight)/0.10)]" aria-hidden />
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-primary/10" />
        <div aria-hidden className="pointer-events-none absolute -right-4 -top-4 h-40 w-40 rounded-full border border-[hsl(var(--ben-highlight)/0.18)]" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">Operator Portal</div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{greeting}, {persona.name.split(" ")[0]}</h1>
            <p className="mt-1.5 max-w-lg text-sm text-muted-foreground">Everything you need to run your BEN business — submit your reports, track approvals, and manage your site.</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {siteIds.map((sid) => {
                const s = siteById(sid);
                return s ? <Badge key={sid} variant="secondary" className="gap-1"><MapPin className="h-3 w-3" /> {s.name}</Badge> : null;
              })}
              <Badge variant="secondary" className="gap-1"><ShieldCheck className="h-3 w-3" /> Secure · MFA</Badge>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild size="lg"><Link to="/operator/new/pnl"><Plus className="h-4 w-4" /> Submit P&amp;L</Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/operator/new/maintenance-log"><Wrench className="h-4 w-4" /> Report an issue</Link></Button>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section aria-label="Your key figures" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Set-aside paid" value={formatCurrency(setAsidePaid)} sub="this year" icon={DollarSign} tone="success" data={setAsideTrend} trend={{ dir: "up", label: "6 mo" }} />
        <StatCard label="Net profit trend" value={formatCurrency(netTrend[netTrend.length - 1])} sub="last month" icon={TrendingUp} data={netTrend} trend={{ dir: "up", label: "8%" }} />
        <StatCard label="Loan balance" value={loan ? formatCurrency(loan.balance) : formatCurrency(0)} sub={loan ? `${formatCurrency(loan.monthlyPayment)}/mo` : "no active loan"} icon={Receipt} tone="warning" />
        <StatCard label="Equipment" value={equip.length} sub={`${equip.filter((e) => e.status === "maintenance").length} in maintenance`} icon={Package} tone="info" />
      </section>

      {/* This month */}
      <Card className="border-primary/25">
        <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><CalendarClock className="h-4 w-4 text-primary" /> This month</CardTitle></CardHeader>
        <CardContent className="grid gap-2.5 sm:grid-cols-2">
          <TaskLink to="/operator/new/pnl" icon={FileText} title="Submit August P&L" meta="due the 20th" tone="primary" />
          <TaskLink to="/operator/new/throw-log" icon={FileText} title="Submit monthly Throw Log" meta="per site" />
          {toSign.length > 0 && <TaskLink to={`/operator/submissions/${toSign[0].id}`} icon={PenLine} title="Sign your site review" meta="awaiting signature" tone="warning" />}
          {toPay.length > 0 && <TaskLink to={`/operator/submissions/${toPay[0].id}`} icon={CreditCard} title={`Pay set-aside ${toPay[0].setAside ? formatCurrency(toPay[0].setAside) : ""}`} meta="approved" tone="success" />}
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Recent submissions</CardTitle>
            <Button asChild variant="ghost" size="sm"><Link to="/operator/submissions">View all <ArrowRight className="h-4 w-4" /></Link></Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {cases.slice(0, 5).map((c) => (
              <Link key={c.id} to={`/operator/submissions/${c.id}`} className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:border-primary/40 hover:bg-accent">
                <div><div className="text-sm font-medium">{c.title}</div><div className="text-xs text-muted-foreground">{formById(c.formId)?.shortTitle} · {formatDate(c.submittedOn)}</div></div>
                <StatusBadge state={c.state} />
              </Link>
            ))}
            {cases.length === 0 && <p className="text-sm text-muted-foreground">No submissions yet.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">My site</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {siteIds.map((sid) => {
              const s = siteById(sid);
              return s ? (
                <Link key={sid} to="/operator/sites" className="block rounded-lg border p-3 transition-colors hover:border-primary/40 hover:bg-accent">
                  <div className="text-sm font-medium">{s.name}</div>
                  <div className="text-xs text-muted-foreground">{SITE_TYPE_LABEL[s.type]} · {equip.filter((e) => e.siteId === sid).length} items · {s.setAsidePct}% set-aside</div>
                </Link>
              ) : null;
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function TaskLink({ to, icon: Icon, title, meta, tone = "muted" }: { to: string; icon: any; title: string; meta: string; tone?: "primary" | "warning" | "success" | "muted" }) {
  const toneCls = {
    primary: "text-primary bg-primary/10",
    warning: "text-warning bg-warning-soft",
    success: "text-success bg-success-soft",
    muted: "text-muted-foreground bg-muted",
  }[tone];
  return (
    <Link to={to} className="flex items-center gap-3 rounded-lg border p-3 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${toneCls}`}><Icon className="h-[18px] w-[18px]" aria-hidden /></span>
      <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{title}</span><span className="block text-xs text-muted-foreground">{meta}</span></span>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
    </Link>
  );
}
