import { Link } from "react-router-dom";
import { ANNOUNCEMENTS } from "@/data/announcements";
import { SITE_TYPE_LABEL } from "@/data/sites";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { Megaphone, Plus, Users, FileCheck2 } from "lucide-react";

export default function Announcements() {
  return (
    <div>
      <PageHeader
        title="New-Site Announcements"
        description="Post available sites to the operator landing page. Operators apply with a business plan, resume, and references; staff score applications off-system and upload award letters."
        actions={<NewAnnouncementDialog />}
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {ANNOUNCEMENTS.map((a) => (
          <Card key={a.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base">{a.siteName}</CardTitle>
                  <p className="mt-0.5 text-xs text-muted-foreground">{a.hostAgency}</p>
                </div>
                <StatusBadge state={a.status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Badge variant="secondary">{SITE_TYPE_LABEL[a.siteType]}</Badge>
              <p className="text-sm text-muted-foreground">{a.body}</p>
              <div className="flex items-center justify-between border-t pt-3 text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground"><Users className="h-4 w-4" /> {a.applicants} applicants</span>
                <span className="text-xs text-muted-foreground">Posted {formatDate(a.postedOn)} · closes {formatDate(a.closesOn)}</span>
              </div>
              {a.applicants > 0 && (
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to={`/staff/announcements/${a.id}`}><FileCheck2 className="h-4 w-4" /> Review {a.applicants} application{a.applicants !== 1 ? "s" : ""}</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function NewAnnouncementDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild><Button><Plus className="h-4 w-4" /> New announcement</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Post a new-site announcement</DialogTitle>
          <DialogDescription>This appears on the operator landing page for licensed operators to apply.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5"><Label>Site name</Label><Input placeholder="e.g. Grant Sawyer Annex Market" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Site type</Label>
              <Select><SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
                <SelectContent>{Object.entries(SITE_TYPE_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Closes on</Label><Input type="date" /></div>
          </div>
          <div className="space-y-1.5"><Label>Description</Label><Textarea placeholder="Describe the location and application requirements…" /></div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <DialogClose asChild><Button><Megaphone className="h-4 w-4" /> Post announcement</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
