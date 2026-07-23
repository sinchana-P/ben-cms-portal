import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSession } from "@/context/session";
import { ANNOUNCEMENTS } from "@/data/announcements";
import { SITE_TYPE_LABEL } from "@/data/sites";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, UploadCloud, Check, CheckCircle2, Info } from "lucide-react";

const STEPS = ["Site Details", "Business Plan", "Documents", "Review & Submit"];
const DOCS = ["Business plan", "Resume", "Letters of recommendation"];

export default function ApplyNewSite() {
  const { announcementId } = useParams();
  const { persona } = useSession();
  const navigate = useNavigate();
  const ann = ANNOUNCEMENTS.find((a) => a.id === announcementId) ?? ANNOUNCEMENTS.find((a) => a.status === "open");
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const atMax = (persona.siteIds ?? []).length >= 2;

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl">
        <Card><CardContent className="flex flex-col items-center py-10 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success"><CheckCircle2 className="h-7 w-7" /></div>
          <h2 className="text-xl font-bold">Application submitted</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">Your application for <strong>{ann?.siteName}</strong> is in. Staff will review it — track its status any time under My Applications.</p>
          <div className="mt-5 flex gap-2">
            <Button variant="outline" onClick={() => navigate("/operator/announcements")}>Back to announcements</Button>
            <Button onClick={() => navigate("/operator/applications")}>Track my application</Button>
          </div>
        </CardContent></Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Button variant="ghost" size="sm" onClick={() => navigate("/operator/announcements")} className="mb-3 -ml-2"><ArrowLeft className="h-4 w-4" /> Announcements</Button>
      <PageHeader eyebrow="New-site application" title={`Apply — ${ann?.siteName ?? "New Site"}`} description={ann ? `${SITE_TYPE_LABEL[ann.siteType]} · ${ann.hostAgency}` : undefined} />

      {atMax && (
        <div className="mb-4 flex items-start gap-2 rounded-lg border border-warning/30 bg-warning-soft/50 px-4 py-2.5 text-sm text-warning">
          <Info className="mt-0.5 h-4 w-4 shrink-0" /> You already hold 2 sites (the program maximum). You may still apply, but you'd need to give up a site if awarded.
        </div>
      )}

      {/* Wizard steps */}
      <div className="mb-6 flex items-center">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2">
              <span className={cn("flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                i < step ? "bg-success text-white" : i === step ? "bg-primary text-primary-foreground" : "border-2 border-border bg-muted text-muted-foreground")}>
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <span className={cn("hidden text-xs font-semibold sm:block", i === step ? "text-primary" : i < step ? "text-success" : "text-muted-foreground")}>{label}</span>
            </div>
            {i < STEPS.length - 1 && <span className={cn("mx-2 h-0.5 flex-1", i < step ? "bg-success" : "bg-border")} />}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="space-y-4 py-5">
          {step === 0 && (
            <>
              <div className="space-y-1.5"><Label>Site of interest</Label><Input value={ann?.siteName ?? ""} readOnly /></div>
              <div className="space-y-1.5"><Label>Why are you interested in this site?</Label><Textarea placeholder="Tell us about your interest and relevant experience…" rows={4} /></div>
              <div className="space-y-1.5"><Label>Years of operating experience</Label><Input type="number" min={0} placeholder="e.g. 3" /></div>
            </>
          )}
          {step === 1 && (
            <>
              <div className="space-y-1.5"><Label>Business plan summary</Label><Textarea placeholder="Describe your plan for products, staffing, hours, and growth…" rows={5} /></div>
              <div className="space-y-1.5"><Label>Projected monthly revenue</Label><Input type="number" placeholder="$" /></div>
              <p className="rounded-md bg-info-soft px-3 py-2 text-xs text-info">Applications are reviewed on merit by staff — there is no automated scoring or public ranking.</p>
            </>
          )}
          {step === 2 && (
            <div className="space-y-3">
              {DOCS.map((d) => (
                <div key={d} className="space-y-1.5">
                  <Label>{d}</Label>
                  <div className="flex items-center gap-2 rounded-md border border-dashed px-3 py-3 text-sm text-muted-foreground"><UploadCloud className="h-4 w-4" /> Upload {d.toLowerCase()}</div>
                </div>
              ))}
            </div>
          )}
          {step === 3 && (
            <div className="space-y-3 text-sm">
              <div className="rounded-lg border p-4">
                <div className="mb-2 font-semibold">Review your application</div>
                <ul className="space-y-1.5 text-muted-foreground">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> Site: {ann?.siteName}</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> Interest statement provided</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> Business plan attached</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-success" /> 3 documents uploaded</li>
                </ul>
              </div>
              <p className="text-muted-foreground">Submitting sends your application into the pipeline: Submitted → BEO Review → Chief Interview → Decision → Assignment.</p>
            </div>
          )}

          <div className="flex justify-between pt-2">
            <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep(step + 1)}>Continue <ArrowRight className="h-4 w-4" /></Button>
            ) : (
              <Button onClick={() => setSubmitted(true)}><Check className="h-4 w-4" /> Submit application</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
