import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSession } from "@/context/session";
import { BEN_FORMS, formById } from "@/data/forms";
import { equipmentForSites } from "@/data/equipment";
import { PageHeader } from "@/components/shared/PageHeader";
import { FormRenderer } from "@/components/shared/FormRenderer";
import { ApprovalChain } from "@/components/shared/ApprovalTimeline";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, CheckCircle2, FileText } from "lucide-react";

export default function NewSubmission() {
  const { formId } = useParams();
  const { persona } = useSession();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  // Operator-initiated forms only
  const available = BEN_FORMS.filter((f) => f.initiatedBy === "operator");
  const form = formId ? formById(formId) : undefined;

  if (!form) {
    return (
      <div>
        <PageHeader eyebrow="Operator Portal" title="New submission" description="Choose a BEN form to complete. All forms are guided, validated, and screen-reader accessible." />
        <div className="grid gap-3 sm:grid-cols-2">
          {available.map((f) => (
            <Link key={f.id} to={`/operator/new/${f.id}`} className="group rounded-lg border p-4 transition-colors hover:border-primary hover:bg-primary/[0.03]">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><FileText className="h-4 w-4" /></span>
                <div>
                  <div className="text-sm font-semibold group-hover:text-primary">{f.title}</div>
                  <div className="text-xs text-muted-foreground">{f.code} · {f.frequency}</div>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{f.description}</p>
            </Link>
          ))}
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

  const prefill: Record<string, string | number | boolean> =
    form.id === "pnl" || form.id === "throw-log" ? { period: "August 2026" } : {};

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-3 -ml-2"><Link to="/operator/new"><ArrowLeft className="h-4 w-4" /> All forms</Link></Button>
      <PageHeader eyebrow={`${form.code} · ${form.frequency}`} title={form.title} description={form.description} />

      <div className="mb-4 rounded-lg border bg-muted/30 p-3">
        <ApprovalChain form={form} currentState="draft" />
      </div>

      <FormRenderer form={form} initial={prefill} optionOverrides={equipOptions} />

      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate("/operator/new")}>Save draft</Button>
        <Button onClick={() => setSubmitted(true)}><Send className="h-4 w-4" /> Submit for review</Button>
      </div>
    </div>
  );
}
