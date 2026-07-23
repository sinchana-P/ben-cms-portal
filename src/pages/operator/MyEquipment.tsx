import { Link } from "react-router-dom";
import { useSession } from "@/context/session";
import { equipmentForSites, EQUIPMENT_STATUS_LABEL } from "@/data/equipment";
import { siteById } from "@/data/sites";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { Package, Wrench } from "lucide-react";

export default function MyEquipment() {
  const { persona } = useSession();
  const equip = equipmentForSites(persona.siteIds ?? []);

  return (
    <div>
      <PageHeader
        title="My equipment"
        description="Equipment at your sites. Spot a problem? Open a maintenance ticket and staff will manage the repair."
        actions={<Button asChild><Link to="/operator/new/maintenance-log"><Wrench className="h-4 w-4" /> Report an issue</Link></Button>}
      />
      {equip.length === 0 ? (
        <EmptyState icon={Package} title="No equipment on record" description="Equipment assigned to your sites will appear here." />
      ) : (
        <Card>
          <CardContent className="px-0 py-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Warranty</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {equip.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell><div className="font-medium">{e.name}</div><div className="text-xs text-muted-foreground">{e.tagId} · {e.manufacturer} {e.model}</div></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{siteById(e.siteId)?.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(e.warrantyUntil)}</TableCell>
                    <TableCell><StatusBadge state={e.status} label={EQUIPMENT_STATUS_LABEL[e.status]} /></TableCell>
                    <TableCell className="text-right"><Button asChild size="sm" variant="outline"><Link to="/operator/new/maintenance-log"><Wrench className="h-4 w-4" /> Report</Link></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
