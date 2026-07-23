import { Link } from "react-router-dom";
import { OPERATORS } from "@/data/operators";
import { siteById } from "@/data/sites";
import { personaById } from "@/data/personas";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, initials } from "@/lib/utils";
import { Accessibility } from "lucide-react";

export default function Operators() {
  return (
    <div>
      <PageHeader
        title="Operators"
        description="Licensed blind & visually impaired entrepreneurs. Each may hold up to 2 sites. Lifecycle: Applicant → Orientation → Training → Interim → Licensed."
        actions={<Badge variant="secondary">{OPERATORS.length} shown · 18 active</Badge>}
      />
      <Card>
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Operator</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sites</TableHead>
                <TableHead>Assigned BEO</TableHead>
                <TableHead>Accommodation</TableHead>
                <TableHead className="text-right">Loan Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {OPERATORS.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>
                    <Link to={`/staff/operators/${o.id}`} className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8"><AvatarFallback>{initials(o.name)}</AvatarFallback></Avatar>
                      <div>
                        <div className="font-medium hover:text-primary">{o.name}</div>
                        <div className="text-xs text-muted-foreground">{o.email}</div>
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell><StatusBadge state={o.status} /></TableCell>
                  <TableCell className="text-sm">
                    {o.siteIds.length === 0 ? <span className="text-muted-foreground">—</span> :
                      o.siteIds.map((s) => siteById(s)?.name).join(", ")}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{personaById(o.assignedBeoId)?.name ?? "—"}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Accessibility className="h-3.5 w-3.5" aria-hidden /> {o.visualAccommodation}
                    </span>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {o.outstandingLoanBalance > 0 ? formatCurrency(o.outstandingLoanBalance) : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
