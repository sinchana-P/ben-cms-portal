import { useState } from "react";
import { REPORTS, FISCAL_LABEL } from "@/data/reports";
import type { FiscalCalendar, ReportDef } from "@/types";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, Legend,
} from "recharts";
import { FileText, FileSpreadsheet, Calendar, Building2, Store } from "lucide-react";

const SFY = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const FFY = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"];
const CY = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function seriesFor(cal: FiscalCalendar) {
  const months = cal === "SFY" ? SFY : cal === "FFY" ? FFY : CY;
  return months.map((m, i) => ({
    month: m,
    revenue: 42000 + Math.round(Math.sin(i / 2) * 9000) + i * 400,
    setAside: 1200 + Math.round(Math.cos(i / 2) * 300) + i * 12,
  }));
}

export default function Reports() {
  const [active, setActive] = useState<ReportDef>(REPORTS[0]);
  const [cal, setCal] = useState<FiscalCalendar>("SFY");
  const [scope, setScope] = useState<"program" | "per_site">("program");
  const [flash, setFlash] = useState<string | null>(null);
  const data = seriesFor(cal);

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Report builder with export to PDF & Excel. Fiscal-calendar reporting across State FY, Federal FY, and Calendar Year — per site and program-wide."
      />

      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        {/* Report list */}
        <div className="space-y-1.5">
          {REPORTS.map((r) => (
            <button
              key={r.id}
              onClick={() => { setActive(r); setCal(r.calendars[0]); }}
              className={`w-full rounded-lg border p-3 text-left transition-colors ${active.id === r.id ? "border-primary bg-primary/5" : "hover:bg-accent"}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{r.name}</span>
                {r.id === "r-rsa15" && <Badge variant="info">Federal</Badge>}
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">{r.category}</div>
            </button>
          ))}
        </div>

        {/* Viewer */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <CardTitle>{active.name}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">{active.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setFlash("Exported " + active.name + " to PDF")}><FileText className="h-4 w-4" /> PDF</Button>
                  <Button variant="outline" size="sm" onClick={() => setFlash("Exported " + active.name + " to Excel")}><FileSpreadsheet className="h-4 w-4" /> Excel</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Select value={cal} onValueChange={(v) => setCal(v as FiscalCalendar)}>
                  <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {active.calendars.map((c) => <SelectItem key={c} value={c}>{FISCAL_LABEL[c]}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="ml-auto inline-flex rounded-lg border bg-muted/60 p-0.5">
                  {([["program", "Program-wide", Building2], ["per_site", "Per site", Store]] as const).map(([k, label, Icon]) => (
                    <button key={k} onClick={() => setScope(k)}
                      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold ${scope === k ? "bg-background shadow-sm" : "text-muted-foreground"}`}>
                      <Icon className="h-3.5 w-3.5" /> {label}
                    </button>
                  ))}
                </div>
              </div>

              {flash && <div className="mb-3 rounded-md border border-success/30 bg-success-soft px-3 py-2 text-sm text-success" role="status">{flash}</div>}

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${v / 1000}k`} />
                    <RTooltip
                      contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                      formatter={(v: number) => `$${v.toLocaleString()}`}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="revenue" name="Revenue" fill="hsl(var(--primary))" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="setAside" name="Set-Aside" fill="hsl(var(--ben-highlight))" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {FISCAL_LABEL[cal]} · {scope === "program" ? "all 22 sites aggregated" : "broken down by site"} · {active.rfpRef}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
