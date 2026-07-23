import { useState } from "react";
import { SITES, SITE_TYPE_LABEL, PROGRAM_STATS } from "@/data/sites";
import { operatorById } from "@/data/operators";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { Coffee, Gift, ShoppingCart, Truck, FileCheck2, FileX2 } from "lucide-react";

const TYPE_ICON = { cafe: Coffee, gift_shop: Gift, micro_market: ShoppingCart, vending_route: Truck };

export default function Sites() {
  const [type, setType] = useState("all");
  const rows = SITES.filter((s) => type === "all" || s.type === type);

  return (
    <div>
      <PageHeader title="Sites & Locations" description="Vending facilities across Nevada public buildings. Host-agency contracts stored per site." />

      <div className="mb-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Cafés" value={PROGRAM_STATS.cafes} icon={Coffee} />
        <StatCard label="Gift Shops" value={PROGRAM_STATS.giftShops} icon={Gift} tone="info" />
        <StatCard label="Micro Markets" value={PROGRAM_STATS.microMarkets} icon={ShoppingCart} />
        <StatCard label="Vending Routes" value={PROGRAM_STATS.vendingRoutes} icon={Truck} tone="warning" />
      </div>

      <div className="mb-4 flex justify-end">
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All site types</SelectItem>
            {Object.entries(SITE_TYPE_LABEL).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="px-0 py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Site</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Host Agency</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Contract</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Monthly Rev.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((s) => {
                const Icon = TYPE_ICON[s.type];
                return (
                  <TableRow key={s.id}>
                    <TableCell><div className="font-medium">{s.name}</div><div className="text-xs text-muted-foreground">{s.code} · {s.address}</div></TableCell>
                    <TableCell><Badge variant="secondary"><Icon className="h-3 w-3" /> {SITE_TYPE_LABEL[s.type]}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{s.hostAgency}</TableCell>
                    <TableCell className="text-sm">{operatorById(s.operatorId)?.name ?? <span className="text-muted-foreground">Unassigned</span>}</TableCell>
                    <TableCell>
                      {s.contractOnFile
                        ? <span className="flex items-center gap-1 text-xs text-success"><FileCheck2 className="h-3.5 w-3.5" /> On file</span>
                        : <span className="flex items-center gap-1 text-xs text-warning"><FileX2 className="h-3.5 w-3.5" /> Pending</span>}
                    </TableCell>
                    <TableCell><StatusBadge state={s.status} /></TableCell>
                    <TableCell className="text-right tabular-nums">{s.monthlyRevenue ? formatCurrency(s.monthlyRevenue) : "—"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
