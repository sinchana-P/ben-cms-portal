import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatDateTime } from "@/lib/utils";
import {
  KeyRound, ShieldCheck, Lock, ScrollText, FileArchive, Cloud, DatabaseBackup, Users2,
} from "lucide-react";

const CONTROLS = [
  { icon: KeyRound, title: "Multi-factor authentication", status: "Have", body: "Operators: username + password + OTP. Cannot be disabled at user level.", ref: "SE-1" },
  { icon: ShieldCheck, title: "Active Directory SSO (SAML)", status: "Have", body: "Staff authenticate with existing Nevada AD credentials — no separate password.", ref: "SE-2" },
  { icon: Users2, title: "Row-level operator isolation", status: "Partial", body: "Operators see only their own sites' data, enforced server-side by operator→site scoping.", ref: "SE-3" },
  { icon: ScrollText, title: "Audit trail", status: "Have", body: "Every submission and action timestamped with the acting user. Immutable log.", ref: "SE-4" },
  { icon: Lock, title: "Encryption", status: "Partial", body: "AES-256 at rest, TLS 1.2+ in transit. Documented in the Customer Responsibility Matrix.", ref: "SE-5" },
  { icon: FileArchive, title: "Document storage controls", status: "Partial", body: "Type/size limits, versioning, virus scan, purge rules, document-level security.", ref: "SE-5" },
  { icon: Cloud, title: "FedRAMP Moderate hosting", status: "Gap", body: "US-only residency on Azure Government / GovCloud, NIST 800-53B Moderate. Long-lead infra.", ref: "SE-6" },
  { icon: DatabaseBackup, title: "Disaster recovery", status: "Partial", body: "Nightly backups; RPO ≤ 4 hours. BC/DR plan tested through the contract.", ref: "SE-7" },
];

const AUDIT = [
  { at: "2026-08-18T14:22:00", user: "Maria Delgado", action: "Submitted P&L (C-2048)", ip: "10.4.2.11" },
  { at: "2026-08-18T09:40:00", user: "Ben Alvarez", action: "Assigned vendor to ticket T-3012", ip: "10.4.1.8" },
  { at: "2026-08-18T08:05:00", user: "Karen Whitfield", action: "Approved P&L (C-2041)", ip: "10.4.1.2" },
  { at: "2026-08-17T13:30:00", user: "Priya Nair", action: "Paid set-aside via ACH (SA-2039)", ip: "10.4.2.19" },
  { at: "2026-08-15T14:00:00", user: "Dana Cole", action: "Recommended loan approval (C-2035)", ip: "10.4.1.6" },
];

export default function Security() {
  return (
    <div>
      <PageHeader
        title="Security &amp; Audit"
        description="Access controls, encryption, hosting posture, and the immutable audit trail. Mapped to RFP §5 and the Customer Responsibility Matrix."
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {CONTROLS.map((c) => (
          <Card key={c.title}>
            <CardContent className="flex items-start gap-3 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><c.icon className="h-5 w-5" /></div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">{c.title}</h3>
                  <Badge variant={c.status === "Have" ? "success" : c.status === "Partial" ? "warning" : "destructive"}>{c.status}</Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{c.body}</p>
                <span className="mt-1 inline-block font-mono text-[10px] text-muted-foreground">{c.ref}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader className="pb-2"><CardTitle className="flex items-center gap-2 text-base"><ScrollText className="h-4 w-4" /> Audit trail (recent)</CardTitle></CardHeader>
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader><TableRow><TableHead>Timestamp</TableHead><TableHead>User</TableHead><TableHead>Action</TableHead><TableHead>IP</TableHead></TableRow></TableHeader>
            <TableBody>
              {AUDIT.map((a, i) => (
                <TableRow key={i}>
                  <TableCell className="text-sm text-muted-foreground">{formatDateTime(a.at)}</TableCell>
                  <TableCell className="text-sm font-medium">{a.user}</TableCell>
                  <TableCell className="text-sm">{a.action}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{a.ip}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
