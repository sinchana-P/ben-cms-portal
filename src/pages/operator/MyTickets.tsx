import { Link } from "react-router-dom";
import { useSession } from "@/context/session";
import { ticketsForSites, TICKET_STATE_LABEL, TICKET_LIFECYCLE } from "@/data/tickets";
import { equipmentById } from "@/data/equipment";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";
import { Wrench, Check, Circle } from "lucide-react";

export default function MyTickets() {
  const { persona } = useSession();
  const tickets = ticketsForSites(persona.siteIds ?? []);

  return (
    <div>
      <PageHeader
        title="My maintenance tickets"
        description="Track repairs from open to resolved. You'll be notified when a vendor is assigned and when work is complete."
        actions={<Button asChild><Link to="/operator/new/maintenance-log"><Wrench className="h-4 w-4" /> New ticket</Link></Button>}
      />
      {tickets.length === 0 ? (
        <EmptyState icon={Wrench} title="No open tickets" description="Reported issues will appear here with live status." />
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => {
            const activeIdx = TICKET_LIFECYCLE.indexOf(t.state as any);
            return (
              <Card key={t.id}>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="font-medium">{t.summary}</div>
                      <div className="text-xs text-muted-foreground">{t.id} · {equipmentById(t.equipmentId)?.name} · requested {formatDate(t.requestedDate)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={t.type === "corrective" ? "warning" : "info"}>{t.type}</Badge>
                      <StatusBadge state={t.state} label={TICKET_STATE_LABEL[t.state]} />
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    {TICKET_LIFECYCLE.map((s, i) => {
                      const done = activeIdx >= 0 && i <= activeIdx; const active = i === activeIdx;
                      return (
                        <div key={s} className="flex items-center gap-1.5">
                          <span className={cn("flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
                            done && !active && "border-success/30 bg-success-soft text-success",
                            active && "border-primary bg-primary/10 text-primary",
                            !done && "border-border text-muted-foreground")}>
                            {done && !active ? <Check className="h-2.5 w-2.5" /> : <Circle className="h-2.5 w-2.5" />}{TICKET_STATE_LABEL[s]}
                          </span>
                          {i < TICKET_LIFECYCLE.length - 1 && <span className="text-[10px] text-muted-foreground">→</span>}
                        </div>
                      );
                    })}
                  </div>
                  {t.vendor && <p className="mt-2 text-xs text-muted-foreground">Assigned vendor: <span className="font-medium text-foreground">{t.vendor}</span></p>}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
