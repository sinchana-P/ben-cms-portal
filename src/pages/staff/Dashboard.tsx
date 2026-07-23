import { Link } from "react-router-dom";
import { useSession } from "@/context/session";
import { useAppData } from "@/context/appData";
import { PROGRAM_STATS } from "@/data/sites";
import { TICKETS } from "@/data/tickets";
import { formById } from "@/data/forms";
import { operatorById } from "@/data/operators";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ROLE_LABEL } from "@/data/personas";
import {
  Users, MapPin, Package, CheckSquare, ArrowRight, Wrench, DollarSign, TrendingUp,
} from "lucide-react";

export default function StaffDashboard() {
  const { persona } = useSession();
  const { cases, payments } = useAppData();

  const myQueue = cases.filter((c) =>
    persona.role === "beo"
      ? c.state === "beo_review" && c.assignedBeoId === persona.id
      : persona.role === "chief"
      ? c.state === "chief_review" || c.state === "beo_approved"
      : ["submitted", "beo_review", "chief_review"].includes(c.state)
  );

  const recent = [...cases].sort((a, b) => b.submittedOn.localeCompare(a.submittedOn)).slice(0, 6);
  const openTickets = TICKETS.filter((t) => t.state !== "resolved").length;
  const setAsideMTD = payments.filter((p) => p.kind === "set_aside" && p.status === "completed").reduce((a, p) => a + p.amount, 0);

  return (
    <div>
      <PageHeader
        eyebrow={`${ROLE_LABEL[persona.role]} · ${persona.name}`}
        title={`Welcome back, ${persona.name.split(" ")[0]}`}
        description="Business Enterprise of Nevada — program operations at a glance."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Active Operators" value={PROGRAM_STATS.activeOperators} sub="+2 per year" icon={Users} />
        <StatCard label="Sites" value={PROGRAM_STATS.totalSites} sub="4 types across NV" icon={MapPin} tone="info" />
        <StatCard label="Equipment Items" value={PROGRAM_STATS.equipmentItems.toLocaleString()} sub="migrated from Sortly" icon={Package} />
        <StatCard label="Pending Approvals" value={myQueue.length} sub="in your queue" icon={CheckSquare} tone="warning" />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Set-aside (MTD)" value={formatCurrency(setAsideMTD)} sub="program funding" icon={DollarSign} tone="success" />
        <StatCard label="Open Tickets" value={openTickets} sub="equipment R&M" icon={Wrench} tone="warning" />
        <StatCard label="Staff" value={PROGRAM_STATS.staff} sub="1 Chief · 4 BEO · 2 Fiscal · 1 Admin" icon={Users} />
        <StatCard label="Yrs of History" value={PROGRAM_STATS.yearsOfHistory} sub="~10,000 legacy files" icon={TrendingUp} tone="info" />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_360px]">
        {/* Recent submissions */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-base">Recent submissions</CardTitle>
            <Button asChild variant="ghost" size="sm"><Link to="/staff/cases">View all <ArrowRight className="h-4 w-4" /></Link></Button>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submission</TableHead>
                  <TableHead>Operator</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((c) => (
                  <TableRow key={c.id} className="cursor-pointer">
                    <TableCell>
                      <Link to={`/staff/cases/${c.id}`} className="font-medium hover:text-primary">{c.title}</Link>
                      <div className="text-xs text-muted-foreground">{formById(c.formId)?.code}</div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{operatorById(c.operatorId)?.name}</TableCell>
                    <TableCell><StatusBadge state={c.state} /></TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">{formatDate(c.submittedOn)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Your queue */}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Needs your attention</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {myQueue.length === 0 && <p className="text-sm text-muted-foreground">Nothing awaiting your action.</p>}
            {myQueue.map((c) => (
              <Link key={c.id} to={`/staff/cases/${c.id}`} className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{operatorById(c.operatorId)?.name} · {formById(c.formId)?.shortTitle}</p>
                </div>
                <StatusBadge state={c.state} />
              </Link>
            ))}
            {persona.role === "fiscal" && (
              <p className="pt-1 text-xs text-muted-foreground">Fiscal role is view-only — no approval authority (separation of duties).</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
