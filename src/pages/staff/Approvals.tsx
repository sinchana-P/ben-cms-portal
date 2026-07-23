import { Link } from "react-router-dom";
import { useSession } from "@/context/session";
import { useAppData } from "@/context/appData";
import { formById } from "@/data/forms";
import { operatorById } from "@/data/operators";
import { siteById } from "@/data/sites";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CheckSquare, ArrowRight } from "lucide-react";

export default function Approvals() {
  const { persona } = useSession();
  const { cases } = useAppData();

  const queue = cases.filter((c) =>
    persona.role === "beo"
      ? c.state === "beo_review" && c.assignedBeoId === persona.id
      : persona.role === "chief"
      ? c.state === "chief_review" || c.state === "beo_approved"
      : false
  );

  return (
    <div>
      <PageHeader
        eyebrow={persona.role === "beo" ? "Tier 1 · Bureau Enterprise Officer" : "Tier 2 · Bureau Chief"}
        title="Approval queue"
        description={
          persona.role === "beo"
            ? "First-tier review. Approve to route to the Chief for final approval, or return to the operator with a reason."
            : "Final approval. The uniform workflow routes every form Operator → BEO → Chief."
        }
        actions={<Badge variant="warning"><CheckSquare className="h-3 w-3" /> {queue.length} pending</Badge>}
      />

      {queue.length === 0 ? (
        <EmptyState icon={CheckSquare} title="Queue is clear" description="No submissions are awaiting your approval right now." />
      ) : (
        <Card>
          <CardContent className="px-0 py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submission</TableHead>
                  <TableHead>Operator · Site</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queue.map((c) => {
                  const form = formById(c.formId);
                  return (
                    <TableRow key={c.id}>
                      <TableCell>
                        <div className="font-medium">{c.title}</div>
                        <div className="text-xs text-muted-foreground">{form?.code} · {c.id}</div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div>{operatorById(c.operatorId)?.name}</div>
                        <div className="text-xs text-muted-foreground">{siteById(c.siteId)?.name}</div>
                      </TableCell>
                      <TableCell className="tabular-nums">{c.amount ? formatCurrency(c.amount) : "—"}</TableCell>
                      <TableCell><StatusBadge state={c.state} /></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(c.submittedOn)}</TableCell>
                      <TableCell className="text-right">
                        <Button asChild size="sm"><Link to={`/staff/cases/${c.id}`}>Review <ArrowRight className="h-4 w-4" /></Link></Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
