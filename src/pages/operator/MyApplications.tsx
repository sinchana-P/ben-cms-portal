import { Link } from "react-router-dom";
import { useSession } from "@/context/session";
import { applicationsForOperator, APPLICATION_STAGES } from "@/data/siteApplications";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";
import { Check, Clock, FileSearch, Megaphone } from "lucide-react";

export default function MyApplications() {
  const { persona } = useSession();
  const apps = applicationsForOperator(persona.id);

  return (
    <div>
      <PageHeader
        title="My applications"
        description="Track each new-site application through the two-tier pipeline: Submitted → BEO Review → Chief Interview → Decision → Assignment."
        actions={<Button asChild variant="outline"><Link to="/operator/announcements"><Megaphone className="h-4 w-4" /> Browse announcements</Link></Button>}
      />

      {apps.length === 0 ? (
        <EmptyState icon={FileSearch} title="No applications yet" description="When you apply for an announced site, its status appears here." action={<Button asChild><Link to="/operator/announcements">See open sites</Link></Button>} />
      ) : (
        <div className="space-y-4">
          {apps.map((app) => {
            const activeIdx = APPLICATION_STAGES.findIndex((s) => s.key === app.stage);
            return (
              <Card key={app.id}>
                <CardContent className="py-5">
                  <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold">{app.siteName}</div>
                      <div className="text-xs text-muted-foreground">{app.id} · submitted {formatDate(app.submittedOn)}</div>
                    </div>
                    <Badge variant={app.outcome === "awarded" ? "success" : app.outcome === "declined" ? "destructive" : "warning"}>
                      {app.outcome === "awarded" ? "Awarded" : app.outcome === "declined" ? "Not selected" : "In progress"}
                    </Badge>
                  </div>
                  <ol className="space-y-0">
                    {APPLICATION_STAGES.map((s, i) => {
                      const complete = i < activeIdx || app.outcome === "awarded";
                      const active = i === activeIdx && app.outcome === "in_progress";
                      const declinedHere = app.outcome === "declined" && i === activeIdx;
                      const last = i === APPLICATION_STAGES.length - 1;
                      return (
                        <li key={s.key} className="flex gap-3 pb-4 last:pb-0">
                          <div className="flex flex-col items-center">
                            <span className={cn("flex h-6 w-6 items-center justify-center rounded-full text-xs",
                              complete ? "bg-success text-white" : active ? "bg-primary text-primary-foreground" : declinedHere ? "bg-destructive text-destructive-foreground" : "border-2 border-border bg-muted text-muted-foreground")}>
                              {complete ? <Check className="h-3.5 w-3.5" /> : active ? <Clock className="h-3.5 w-3.5" /> : null}
                            </span>
                            {!last && <span className={cn("mt-1 w-0.5 flex-1", complete ? "bg-success" : "bg-border")} style={{ minHeight: 18 }} />}
                          </div>
                          <div className="pt-0.5">
                            <div className={cn("text-sm font-medium", !complete && !active && !declinedHere && "text-muted-foreground")}>{s.label}</div>
                            {active && <div className="text-xs text-warning">In progress</div>}
                            {declinedHere && <div className="text-xs text-destructive">Not selected at this stage</div>}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
