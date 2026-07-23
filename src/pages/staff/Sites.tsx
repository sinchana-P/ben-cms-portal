import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SITES, SITE_TYPE_LABEL, PROGRAM_STATS } from "@/data/sites";
import { primaryOperatorId } from "@/data/assignments";
import { operatorById } from "@/data/operators";
import { equipmentForSites } from "@/data/equipment";
import type { PlStatus, Site } from "@/types";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import {
  Coffee, Gift, ShoppingCart, Truck, Search, Plus, Megaphone, AlertTriangle,
  CheckCircle2, Clock, Accessibility,
} from "lucide-react";

const TYPE_ICON = { cafe: Coffee, gift_shop: Gift, micro_market: ShoppingCart, vending_route: Truck };

function PlChip({ status }: { status: PlStatus }) {
  if (status === "submitted" || status === "approved")
    return <span className="inline-flex items-center gap-1 rounded border border-success/30 bg-success-soft px-2 py-0.5 text-xs font-semibold text-success"><CheckCircle2 className="h-3 w-3" /> {status === "approved" ? "Approved" : "Submitted"}</span>;
  if (status === "due")
    return <span className="inline-flex items-center gap-1 rounded border border-warning/30 bg-warning-soft px-2 py-0.5 text-xs font-semibold text-warning"><Clock className="h-3 w-3" /> Due Jul 20</span>;
  if (status === "overdue")
    return <span className="inline-flex items-center gap-1 rounded border border-destructive/30 bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive"><AlertTriangle className="h-3 w-3" /> Overdue</span>;
  return <span className="text-xs text-muted-foreground">—</span>;
}

export default function Sites() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");

  const rows = SITES.filter((s) => {
    if (type !== "all" && s.type !== type) return false;
    if (status !== "all" && s.status !== status) return false;
    if (q) {
      const op = operatorById(primaryOperatorId(s.id));
      const hay = `${s.name} ${s.benId} ${s.hostAgency} ${op?.name ?? ""}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div>
      <PageHeader
        title="Sites & Locations"
        description="22 active BEN vending locations across Nevada — growing by ~2 per year. A site is the top-level record: equipment lives at it, an operator runs it, P&L is reported per site."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" asChild><Link to="/staff/announcements"><Megaphone className="h-4 w-4" /> Post Announcement</Link></Button>
            <Button asChild><Link to="/staff/sites/new"><Plus className="h-4 w-4" /> Add New Site</Link></Button>
          </div>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard label="Total Sites" value={PROGRAM_STATS.totalSites} sub="+2 projected" />
        <StatCard label="Micro Markets" value={PROGRAM_STATS.microMarkets} sub="largest category" icon={ShoppingCart} />
        <StatCard label="Vending Routes" value={PROGRAM_STATS.vendingRoutes} sub="multi-location" icon={Truck} tone="warning" />
        <StatCard label="Cafeterias" value={PROGRAM_STATS.cafes} sub="full-service" icon={Coffee} tone="success" />
        <StatCard label="Gift Shops" value={PROGRAM_STATS.giftShops} sub="retail" icon={Gift} tone="info" />
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-lg border border-warning/30 bg-warning-soft/50 px-4 py-2.5 text-sm text-warning" role="alert">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span><strong>P&L due the 20th of each month.</strong> 3 operators have not yet submitted for July 2026.</span>
      </div>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by site, BEN ID, operator, host agency…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Site Types</SelectItem>
            {Object.entries(SITE_TYPE_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="open">Open — No Operator</SelectItem>
            <SelectItem value="pending_closure">Pending Closure</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>BEN Site ID</TableHead>
                <TableHead>Site Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>P&amp;L — July</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((s) => {
                const Icon = TYPE_ICON[s.type];
                const op = operatorById(primaryOperatorId(s.id));
                const isInterim = op?.status === "interim";
                return (
                  <TableRow key={s.id} className="cursor-pointer" onClick={() => navigate(`/staff/sites/${s.id}`)}>
                    <TableCell><span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-xs font-semibold text-primary">{s.benId}</span></TableCell>
                    <TableCell><Link to={`/staff/sites/${s.id}`} className="font-medium hover:text-primary" onClick={(e) => e.stopPropagation()}>{s.name}</Link></TableCell>
                    <TableCell><Badge variant="secondary"><Icon className="h-3 w-3" /> {SITE_TYPE_LABEL[s.type]}</Badge></TableCell>
                    <TableCell className="text-sm">
                      {op ? (
                        <span className="flex items-center gap-1.5">{op.name}{isInterim && <Badge variant="warning" className="px-1.5 py-0 text-[10px]">INTERIM</Badge>}</span>
                      ) : <span className="text-muted-foreground">— Unassigned</span>}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{equipmentForSites([s.id]).length} items</TableCell>
                    <TableCell><PlChip status={s.plStatus} /></TableCell>
                    <TableCell><StatusBadge state={s.status} /></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
