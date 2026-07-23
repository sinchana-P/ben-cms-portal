import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { siteById } from "@/data/sites";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, Check, FileSignature, PackageX, DoorClosed, Archive } from "lucide-react";

const STEPS = [
  { icon: FileSignature, title: "Closing agreement", desc: "Execute the site-closure agreement with the host agency and settle the final P&L / set-aside." },
  { icon: PackageX, title: "Equipment removal", desc: "Relocate each asset to another site or retire it — every move is recorded in equipment location history." },
  { icon: DoorClosed, title: "Facility vacation", desc: "Confirm the operator has vacated and the host agency has signed off on the space." },
  { icon: Archive, title: "Permanent archive", desc: "Archive the site and its 13-year record as read-only. Operator's portal access to this site is removed." },
];

export default function SiteClosure() {
  const { id } = useParams();
  const navigate = useNavigate();
  const site = siteById(id ?? "");
  const [step, setStep] = useState(0);
  const done = step >= STEPS.length;

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => navigate(`/staff/sites/${id}`)} className="mb-3 -ml-2"><ArrowLeft className="h-4 w-4" /> Back to site</Button>
      <PageHeader
        eyebrow="Site closure workflow"
        title={`Close ${site?.name ?? "site"}`}
        description="A formal, auditable closure — each step is logged. The site record is never deleted, only archived."
      />

      <Card className="max-w-2xl">
        <CardContent className="py-6">
          {done ? (
            <div className="flex flex-col items-center py-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success-soft text-success"><Archive className="h-6 w-6" /></div>
              <h2 className="text-lg font-bold">{site?.name} archived</h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">The site and its full history are preserved as a read-only archive. Closure logged to the audit trail.</p>
              <Button className="mt-5" onClick={() => navigate("/staff/sites")}>Back to Sites</Button>
            </div>
          ) : (
            <ol className="space-y-0">
              {STEPS.map((s, i) => {
                const complete = i < step;
                const active = i === step;
                return (
                  <li key={i} className="flex gap-4 pb-6 last:pb-0">
                    <div className="flex flex-col items-center">
                      <span className={cn("flex h-10 w-10 items-center justify-center rounded-full",
                        complete ? "bg-success text-white" : active ? "bg-primary text-primary-foreground" : "border-2 border-border bg-muted text-muted-foreground")}>
                        {complete ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                      </span>
                      {i < STEPS.length - 1 && <span className={cn("mt-1 w-0.5 flex-1", complete ? "bg-success" : "bg-border")} />}
                    </div>
                    <div className="flex-1 pt-1.5">
                      <div className="text-sm font-semibold">{s.title}</div>
                      <p className="mt-0.5 text-sm text-muted-foreground">{s.desc}</p>
                      {active && (
                        <Button size="sm" className="mt-3" onClick={() => setStep(step + 1)}>
                          {i === STEPS.length - 1 ? "Archive site" : "Complete & continue"}
                        </Button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
