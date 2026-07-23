import { Link } from "react-router-dom";
import { useSession } from "@/context/session";
import { useAppData } from "@/context/appData";
import { formById } from "@/data/forms";
import { siteById } from "@/data/sites";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { FilePlus2, PenLine } from "lucide-react";

export default function Submissions() {
  const { persona } = useSession();
  const { cases: all } = useAppData();
  const cases = all.filter((c) => c.operatorId === persona.id);
  const needsSign = cases.filter((c) => c.state === "awaiting_ack");

  return (
    <div>
      <PageHeader
        title="My submissions"
        description="Everything you've submitted, and anything awaiting your signature. You only ever see your own sites' data."
        actions={<Button asChild><Link to="/operator/new"><FilePlus2 className="h-4 w-4" /> New submission</Link></Button>}
      />

      {needsSign.length > 0 && (
        <Card className="mb-4 border-warning/40 bg-warning-soft/40">
          <CardContent className="flex items-center gap-3 py-3">
            <PenLine className="h-5 w-5 text-warning" />
            <span className="text-sm font-medium">{needsSign.length} site review{needsSign.length > 1 ? "s" : ""} awaiting your signature.</span>
            <Button asChild size="sm" variant="outline" className="ml-auto"><Link to={`/operator/submissions/${needsSign[0].id}`}>Review &amp; sign</Link></Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Submission</TableHead>
                <TableHead>Form</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((c) => (
                <TableRow key={c.id}>
                  <TableCell><Link to={`/operator/submissions/${c.id}`} className="font-medium hover:text-primary">{c.title}</Link></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formById(c.formId)?.shortTitle}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{siteById(c.siteId)?.name}</TableCell>
                  <TableCell><StatusBadge state={c.state} /></TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{formatDate(c.submittedOn)}</TableCell>
                </TableRow>
              ))}
              {cases.length === 0 && <TableRow><TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No submissions yet.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
