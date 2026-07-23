import { useParams, useNavigate, Link } from "react-router-dom";
import { announcementById } from "@/data/announcements";
import { SITE_TYPE_LABEL } from "@/data/sites";
import { BenMark } from "@/components/app/BenMark";
import { ThemeControls } from "@/components/app/ThemeControls";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  ArrowLeft, MapPin, CalendarClock, DollarSign, Store, Building2, FileText, LogIn, CheckCircle2,
} from "lucide-react";

export default function AnnouncementPublic() {
  const { id } = useParams();
  const navigate = useNavigate();
  const a = announcementById(id ?? "");

  if (!a) {
    return (
      <div className="app-canvas min-h-screen bg-background p-8">
        <Button variant="ghost" onClick={() => navigate("/")}><ArrowLeft className="h-4 w-4" /> Back</Button>
        <p className="mt-6 text-muted-foreground">Announcement not found.</p>
      </div>
    );
  }

  return (
    <div className="app-canvas min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link to="/"><BenMark /></Link>
          <div className="flex items-center gap-2">
            <ThemeControls />
            <Button asChild size="sm"><Link to="/#signin"><LogIn className="h-4 w-4" /> Sign in</Link></Button>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="mb-3 -ml-2"><ArrowLeft className="h-4 w-4" /> All opportunities</Button>

        <div className="rounded-2xl border bg-card p-8 shadow-card">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Badge variant="secondary" className="mb-2"><Store className="h-3 w-3" /> {SITE_TYPE_LABEL[a.siteType]}</Badge>
              <h1 className="text-3xl font-bold tracking-tight">{a.siteName}</h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><Building2 className="h-4 w-4" /> {a.hostAgency}</p>
            </div>
            <Badge variant="success">Open · apply by {formatDate(a.closesOn)}</Badge>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {a.county && <Fact icon={MapPin} label="County" value={`${a.county} County`} />}
            {a.estimatedAnnual != null && <Fact icon={DollarSign} label="Est. annual" value={`${formatCurrency(a.estimatedAnnual)}/yr`} />}
            <Fact icon={CalendarClock} label="Application deadline" value={formatDate(a.closesOn)} />
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">About this opportunity</h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">{a.body}</p>
          </div>

          <Card className="mt-6 border-primary/25 bg-primary/[0.03]">
            <CardContent className="py-5">
              <h2 className="flex items-center gap-2 text-sm font-semibold"><FileText className="h-4 w-4 text-primary" /> To apply, you'll need</h2>
              <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                {["A business plan for the site", "Your current resume", "Two letters of recommendation"].map((r) => (
                  <li key={r} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /> {r}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">Applications are reviewed on merit by DETR staff — there is no automated scoring or public ranking.</p>
            </CardContent>
          </Card>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button size="lg" asChild><Link to="/#signin"><LogIn className="h-4 w-4" /> Sign in to apply</Link></Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/")}>Back to opportunities</Button>
          </div>
        </div>
      </main>
    </div>
  );
}

function Fact({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-background p-3">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground"><Icon className="h-3.5 w-3.5" /> {label}</div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}
