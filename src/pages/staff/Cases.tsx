import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "@/context/appData";
import { BEN_FORMS, formById } from "@/data/forms";
import { operatorById } from "@/data/operators";
import { siteById } from "@/data/sites";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { Search } from "lucide-react";

export default function Cases() {
  const [q, setQ] = useState("");
  const [formFilter, setFormFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { cases } = useAppData();

  const rows = cases.filter((c) => {
    if (formFilter !== "all" && c.formId !== formFilter) return false;
    if (statusFilter !== "all" && c.state !== statusFilter) return false;
    if (q && !`${c.title} ${operatorById(c.operatorId)?.name}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <PageHeader
        title="Submissions"
        description="Every BEN form submission across all operators and sites. Full program visibility for staff."
      />

      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search submissions or operators…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
        </div>
        <Select value={formFilter} onValueChange={setFormFilter}>
          <SelectTrigger className="w-full sm:w-56"><SelectValue placeholder="All forms" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All forms</SelectItem>
            {BEN_FORMS.map((f) => <SelectItem key={f.id} value={f.id}>{f.shortTitle}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="All statuses" /></SelectTrigger>
          <SelectContent>
            {["all", "submitted", "beo_review", "chief_review", "approved", "paid", "awaiting_ack", "reviewed", "rejected"].map((s) => (
              <SelectItem key={s} value={s}>{s === "all" ? "All statuses" : s.replace(/_/g, " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Submission</TableHead>
                <TableHead>Form</TableHead>
                <TableHead>Operator · Site</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((c) => (
                <TableRow key={c.id}>
                  <TableCell><Link to={`/staff/cases/${c.id}`} className="font-medium hover:text-primary">{c.title}</Link></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formById(c.formId)?.code}</TableCell>
                  <TableCell className="text-sm">
                    {operatorById(c.operatorId)?.name}
                    <div className="text-xs text-muted-foreground">{siteById(c.siteId)?.name}</div>
                  </TableCell>
                  <TableCell><StatusBadge state={c.state} /></TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{formatDate(c.submittedOn)}</TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow><TableCell colSpan={5} className="py-8 text-center text-sm text-muted-foreground">No submissions match your filters.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
