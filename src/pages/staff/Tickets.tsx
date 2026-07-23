import { useState } from "react";
import { TICKETS, TICKET_STATE_LABEL, TICKET_LIFECYCLE } from "@/data/tickets";
import { equipmentById } from "@/data/equipment";
import { siteById } from "@/data/sites";
import { operatorById } from "@/data/operators";
import type { Ticket } from "@/types";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn, formatDate, formatDateTime } from "@/lib/utils";
import { Check, Circle, Wrench } from "lucide-react";

export default function Tickets() {
  const [sel, setSel] = useState<Ticket | null>(null);
  return (
    <div>
      <PageHeader
        title="Maintenance & Service Tickets"
        description="Equipment R&M lifecycle: submitted → under review → assigned (vendor) → in progress → resolved. Preventive & corrective."
        actions={<Badge variant="warning"><Wrench className="h-3 w-3" /> {TICKETS.filter(t => t.state !== "resolved").length} open</Badge>}
      />
      <Card>
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket</TableHead>
                <TableHead>Equipment · Site</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Requested</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {TICKETS.map((t) => (
                <TableRow key={t.id} className="cursor-pointer" onClick={() => setSel(t)}>
                  <TableCell><div className="font-medium">{t.summary}</div><div className="text-xs text-muted-foreground">{t.id} · {operatorById(t.operatorId)?.name}</div></TableCell>
                  <TableCell className="text-sm">{equipmentById(t.equipmentId)?.name}<div className="text-xs text-muted-foreground">{siteById(t.siteId)?.name}</div></TableCell>
                  <TableCell><Badge variant={t.type === "corrective" ? "warning" : "info"}>{t.type}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{t.vendor ?? "—"}</TableCell>
                  <TableCell><StatusBadge state={t.state} label={TICKET_STATE_LABEL[t.state]} /></TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{formatDate(t.requestedDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={!!sel} onOpenChange={(o) => !o && setSel(null)}>
        <SheetContent className="w-full sm:max-w-lg">{sel && <TicketDetail t={sel} />}</SheetContent>
      </Sheet>
    </div>
  );
}

function TicketDetail({ t }: { t: Ticket }) {
  const activeIdx = TICKET_LIFECYCLE.indexOf(t.state as any);
  return (
    <>
      <SheetHeader>
        <SheetTitle>{t.summary}</SheetTitle>
        <SheetDescription>{t.id} · {equipmentById(t.equipmentId)?.name} · {siteById(t.siteId)?.name}</SheetDescription>
      </SheetHeader>
      <div className="space-y-5 p-6 pt-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {TICKET_LIFECYCLE.map((s, i) => {
            const done = activeIdx >= 0 && i <= activeIdx;
            const active = i === activeIdx;
            return (
              <div key={s} className="flex items-center gap-1.5">
                <div className={cn("flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium",
                  done && !active && "border-success/30 bg-success-soft text-success",
                  active && "border-primary bg-primary/10 text-primary",
                  !done && "border-border text-muted-foreground")}>
                  {done && !active ? <Check className="h-3 w-3" /> : <Circle className="h-3 w-3" />}{TICKET_STATE_LABEL[s]}
                </div>
                {i < TICKET_LIFECYCLE.length - 1 && <span className="text-xs text-muted-foreground">→</span>}
              </div>
            );
          })}
        </div>
        <div className="text-sm">
          <p className="text-muted-foreground">{t.description}</p>
        </div>
        <Separator />
        <div>
          <div className="mb-2 text-sm font-semibold">Activity</div>
          <ol className="space-y-3">
            {t.timeline.map((e, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary/10"><Check className="h-2.5 w-2.5 text-primary" /></span>
                <div>
                  <p className="text-sm font-medium">{TICKET_STATE_LABEL[e.state]}</p>
                  <p className="text-xs text-muted-foreground">{e.actor} · {formatDateTime(e.at)}</p>
                  {e.note && <p className="mt-0.5 text-sm text-foreground/80">{e.note}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}
