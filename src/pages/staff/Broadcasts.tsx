import { useState } from "react";
import { PROGRAM_STATS } from "@/data/sites";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { formatDateTime } from "@/lib/utils";
import { Megaphone, Send, Mail, Bell, CheckCircle2 } from "lucide-react";

const AUDIENCES: Record<string, { label: string; count: number }> = {
  all: { label: "All operators", count: PROGRAM_STATS.activeOperators },
  cafe: { label: "Café operators", count: PROGRAM_STATS.cafes },
  micro_market: { label: "Micro market operators", count: PROGRAM_STATS.microMarkets },
  vending_route: { label: "Vending route operators", count: PROGRAM_STATS.vendingRoutes },
  gift_shop: { label: "Gift shop operators", count: PROGRAM_STATS.giftShops },
};

const SENT = [
  { id: "B-31", subject: "Reminder: August P&L due the 20th", audience: "All operators", channels: "Email · In-app", at: "2026-08-14T08:00:00", recipients: 18 },
  { id: "B-30", subject: "New micro market available — Reno Federal Building", audience: "All operators", channels: "Email · In-app", at: "2026-07-15T09:30:00", recipients: 18 },
  { id: "B-29", subject: "Set-aside policy update effective SFY 2027", audience: "All operators", channels: "Email", at: "2026-07-01T10:00:00", recipients: 18 },
];

export default function Broadcasts() {
  const [audience, setAudience] = useState("all");
  const [email, setEmail] = useState(true);
  const [inApp, setInApp] = useState(true);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [flash, setFlash] = useState<string | null>(null);

  const recipients = AUDIENCES[audience].count;
  const canSend = subject.trim() && body.trim() && (email || inApp);

  return (
    <div>
      <PageHeader
        eyebrow="Bulk communications · Q179"
        title="Broadcasts"
        description="Send a program announcement — a deadline reminder, a policy change — to many operators at once. Email and in-app are the RFP-minimum channels."
      />

      {flash && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-success/30 bg-success-soft px-4 py-2.5 text-sm font-medium text-success" role="status">
          <CheckCircle2 className="h-4 w-4" /> {flash}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Megaphone className="h-4 w-4" /> Compose broadcast</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(AUDIENCES).map(([k, v]) => <SelectItem key={k} value={k}>{v.label} ({v.count})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Subject</Label><Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Reminder: August P&L due the 20th" /></div>
            <div className="space-y-1.5"><Label>Message</Label><Textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} placeholder="Write your message to operators…" /></div>
            <div className="space-y-2">
              <Label>Channels</Label>
              <label className="flex items-center gap-2 text-sm"><Checkbox checked={email} onCheckedChange={(v) => setEmail(!!v)} /> <Mail className="h-4 w-4 text-muted-foreground" /> Email</label>
              <label className="flex items-center gap-2 text-sm"><Checkbox checked={inApp} onCheckedChange={(v) => setInApp(!!v)} /> <Bell className="h-4 w-4 text-muted-foreground" /> In-app notification</label>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-sm text-muted-foreground">Will reach <span className="font-semibold text-foreground">{recipients} operators</span></span>
              <Button disabled={!canSend} onClick={() => { setFlash(`Broadcast sent to ${recipients} operators via ${[email && "email", inApp && "in-app"].filter(Boolean).join(" + ")}.`); setSubject(""); setBody(""); }}>
                <Send className="h-4 w-4" /> Send broadcast
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Recent broadcasts</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {SENT.map((b) => (
              <div key={b.id} className="rounded-lg border p-3">
                <div className="text-sm font-medium">{b.subject}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{b.audience} · {b.recipients} recipients · {b.channels}</div>
                <div className="text-xs text-muted-foreground">{formatDateTime(b.at)}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
