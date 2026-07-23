import { useSession } from "@/context/session";
import { siteById, SITE_TYPE_LABEL } from "@/data/sites";
import { equipmentForSites } from "@/data/equipment";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { MapPin, Building2, Package, FileCheck2 } from "lucide-react";

export default function MySites() {
  const { persona } = useSession();
  const sites = (persona.siteIds ?? []).map((s) => siteById(s)).filter(Boolean);

  return (
    <div>
      <PageHeader title="My sites" description="The locations you operate. Each may hold up to two per operator." />
      <div className="grid gap-4 sm:grid-cols-2">
        {sites.map((s) => s && (
          <Card key={s.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{s.name}</CardTitle>
                <StatusBadge state={s.status} />
              </div>
              <Badge variant="secondary" className="w-fit">{SITE_TYPE_LABEL[s.type]}</Badge>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Building2 className="h-4 w-4" /> {s.hostAgency}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="h-4 w-4" /> {s.address}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Package className="h-4 w-4" /> {equipmentForSites([s.id]).length} equipment items</div>
              <div className="flex items-center gap-2 text-muted-foreground"><FileCheck2 className="h-4 w-4" /> Host-agency contract on file</div>
              <div className="flex justify-between border-t pt-2"><span className="text-muted-foreground">Monthly revenue</span><span className="font-semibold tabular-nums">{formatCurrency(s.monthlyRevenue)}</span></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
