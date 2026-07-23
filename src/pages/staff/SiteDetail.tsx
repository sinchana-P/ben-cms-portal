import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { siteById, SITE_TYPE_LABEL, plHistoryForSite } from "@/data/sites";
import { assignmentsForSite } from "@/data/assignments";
import { operatorById, OPERATORS } from "@/data/operators";
import { equipmentForSites, EQUIPMENT_STATUS_LABEL } from "@/data/equipment";
import { reviewsForSite, REVIEW_FLOW_LABEL, REVIEW_FLOW_ORDER } from "@/data/siteReviews";
import type { SiteAssignment, AssignmentRole } from "@/types";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import {
  ArrowLeft, Building2, MapPin, Pencil, AlertTriangle, Check, Clock, Users, Plus,
  FileText, Package, ArrowRight, Map, UploadCloud, Download, FileCheck2, UserPlus,
} from "lucide-react";

export default function SiteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const site = siteById(id ?? "");
  const [assignments, setAssignments] = useState<SiteAssignment[]>(() => assignmentsForSite(id ?? ""));
  if (!site) return <p className="text-muted-foreground">Site not found.</p>;

  const current = assignments.filter((a) => !a.endDate);
  const primary = current.find((a) => a.role === "Primary");
  const primaryOp = operatorById(primary?.operatorId ?? null);
  const equip = equipmentForSites([site.id]);
  const reviews = reviewsForSite(site.id);
  const pl = plHistoryForSite(site.id);
  const isInterim = primary?.operatorStatusAtSite === "Interim";

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => navigate("/staff/sites")} className="mb-3 -ml-2"><ArrowLeft className="h-4 w-4" /> Back to Sites</Button>

      {/* Header strip */}
      <Card className="mb-5">
        <CardContent className="py-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Building2 className="h-6 w-6" /></div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold" style={{ color: "hsl(var(--ben-heading))" }}>{site.name}</h1>
                  <StatusBadge state={site.status} />
                  <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-xs font-semibold text-primary">{site.benId}</span>
                  <Badge variant="secondary">{SITE_TYPE_LABEL[site.type]}</Badge>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {site.address}, {site.city} — {site.floor}</span>
                  <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {site.hostAgency} ({site.hostAgencyType})</span>
                </div>
                {primaryOp && (
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Operator:</span>
                    <span className="font-medium">{primaryOp.name}</span>
                    {isInterim && <Badge variant="warning" className="text-[10px]"><Clock className="h-3 w-3" /> INTERIM — Month 7 of 12–18</Badge>}
                    {primary && <span className="text-xs text-muted-foreground">| Assigned {formatDate(primary.startDate)}</span>}
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline"><Pencil className="h-4 w-4" /> Edit</Button>
              {site.status !== "closed" && (
                <Button variant="destructive" onClick={() => navigate(`/staff/sites/${site.id}/close`)}><AlertTriangle className="h-4 w-4" /> Close Site</Button>
              )}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <InfoChip label="Site Type" value={SITE_TYPE_LABEL[site.type]} />
            <InfoChip label="Equipment on Site" value={`${equip.length} items`} />
            <InfoChip label="Set-Aside (Net Profits)" value={`${site.setAsidePct}%`} />
            <InfoChip label="P&L Due" value="20th of month" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="equipment">Equipment ({equip.length})</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          <TabsTrigger value="reviews">Site Reviews</TabsTrigger>
          <TabsTrigger value="pl">P&amp;L History</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><Building2 className="h-4 w-4" /> Host Agency</CardTitle></CardHeader>
              <CardContent className="space-y-3 text-sm">
                <Field label="Agency" value={site.hostAgency} />
                <Field label="Contact" value={`${site.hostContact} — ${site.hostEmail}`} />
                <Field label="Contract" value={site.contractStart ? `${formatDate(site.contractStart)} — ${formatDate(site.contractEnd!)}` : "Not yet on file"} note={site.contractEnd ? "expiring in 5 months" : undefined} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base">SFY 2026 Financials</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                <InfoChip label="Net Profit YTD" value={formatCurrency(site.monthlyRevenue * 0.68 * 6)} tone="success" />
                <InfoChip label={`Set-Aside (${site.setAsidePct}%)`} value={formatCurrency(site.monthlyRevenue * 0.68 * 6 * site.setAsidePct / 100)} tone="warning" />
                <InfoChip label="P&Ls Submitted" value="6 / 6" />
                <InfoChip label="Loan Repayments" value={formatCurrency(1200)} />
              </CardContent>
            </Card>
          </div>
          {site.routeStops && (
            <Card className="mt-4">
              <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><Map className="h-4 w-4" /> Vending Route Stops</CardTitle></CardHeader>
              <CardContent>
                <p className="mb-3 rounded-md bg-info-soft px-3 py-2 text-xs text-info">A vending route has machines across multiple buildings. Equipment is assigned per stop, not to the route as a whole.</p>
                <ol className="space-y-2">
                  {site.routeStops.map((st, i) => (
                    <li key={i} className="flex items-center gap-3 rounded-lg border p-2.5 text-sm">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold">{i + 1}</span>
                      <span className="font-medium">{st.building}</span>
                      <span className="text-muted-foreground">{st.address} · {st.county} County</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Equipment — the Site⇄Equipment link */}
        <TabsContent value="equipment">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">{equip.length} equipment items at this site</CardTitle>
              <Button asChild size="sm" variant="outline"><Link to="/staff/equipment">Open Equipment module <ArrowRight className="h-4 w-4" /></Link></Button>
            </CardHeader>
            <CardContent className="px-0 py-0">
              {equip.length === 0 ? (
                <p className="px-5 py-6 text-sm text-muted-foreground">No equipment assigned to this site yet.</p>
              ) : (
                <Table>
                  <TableHeader><TableRow><TableHead>BEN Tag</TableHead><TableHead>Equipment</TableHead><TableHead>Category</TableHead><TableHead>Warranty</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {equip.map((e) => (
                      <TableRow key={e.id}>
                        <TableCell><span className="font-mono text-xs text-primary">{e.tagId}</span></TableCell>
                        <TableCell><Link to="/staff/equipment" className="font-medium hover:text-primary">{e.name}</Link><div className="text-xs text-muted-foreground">{e.manufacturer} {e.model}</div></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{e.category}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{formatDate(e.warrantyUntil)}</TableCell>
                        <TableCell><StatusBadge state={e.status} label={EQUIPMENT_STATUS_LABEL[e.status]} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assignments — the site_operator_assignments table */}
        <TabsContent value="assignments">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base"><Users className="h-4 w-4" /> Operator assignments</CardTitle>
                <ReassignDialog
                  siteId={site.id}
                  onReassign={(operatorId, role, notes) => {
                    const now = new Date().toISOString().slice(0, 10);
                    setAssignments((prev) => {
                      let next = role === "Primary" ? prev.map((a) => (a.role === "Primary" && !a.endDate ? { ...a, endDate: now } : a)) : [...prev];
                      const op = operatorById(operatorId);
                      next = [{
                        id: `A-${Date.now()}`, siteId: site.id, operatorId, role, startDate: now, endDate: null,
                        assignedBy: "You (staff)", operatorStatusAtSite: op?.status === "interim" ? "Interim" : "Licensed", notes,
                      }, ...next];
                      return next;
                    });
                  }}
                />
              </div>
              <p className="text-sm text-muted-foreground">A site can hold several concurrent roles; only the Primary owns P&L and set-aside. Reassigning closes the current row and opens a new one — history is preserved.</p>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {assignments.map((a) => {
                const op = operatorById(a.operatorId);
                const active = !a.endDate;
                return (
                  <div key={a.id} className={cn("flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3", active ? "border-success/30 bg-success-soft/30" : "opacity-70")}>
                    <div className="flex items-center gap-3">
                      <Badge variant={a.role === "Primary" ? "default" : a.role === "Relief" ? "info" : "warning"}>{a.role}</Badge>
                      <div>
                        <Link to={`/staff/operators/${a.operatorId}`} className="text-sm font-medium hover:text-primary">{op?.name}</Link>
                        <div className="text-xs text-muted-foreground">
                          {formatDate(a.startDate)} → {a.endDate ? formatDate(a.endDate) : "present"} · by {a.assignedBy} · {a.operatorStatusAtSite}
                        </div>
                        {a.notes && <div className="mt-0.5 text-xs italic text-muted-foreground">{a.notes}</div>}
                      </div>
                    </div>
                    {active ? <Badge variant="success"><Check className="h-3 w-3" /> Active</Badge> : <Badge variant="muted">Ended</Badge>}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews — staff-initiated → operator signs */}
        <TabsContent value="reviews">
          <div className="mb-4 rounded-lg bg-info-soft px-4 py-2.5 text-sm text-info">
            <strong>Workflow:</strong> BEO staff creates and fills the review → sends to operator → operator adds comments &amp; signs → finalised. Operators do not initiate reviews.
          </div>
          <div className="mb-3 flex justify-end"><Button size="sm"><Plus className="h-4 w-4" /> Create new review</Button></div>
          <div className="space-y-3">
            {reviews.map((r) => {
              const activeIdx = REVIEW_FLOW_ORDER.indexOf(r.flowState);
              return (
                <Card key={r.id}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-semibold">{r.kind === "monthly" ? "Monthly" : "Annual"} Site Review — {r.period}</div>
                        <div className="text-xs text-muted-foreground">Created by {r.createdByBeo} · {formatDate(r.createdOn)}</div>
                      </div>
                      <div className="text-right">
                        <div className={cn("text-xl font-bold", r.score ? "text-success" : "text-warning")}>{r.score ?? "—"}</div>
                        <div className="text-[11px] text-muted-foreground">{r.score ? "/ 100" : "Pending"}</div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      {REVIEW_FLOW_ORDER.map((f, i) => {
                        const done = i < activeIdx || r.flowState === "finalised";
                        const activeStep = i === activeIdx && r.flowState !== "finalised";
                        return (
                          <div key={f} className="flex items-center gap-1.5">
                            <span className={cn("flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold",
                              done ? "bg-success-soft text-success" : activeStep ? "bg-warning-soft text-warning" : "bg-muted text-muted-foreground")}>
                              {done ? <Check className="h-3 w-3" /> : activeStep ? <Clock className="h-3 w-3" /> : null}{REVIEW_FLOW_LABEL[f]}
                            </span>
                            {i < REVIEW_FLOW_ORDER.length - 1 && <span className="text-[10px] text-muted-foreground">→</span>}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* P&L History — set-aside on NET profit */}
        <TabsContent value="pl">
          <Card>
            <CardContent className="px-0 py-0">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Month</TableHead><TableHead>Status</TableHead>
                  <TableHead className="text-right">Gross Revenue</TableHead>
                  <TableHead className="text-right">Net Profit</TableHead>
                  <TableHead className="text-right">Set-Aside ({site.setAsidePct}%)</TableHead>
                  <TableHead>Payment</TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {pl.map((row) => (
                    <TableRow key={row.month}>
                      <TableCell className="text-sm text-muted-foreground">{row.month}</TableCell>
                      <TableCell><StatusBadge state={row.status} /></TableCell>
                      <TableCell className="text-right tabular-nums">{formatCurrency(row.grossRevenue)}</TableCell>
                      <TableCell className="text-right tabular-nums text-success">{formatCurrency(row.netProfit)}</TableCell>
                      <TableCell className="text-right font-semibold tabular-nums text-warning">{formatCurrency(row.setAside)}{row.payment !== "paid" ? " due" : ""}</TableCell>
                      <TableCell><Badge variant={row.payment === "paid" ? "success" : row.payment === "pending" ? "warning" : "destructive"}>{row.payment === "paid" ? "Paid" : row.payment === "pending" ? "Pending" : "Due"}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <p className="mt-2 text-xs text-muted-foreground">Set-aside is calculated on <strong>net profit</strong>, not gross revenue, at the site's configured rate.</p>
        </TabsContent>

        {/* Documents — host-agency contract + site files (Q190 / Q38) */}
        <TabsContent value="documents">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">Site documents</CardTitle>
              <Button size="sm" variant="outline"><UploadCloud className="h-4 w-4" /> Upload document</Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {/* Host-agency contract is a first-class, linked document */}
              <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/[0.04] p-3">
                <div className="flex items-center gap-3">
                  <FileCheck2 className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm font-medium">Host-Agency Contract — {site.hostAgency}</div>
                    <div className="text-xs text-muted-foreground">
                      {site.contractStart ? `${formatDate(site.contractStart)} — ${formatDate(site.contractEnd!)}` : "Not yet on file"} · linked to this site
                    </div>
                  </div>
                </div>
                {site.contractOnFile
                  ? <Button size="sm" variant="ghost"><Download className="h-4 w-4" /> Download</Button>
                  : <Badge variant="warning">Pending upload</Badge>}
              </div>
              {[
                { name: "Site Layout & Equipment Plan.pdf", type: "Operations", size: "420 KB", date: "2024-02-01" },
                { name: "Annual Site Review — SFY 2026.pdf", type: "Review", size: "180 KB", date: "2026-06-30" },
                { name: "Certificate of Insurance.pdf", type: "Compliance", size: "240 KB", date: "2026-01-12" },
              ].map((d) => (
                <div key={d.name} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{d.name}</div>
                      <div className="text-xs text-muted-foreground">{d.type} · {d.size} · {formatDate(d.date)}</div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost"><Download className="h-4 w-4" /> Download</Button>
                </div>
              ))}
              <p className="pt-1 text-xs text-muted-foreground">Documents are virus-scanned, versioned, and access-controlled per role.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoChip({ label, value, tone }: { label: string; value: string; tone?: "success" | "warning" }) {
  return (
    <div className="rounded-lg bg-muted/50 px-3 py-2">
      <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={cn("mt-0.5 text-sm font-semibold", tone === "success" && "text-success", tone === "warning" && "text-warning")}>{value}</div>
    </div>
  );
}

function Field({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-0.5">{value} {note && <span className="text-xs text-warning">({note})</span>}</div>
    </div>
  );
}

function ReassignDialog({ siteId, onReassign }: { siteId: string; onReassign: (operatorId: string, role: AssignmentRole, notes: string) => void }) {
  const [operatorId, setOperatorId] = useState("");
  const [role, setRole] = useState<AssignmentRole>("Primary");
  const [notes, setNotes] = useState("");
  const candidates = OPERATORS.filter((o) => o.status !== "archived");
  const chosen = OPERATORS.find((o) => o.id === operatorId);
  const atMax = role === "Primary" && chosen && chosen.siteIds.length >= 2 && !chosen.siteIds.includes(siteId);
  const canSave = !!operatorId && !atMax;

  return (
    <Dialog>
      <DialogTrigger asChild><Button size="sm" variant="outline"><UserPlus className="h-4 w-4" /> Reassign / add operator</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign an operator to this site</DialogTitle>
          <DialogDescription>Assigning a new Primary closes the current Primary's assignment (end-dated) and opens a new one. History is preserved and audited.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Operator</Label>
            <Select value={operatorId} onValueChange={setOperatorId}>
              <SelectTrigger><SelectValue placeholder="Select operator…" /></SelectTrigger>
              <SelectContent>
                {candidates.map((o) => <SelectItem key={o.id} value={o.id}>{o.name} — {o.siteIds.length}/2 sites</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as AssignmentRole)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Primary">Primary — owns P&amp;L &amp; set-aside</SelectItem>
                <SelectItem value="Relief">Relief — temporary cover</SelectItem>
                <SelectItem value="Trainee">Trainee — under supervision</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label>Reason / note</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Transferred from Henderson site" /></div>
          {atMax && (
            <p className="flex items-start gap-1.5 rounded-md border border-warning/30 bg-warning-soft px-3 py-2 text-xs text-warning">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> This operator already holds 2 sites (program maximum). Choose Relief/Trainee, a different operator, or reassign one of their sites first.
            </p>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <DialogClose asChild><Button disabled={!canSave} onClick={() => canSave && onReassign(operatorId, role, notes)}><Check className="h-4 w-4" /> Assign</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
