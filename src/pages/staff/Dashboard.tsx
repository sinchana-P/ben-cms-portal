import { Link } from "react-router-dom";
import { useSession } from "@/context/session";
import { useAppData } from "@/context/appData";
import { PROGRAM_STATS } from "@/data/sites";
import { TICKETS } from "@/data/tickets";
import { formById } from "@/data/forms";
import { operatorById } from "@/data/operators";
import { ROLE_LABEL } from "@/data/personas";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Users, MapPin, CheckSquare, ArrowRight, Wrench, DollarSign, ShieldCheck, Building2,
} from "lucide-react";

export default function StaffDashboard() {
  const { persona } = useSession();
  const { cases, payments } = useAppData();

  const myQueue = cases.filter((c) =>
    persona.role === "beo" ? c.state === "beo_review" && c.assignedBeoId === persona.id
    : persona.role === "chief" ? c.state === "chief_review" || c.state === "beo_approved"
    : ["submitted", "beo_review", "chief_review"].includes(c.state)
  );
  const recent = [...cases].sort((a, b) => b.submittedOn.localeCompare(a.submittedOn)).slice(0, 6);
  const openTickets = TICKETS.filter((t) => t.state !== "resolved").length;
  const setAsideMTD = payments.filter((p) => p.kind === "set_aside" && p.status === "completed").reduce((a, p) => a + p.amount, 0);

  const setAsideTrend = [3800, 4200, 3950, 4600, 5100, 5400];
  const revenueTrend = [128, 134, 131, 142, 148, 151];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const primary = persona.role === "beo" || persona.role === "chief"
    ? { to: "/staff/approvals", label: `Review approvals${myQueue.length ? ` (${myQueue.length})` : ""}`, Icon: CheckSquare }
    : persona.role === "fiscal" ? { to: "/staff/reports", label: "Open reports", Icon: DollarSign }
    : { to: "/staff/payments", label: "Payments & disbursements", Icon: DollarSign };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border bg-card p-6 shadow-card">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/12 via-transparent to-[hsl(var(--ben-highlight)/0.10)]" aria-hidden />
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-primary/10" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">Business Enterprise of Nevada · Staff</div>
            <h1 className="text-3xl font-bold tracking-tight">{greeting}, {persona.name.split(" ")[0]}</h1>
            <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">{ROLE_LABEL[persona.role]} — program operations across all {PROGRAM_STATS.totalSites} sites and {PROGRAM_STATS.activeOperators} operators.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1"><Building2 className="h-3 w-3" /> {PROGRAM_STATS.totalSites} sites</Badge>
              <Badge variant="secondary" className="gap-1"><Users className="h-3 w-3" /> {PROGRAM_STATS.activeOperators} operators</Badge>
              <Badge variant="secondary" className="gap-1"><ShieldCheck className="h-3 w-3" /> AD SSO</Badge>
            </div>
          </div>
          <Button asChild size="lg"><Link to={primary.to}><primary.Icon className="h-4 w-4" /> {primary.label}</Link></Button>
        </div>
      </section>

      <section aria-label="Program metrics" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Set-aside (MTD)" value={formatCurrency(setAsideMTD)} sub="program funding" icon={DollarSign} tone="success" data={setAsideTrend} trend={{ dir: "up", label: "6 mo" }} />
        <StatCard label="Program revenue" value={`$${revenueTrend[revenueTrend.length - 1]}k`} sub="last month" icon={Building2} data={revenueTrend} trend={{ dir: "up", label: "9%" }} />
        <StatCard label="Pending approvals" value={myQueue.length} sub="in your queue" icon={CheckSquare} tone="warning" />
        <StatCard label="Open tickets" value={openTickets} sub="equipment R&M" icon={Wrench} tone="info" />
      </section>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Recent submissions</CardTitle>
            <Button asChild variant="ghost" size="sm"><Link to="/staff/cases">View all <ArrowRight className="h-4 w-4" /></Link></Button>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader><TableRow><TableHead>Submission</TableHead><TableHead>Operator</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Submitted</TableHead></TableRow></TableHeader>
              <TableBody>
                {recent.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell><Link to={`/staff/cases/${c.id}`} className="font-medium hover:text-primary">{c.title}</Link><div className="text-xs text-muted-foreground">{formById(c.formId)?.code}</div></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{operatorById(c.operatorId)?.name}</TableCell>
                    <TableCell><StatusBadge state={c.state} /></TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">{formatDate(c.submittedOn)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Needs your attention</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {myQueue.length === 0 && <p className="text-sm text-muted-foreground">Nothing awaiting your action.</p>}
            {myQueue.map((c) => (
              <Link key={c.id} to={`/staff/cases/${c.id}`} className="flex items-center gap-3 rounded-lg border p-3 transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card">
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{c.title}</p><p className="text-xs text-muted-foreground">{operatorById(c.operatorId)?.name} · {formById(c.formId)?.shortTitle}</p></div>
                <StatusBadge state={c.state} />
              </Link>
            ))}
            {persona.role === "fiscal" && <p className="pt-1 text-xs text-muted-foreground">Fiscal is view-only — no approval authority (separation of duties).</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
