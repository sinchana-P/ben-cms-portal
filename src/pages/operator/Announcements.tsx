import { Link } from "react-router-dom";
import { ANNOUNCEMENTS } from "@/data/announcements";
import { SITE_TYPE_LABEL } from "@/data/sites";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Send, FileSearch } from "lucide-react";

export default function OperatorAnnouncements() {
  return (
    <div>
      <PageHeader
        title="Site announcements"
        description="New locations open to licensed operators. Apply with your business plan, resume, and references — staff review each application on merit (no automated ranking)."
        actions={<Button asChild variant="outline"><Link to="/operator/applications"><FileSearch className="h-4 w-4" /> My applications</Link></Button>}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {ANNOUNCEMENTS.map((a) => (
          <Card key={a.id} className={a.status !== "open" ? "opacity-70" : ""}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div><CardTitle className="text-base">{a.siteName}</CardTitle><p className="mt-0.5 text-xs text-muted-foreground">{a.hostAgency}</p></div>
                <StatusBadge state={a.status} />
              </div>
              <Badge variant="secondary" className="w-fit">{SITE_TYPE_LABEL[a.siteType]}</Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{a.body}</p>
              <div className="flex items-center justify-between border-t pt-3">
                <span className="text-xs text-muted-foreground">Closes {formatDate(a.closesOn)} · {a.applicants} applicants</span>
                {a.status === "open"
                  ? <Button asChild size="sm"><Link to={`/operator/apply/${a.id}`}><Send className="h-4 w-4" /> Apply</Link></Button>
                  : <Button size="sm" variant="outline" disabled>Closed</Button>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
