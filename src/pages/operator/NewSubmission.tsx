import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSession } from "@/context/session";
import { BEN_FORMS, formById } from "@/data/forms";
import { equipmentForSites } from "@/data/equipment";
import { siteById, SITE_TYPE_LABEL } from "@/data/sites";
import { PageHeader } from "@/components/shared/PageHeader";
import { FormRenderer } from "@/components/shared/FormRenderer";
import { ApprovalChain } from "@/components/shared/ApprovalTimeline";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, Send, CheckCircle2, FileText, MapPin, ArrowRight,
  DollarSign, ClipboardList, Package, HeartPulse, ClipboardCheck,
} from "lucide-react";

const CATEGORY_STYLE: Record<string, { icon: any; chip: string }> = {
  financial: { icon: DollarSign, chip: "text-success bg-success-soft" },
  operational: { icon: ClipboardList, chip: "text-info bg-info-soft" },
  equipment: { icon: Package, chip: "text-warning bg-warning-soft" },
  insurance: { icon: HeartPulse, chip: "text-[hsl(var(--ben-auxiliary))] bg-[hsl(var(--ben-auxiliary)/0.12)]" },
  review: { icon: ClipboardCheck, chip: "text-primary bg-primary/10" },
};

export default function NewSubmission() {
  const { formId } = useParams();
  const { persona } = useSession();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [siteId, setSiteId] = useState<string>(persona.siteIds?.[0] ?? "");

  // Operator-initiated forms only
  const available = BEN_FORMS.filter((f) => f.initiatedBy === "operator");
  const form = formId ? formById(formId) : undefined;

  if (!form) {
    return (
      <div>
        <PageHeader eyebrow="Operator Portal" title="New submission" description="Choose a BEN form to complete. All forms are guided, validated, and screen-reader accessible." />
        <div className="grid gap-3 sm:grid-cols-2">
          {available.map((f) => {
            const cs = CATEGORY_STYLE[f.category] ?? CATEGORY_STYLE.review;
            const Icon = cs.icon;
            return (
              <Link key={f.id} to={`/operator/new/${f.id}`} className="group flex flex-col rounded-xl border bg-card p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover">
                <div className="flex items-start gap-3">
                  <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", cs.chip)}><Icon className="h-5 w-5" /></span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold group-hover:text-primary">{f.title}</div>
                    <div className="text-xs text-muted-foreground">{f.code} · {f.frequency}</div>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{f.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl">
        <Card>
          <CardContent className="flex flex-col items-center py-10 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success"><CheckCircle2 className="h-7 w-7" /></div>
            <h2 className="text-xl font-bold">{form.title} submitted</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Your submission is now in the workflow. You'll be notified at each step.
            </p>
            <div className="my-5 w-full rounded-lg border bg-muted/30 p-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">What happens next</div>
              <ApprovalChain form={form} currentState="submitted" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/operator/submissions")}>View my submissions</Button>
              <Button onClick={() => { setSubmitted(false); navigate("/operator/new"); }}>File another</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // equipment options for maintenance-log
  const equipOptions: Record<string, string[]> = form.id === "maintenance-log"
    ? { equipment: equipmentForSites(persona.siteIds ?? []).map((e) => `${e.name} (${e.tagId})`) }
    : {};

  // P&L is per-site — set-aside uses THIS site's configured rate (not a flat program rate)
  const siteScoped = form.id === "pnl" || form.id === "throw-log";
  const activeSite = siteById(siteId);
  const setAsideRate = (activeSite?.setAsidePct ?? 6.5) / 100;

  // Seed the P&L with the site's realistic monthly figures so the calculation
  // (totals → net profit → set-aside) is visible immediately; operator edits with actuals.
  const prefill: Record<string, string | number | boolean> = ((): Record<string, string | number | boolean> => {
    if (form.id === "pnl" && activeSite) {
      const g = activeSite.monthlyRevenue || 12000;
      const taxable = Math.round(g * 0.66);
      const nontax = Math.round(g * 0.22);
      return {
        period: "August 2026",
        rev_taxable: taxable, rev_nontaxable: nontax, rev_vending: g - taxable - nontax,
        exp_cogs: Math.round(g * 0.4), exp_operating: Math.round(g * 0.17), exp_payroll: Math.round(g * 0.1),
      };
    }
    if (form.id === "throw-log") return { period: "August 2026" };
    return {};
  })();
  const multiSite = (persona.siteIds ?? []).length > 1;

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2"><Link to="/operator/new"><ArrowLeft className="h-4 w-4" /> All forms</Link></Button>
      <PageHeader eyebrow={`${form.code} · ${form.frequency}`} title={form.title} description={form.description} />

      <div className="mb-4 rounded-lg border bg-muted/30 p-3">
        <ApprovalChain form={form} currentState="draft" />
      </div>

      {siteScoped && activeSite && (
        <Card className="mb-4">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {multiSite ? (
                <div className="flex items-center gap-2">
                  <Label htmlFor="site" className="text-muted-foreground">Site</Label>
                  <Select value={siteId} onValueChange={setSiteId}>
                    <SelectTrigger id="site" className="h-8 w-64"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(persona.siteIds ?? []).map((sid) => {
                        const s = siteById(sid);
                        return s ? <SelectItem key={sid} value={sid}>{s.name} ({s.benId})</SelectItem> : null;
                      })}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <span><span className="font-medium">{activeSite.name}</span> · {SITE_TYPE_LABEL[activeSite.type]}</span>
              )}
            </div>
            {form.id === "pnl" && (
              <span className="text-sm text-muted-foreground">Set-aside rate for this site: <span className="font-semibold text-primary">{activeSite.setAsidePct}%</span> of net profit</span>
            )}
          </CardContent>
        </Card>
      )}

      <FormRenderer key={`${form.id}-${siteId}`} form={form} initial={prefill} optionOverrides={equipOptions} setAsideRate={setAsideRate} />

      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate("/operator/new")}>Save draft</Button>
        <Button onClick={() => setSubmitted(true)}><Send className="h-4 w-4" /> Submit for review</Button>
      </div>
    </div>
  );
}
