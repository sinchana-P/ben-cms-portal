import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ArrowLeft, MapPin, Building2, Landmark, UserPlus, StickyNote, UploadCloud, Plus, AlertTriangle, Map, Check } from "lucide-react";

const OPERATORS = [
  { id: "op-maria", label: "Maria Delgado — 1 active site (can take 1 more)", full: false },
  { id: "op-priya", label: "Priya Nair — 2 active sites (MAX REACHED)", full: true },
  { id: "op-darnell", label: "Darnell Price — 1 active site (can take 1 more)", full: false },
  { id: "unassigned", label: "Leave unassigned (post as Open site)", full: false },
];

function Section({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <Card className="mb-4">
      <div className="flex items-center gap-2 border-b bg-muted/40 px-5 py-3 text-sm font-semibold" style={{ color: "hsl(var(--ben-subheading))" }}>
        <Icon className="h-4 w-4" /> {title}
      </div>
      <CardContent className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">{children}</CardContent>
    </Card>
  );
}
function G({ label, children, span, req, hint }: { label: string; children: React.ReactNode; span?: boolean; req?: boolean; hint?: string }) {
  return (
    <div className={span ? "space-y-1.5 sm:col-span-2" : "space-y-1.5"}>
      <Label>{label} {req && <span className="text-destructive">*</span>}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export default function AddSite() {
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [operatorFull, setOperatorFull] = useState(false);
  const isRoute = type === "vending_route";

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => navigate("/staff/sites")} className="mb-3 -ml-2"><ArrowLeft className="h-4 w-4" /> Back</Button>
      <PageHeader title="Add New Site" description="Register a new BEN vending location." actions={<Button onClick={() => navigate("/staff/sites")}><Check className="h-4 w-4" /> Save & Activate</Button>} />

      <Section icon={MapPin} title="Site Information">
        <G label="BEN Site ID" req><Input placeholder="e.g. BEN-023" /></G>
        <G label="Site Name" req><Input placeholder="e.g. DETR Reno Office Micro Market" /></G>
        <G label="Site Type" req hint="Currently: 9 Micro Markets · 7 Vending Routes · 4 Cafeterias · 2 Gift Shops">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger><SelectValue placeholder="Select type…" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="micro_market">Micro Market</SelectItem>
              <SelectItem value="vending_route">Vending Route</SelectItem>
              <SelectItem value="cafe">Cafeteria</SelectItem>
              <SelectItem value="gift_shop">Gift Shop</SelectItem>
            </SelectContent>
          </Select>
        </G>
        <G label="Date Established" req><Input type="date" /></G>
        <G label="Set-Aside % of Net Profits" req hint="Applied to net profits from approved P&L — not gross revenue.">
          <Input type="number" step="0.1" min={0} max={100} placeholder="e.g. 6.5" />
        </G>
        <G label="P&L Due Date" hint="Fixed: 20th of each month (program-wide rule)."><Input value="20th" readOnly /></G>
      </Section>

      {isRoute ? (
        <Section icon={Map} title="Vending Route Stops">
          <div className="sm:col-span-2 space-y-3">
            <p className="rounded-md bg-info-soft px-3 py-2 text-xs text-info">A vending route has machines across multiple buildings. Each stop is a separate physical location; equipment is assigned per stop.</p>
            {[1, 2].map((n) => (
              <div key={n} className="flex items-start gap-2">
                <span className="mt-2 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold">{n}</span>
                <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-3">
                  <Input placeholder="Building name" /><Input placeholder="Address" /><Input placeholder="County" />
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full border-dashed"><Plus className="h-4 w-4" /> Add another stop</Button>
          </div>
        </Section>
      ) : (
        <Section icon={Building2} title="Physical Location">
          <G label="Street Address" req span><Input placeholder="e.g. 500 E Third Street" /></G>
          <G label="City" req><Input /></G>
          <G label="County" req>
            <Select><SelectTrigger><SelectValue placeholder="Select county…" /></SelectTrigger>
              <SelectContent>{["Carson City", "Clark", "Douglas", "Elko", "Lyon", "Washoe", "White Pine"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </G>
          <G label="Building Name"><Input placeholder="e.g. DETR Main Building" /></G>
          <G label="Floor / Room"><Input placeholder="e.g. Ground Floor, Room 101" /></G>
        </Section>
      )}

      <Section icon={Landmark} title="Host Agency">
        <G label="Agency Name" req><Input placeholder="e.g. DETR" /></G>
        <G label="Agency Type">
          <Select><SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
            <SelectContent>{["State Agency", "Federal Building (GSA)", "County Government", "City Government"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </G>
        <G label="Contact Name"><Input /></G>
        <G label="Contact Email"><Input type="email" /></G>
        <G label="Contract Start"><Input type="date" /></G>
        <G label="Contract Expiry"><Input type="date" /></G>
        <G label="Upload Host Agency Contract" span>
          <div className="flex items-center gap-2 rounded-md border border-dashed px-3 py-3 text-sm text-muted-foreground"><UploadCloud className="h-4 w-4" /> Click to upload contract PDF — max 25 MB</div>
        </G>
      </Section>

      <Section icon={UserPlus} title="Assign Operator">
        <G label="Primary Operator">
          <Select onValueChange={(v) => setOperatorFull(OPERATORS.find((o) => o.id === v)?.full ?? false)}>
            <SelectTrigger><SelectValue placeholder="Select operator…" /></SelectTrigger>
            <SelectContent>{OPERATORS.map((o) => <SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>)}</SelectContent>
          </Select>
          {operatorFull && (
            <p className="mt-1 flex items-start gap-1.5 rounded-md border border-warning/30 bg-warning-soft px-3 py-2 text-xs text-warning">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" /> This operator already manages 2 sites — the program maximum. Choose a different operator or reassign one of their sites first.
            </p>
          )}
        </G>
        <G label="Operator Status at this Site" hint="Interim operators (12–18 mo) are under close BEO supervision; P&L submissions get extra review.">
          <Select><SelectTrigger><SelectValue placeholder="Select…" /></SelectTrigger>
            <SelectContent><SelectItem value="licensed">Licensed Operator</SelectItem><SelectItem value="interim">Interim Operator</SelectItem></SelectContent>
          </Select>
        </G>
      </Section>

      <Section icon={StickyNote} title="Internal Notes">
        <G label="Notes (staff only)" span><Textarea placeholder="Any internal context about this site…" /></G>
      </Section>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate("/staff/sites")}>Cancel</Button>
        <Button disabled={operatorFull} onClick={() => navigate("/staff/sites")}><Check className="h-4 w-4" /> Save & Activate Site</Button>
      </div>
    </div>
  );
}
