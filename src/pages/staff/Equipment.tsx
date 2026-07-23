import { useState } from "react";
import { Link } from "react-router-dom";
import { EQUIPMENT, EQUIPMENT_STATUS_LABEL } from "@/data/equipment";
import { siteById } from "@/data/sites";
import { operatorById } from "@/data/operators";
import { TICKETS } from "@/data/tickets";
import type { Equipment as Eq } from "@/types";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate } from "@/lib/utils";
import { UploadCloud, ImageIcon, MapPin, History, Wrench, Package } from "lucide-react";

export default function Equipment() {
  const [siteFilter, setSiteFilter] = useState("all");
  const [selected, setSelected] = useState<Eq | null>(null);

  const rows = EQUIPMENT.filter((e) => siteFilter === "all" || e.siteId === siteFilter);
  const siteOptions = Array.from(new Set(EQUIPMENT.map((e) => e.siteId)));

  return (
    <div>
      <PageHeader
        title="Equipment Inventory"
        description="Full asset register — 1,035 items migrated from Sortly. Each item links to its site, assigned operator, warranty, photos, and location history."
        actions={<ImportDialog />}
      />

      <div className="mb-4 flex items-center justify-between">
        <Badge variant="secondary">{EQUIPMENT.length} shown · 1,035 total</Badge>
        <Select value={siteFilter} onValueChange={setSiteFilter}>
          <SelectTrigger className="w-56"><SelectValue placeholder="All sites" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sites</SelectItem>
            {siteOptions.map((s) => <SelectItem key={s} value={s}>{siteById(s)?.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tag / Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Site · Operator</TableHead>
                <TableHead>Warranty</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((e) => (
                <TableRow key={e.id} className="cursor-pointer" onClick={() => setSelected(e)}>
                  <TableCell>
                    <div className="flex items-center gap-2 font-medium">
                      {e.hasPhoto ? <ImageIcon className="h-4 w-4 text-muted-foreground" /> : <Package className="h-4 w-4 text-muted-foreground" />}
                      {e.name}
                    </div>
                    <div className="text-xs text-muted-foreground">{e.tagId} · {e.manufacturer} {e.model}</div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{e.category}</TableCell>
                  <TableCell className="text-sm">
                    <Link to={`/staff/sites/${e.siteId}`} className="font-medium hover:text-primary" onClick={(ev) => ev.stopPropagation()}>{siteById(e.siteId)?.name}</Link>
                    <div className="text-xs text-muted-foreground">{operatorById(e.operatorId)?.name}</div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(e.warrantyUntil)}</TableCell>
                  <TableCell><StatusBadge state={e.status} label={EQUIPMENT_STATUS_LABEL[e.status]} /></TableCell>
                  <TableCell className="text-right tabular-nums">{formatCurrency(e.price)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          {selected && <EquipmentDetail e={selected} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function EquipmentDetail({ e }: { e: Eq }) {
  const tickets = TICKETS.filter((t) => t.equipmentId === e.id);
  return (
    <>
      <SheetHeader>
        <SheetTitle>{e.name}</SheetTitle>
        <SheetDescription>{e.tagId} · {e.manufacturer} {e.model}</SheetDescription>
      </SheetHeader>
      <div className="space-y-5 p-6 pt-2">
        <div className="flex aspect-video items-center justify-center rounded-lg border bg-muted/50 text-muted-foreground">
          <div className="flex flex-col items-center gap-1 text-xs"><ImageIcon className="h-6 w-6" /> {e.hasPhoto ? "Equipment photo" : "No photo on file"}</div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Spec label="Serial" value={e.serial} />
          <Spec label="Category" value={e.category} />
          <Spec label="Purchased" value={formatDate(e.purchasedOn)} />
          <Spec label="Vendor" value={e.vendor} />
          <Spec label="Price / Invoice" value={formatCurrency(e.price)} />
          <Spec label="Warranty until" value={formatDate(e.warrantyUntil)} />
        </div>
        <Separator />
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold"><MapPin className="h-4 w-4" /> Current placement</div>
          <p className="text-sm text-muted-foreground">{siteById(e.siteId)?.name} · assigned to {operatorById(e.operatorId)?.name ?? "—"}</p>
        </div>
        <div>
          <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold"><History className="h-4 w-4" /> Location history</div>
          <ol className="space-y-1.5">
            {e.locationHistory.map((h, i) => (
              <li key={i} className="text-sm">
                <span className="font-medium">{siteById(h.siteId)?.name}</span>
                <span className="text-muted-foreground"> · {formatDate(h.movedOn)} · {h.reason}</span>
              </li>
            ))}
          </ol>
        </div>
        {tickets.length > 0 && (
          <div>
            <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold"><Wrench className="h-4 w-4" /> Maintenance history</div>
            {tickets.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-md border p-2.5 text-sm">
                <span>{t.summary}</span><StatusBadge state={t.state} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return <div><div className="text-xs text-muted-foreground">{label}</div><div className="font-medium">{value}</div></div>;
}

function ImportDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild><Button variant="outline"><UploadCloud className="h-4 w-4" /> Import from Sortly</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk import equipment</DialogTitle>
          <DialogDescription>Map a Sortly CSV export to the equipment schema. Photos import alongside records.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-8 text-sm text-muted-foreground">
            <UploadCloud className="h-7 w-7" />
            Drop <span className="font-medium text-foreground">sortly-export.csv</span> here, or click to browse
          </div>
          <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
            Detected 1,035 rows · columns auto-mapped: <span className="font-medium text-foreground">manufacturer, make, model, tag ID, serial, purchase date, price, site, photos</span>. Review mappings before import.
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <DialogClose asChild><Button>Review &amp; import 1,035 items</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
