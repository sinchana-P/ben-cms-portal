import { Link } from "react-router-dom";
import { useSession } from "@/context/session";
import { useAppData } from "@/context/appData";
import { siteById, SITE_TYPE_LABEL } from "@/data/sites";
import { equipmentForSites, EQUIPMENT_STATUS_LABEL } from "@/data/equipment";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatCurrency } from "@/lib/utils";
import {
  Building2, MapPin, FileText, Wrench, FolderOpen, PenLine, AlertTriangle,
  Package, Refrigerator, Coffee, Monitor, Boxes, CheckCircle2,
} from "lucide-react";

const CAT_ICON: Record<string, any> = {
  "Refrigeration": Refrigerator, "Coffee Equipment": Coffee, "Vending Machine": Boxes,
  "POS / IT": Monitor, "Fixtures": Package,
};

export default function MySite() {
  const { persona } = useSession();
  const siteIds = persona.siteIds ?? [];
  const sites = siteIds.map((s) => siteById(s)).filter(Boolean);
  const equip = equipmentForSites(siteIds);
  const inMaintenance = equip.filter((e) => e.status === "maintenance");
  const { cases } = useAppData();
  const toSign = cases.filter((c) => c.operatorId === persona.id && c.state === "awaiting_ack");

  return (
    <div>
      <PageHeader title={sites.length > 1 ? "My sites" : "My site"} description="Your assigned location, the equipment at it, and quick actions. Everything you submit is automatically tied to your site." />

      {/* Pending signature banner (reverse-init reviews) */}
      {toSign.length > 0 && (
        <div className="mb-4 rounded-lg border border-warning/30 bg-warning-soft/50 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-warning"><PenLine className="h-4 w-4" /> {toSign.length} item{toSign.length > 1 ? "s" : ""} awaiting your signature</div>
          {toSign.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-md border bg-background p-3">
              <div><div className="text-sm font-medium">{c.title}</div><div className="text-xs text-muted-foreground">Review & sign to finalise</div></div>
              <Button asChild size="sm"><Link to={`/operator/submissions/${c.id}`}>Review &amp; sign</Link></Button>
            </div>
          ))}
        </div>
      )}

      {/* ARIA live maintenance alert — announced by screen readers */}
      {inMaintenance.length > 0 && (
        <div role="status" aria-live="polite" className="mb-4 flex items-center gap-2 rounded-lg border border-warning/30 bg-warning-soft/50 px-4 py-2.5 text-sm text-warning">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{inMaintenance.length} piece{inMaintenance.length > 1 ? "s" : ""} of equipment {inMaintenance.length > 1 ? "are" : "is"} under maintenance: {inMaintenance.map((e) => e.name).join(", ")}.</span>
        </div>
      )}

      {sites.map((s) => s && (
        <Card key={s.id} className="mb-5 overflow-hidden">
          <div className="flex items-start justify-between gap-4 bg-primary/10 px-5 py-4">
            <div>
              <div className="text-lg font-bold" style={{ color: "hsl(var(--ben-heading))" }}>{s.name}</div>
              <div className="font-mono text-xs text-primary">{s.benId} · {SITE_TYPE_LABEL[s.type]}</div>
            </div>
            <Badge variant="success"><CheckCircle2 className="h-3 w-3" /> Active</Badge>
          </div>
          <CardContent className="pt-5">
            <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Info label="Host Agency" value={s.hostAgency} icon={Building2} />
              <Info label="Location" value={`${s.address}, ${s.city}`} icon={MapPin} />
              <Info label="Set-Aside (net)" value={`${s.setAsidePct}% · P&L due 20th`} icon={FileText} />
            </div>

            {/* Quick actions */}
            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <QuickAction to="/operator/new/pnl" icon={FileText} label="Submit P&L" />
              <QuickAction to="/operator/new/maintenance-log" icon={Wrench} label="Report equipment problem" />
              <QuickAction to="/operator/documents" icon={FolderOpen} label="Site documents" />
            </div>

            {/* Equipment tiles at this site */}
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Equipment at this site ({equip.filter((e) => e.siteId === s.id).length})</div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {equip.filter((e) => e.siteId === s.id).map((e) => {
                  const Icon = CAT_ICON[e.category] ?? Package;
                  const warn = e.status === "maintenance";
                  return (
                    <div key={e.id} className="flex items-center gap-3 rounded-lg border bg-background p-3">
                      <Icon className="h-6 w-6 shrink-0 text-muted-foreground" aria-hidden />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{e.name}</div>
                        <div className="font-mono text-[11px] text-muted-foreground">{e.tagId}</div>
                        <div className={cn("mt-0.5 flex items-center gap-1 text-xs font-medium", warn ? "text-warning" : "text-success")}>
                          {warn ? <Wrench className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />} {EQUIPMENT_STATUS_LABEL[e.status]}
                        </div>
                      </div>
                      <Button asChild size="sm" variant="ghost"><Link to="/operator/new/maintenance-log">Report</Link></Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function Info({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
      <div><div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{label}</div><div className="text-sm">{value}</div></div>
    </div>
  );
}

function QuickAction({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-colors hover:border-primary hover:bg-primary/[0.04]">
      <Icon className="h-6 w-6 text-primary" aria-hidden />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
