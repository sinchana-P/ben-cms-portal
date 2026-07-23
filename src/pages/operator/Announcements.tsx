import { ANNOUNCEMENTS } from "@/data/announcements";
import { SITE_TYPE_LABEL } from "@/data/sites";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { UploadCloud, Send, Megaphone } from "lucide-react";

export default function OperatorAnnouncements() {
  const open = ANNOUNCEMENTS.filter((a) => a.status === "open");
  return (
    <div>
      <PageHeader
        title="Site announcements"
        description="New locations open to licensed operators. Apply with your business plan, resume, and references — staff review and score applications."
      />
      {open.length === 0 && <p className="text-sm text-muted-foreground">No open announcements right now.</p>}
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
                <span className="text-xs text-muted-foreground">Closes {formatDate(a.closesOn)}</span>
                {a.status === "open" ? <ApplyDialog site={a.siteName} /> : <Button size="sm" variant="outline" disabled>Closed</Button>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ApplyDialog({ site }: { site: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild><Button size="sm"><Send className="h-4 w-4" /> Apply</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply for {site}</DialogTitle>
          <DialogDescription>Attach the required documents. Staff will review and score your application.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {["Business plan", "Resume", "Letters of recommendation"].map((d) => (
            <div key={d} className="space-y-1.5">
              <Label>{d}</Label>
              <div className="flex items-center gap-2 rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground">
                <UploadCloud className="h-4 w-4" /> Upload {d.toLowerCase()}
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <DialogClose asChild><Button><Send className="h-4 w-4" /> Submit application</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
