import { Link, useNavigate } from "react-router-dom";
import { useSession } from "@/context/session";
import { PERSONAS, ROLE_LABEL } from "@/data/personas";
import { ANNOUNCEMENTS } from "@/data/announcements";
import { SITE_TYPE_LABEL } from "@/data/sites";
import { BenMark } from "@/components/app/BenMark";
import { ThemeControls } from "@/components/app/ThemeControls";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCurrency, formatDate, initials } from "@/lib/utils";
import type { Persona } from "@/types";
import {
  MapPin, CalendarClock, DollarSign, ArrowRight, ShieldCheck, KeyRound,
  FileText, Store, Building2, Megaphone,
} from "lucide-react";

export default function Landing() {
  const { setPersonaId } = useSession();
  const navigate = useNavigate();
  const open = ANNOUNCEMENTS.filter((a) => a.status === "open");
  const staff = PERSONAS.filter((p) => p.portal === "staff");
  const operators = PERSONAS.filter((p) => p.portal === "operator");

  const signIn = (p: Persona) => {
    setPersonaId(p.id);
    navigate(p.portal === "staff" ? "/staff" : "/operator");
  };

  return (
    <div className="app-canvas min-h-screen bg-background">
      {/* Public top bar */}
      <header className="sticky top-0 z-30 border-b bg-card/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <BenMark />
          <div className="flex items-center gap-2">
            <ThemeControls />
            <Button asChild size="sm"><a href="#signin">Sign in</a></Button>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border bg-card p-8 shadow-card sm:p-12 mt-8">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/12 via-transparent to-[hsl(var(--ben-highlight)/0.12)]" />
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-primary/10" />
          <div aria-hidden className="pointer-events-none absolute -right-6 -top-10 h-48 w-48 rounded-full border border-[hsl(var(--ben-highlight)/0.2)]" />
          <div className="relative max-w-2xl">
            <Badge variant="secondary" className="mb-3">Nevada DETR · Randolph-Sheppard Program</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">Business Enterprise of Nevada</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              The Case Management System for Nevada's blind-operator vending program — for operators, staff, and administrators.
              Open site opportunities are posted below.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button size="lg" asChild><a href="#opportunities"><Megaphone className="h-4 w-4" /> See site opportunities</a></Button>
              <Button size="lg" variant="outline" asChild><a href="#signin">Sign in <ArrowRight className="h-4 w-4" /></a></Button>
            </div>
          </div>
        </section>

        {/* Open announcements — public, no auth (RFP 2.6.1) */}
        <section id="opportunities" className="mt-12 scroll-mt-20">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Open site opportunities</h2>
              <p className="mt-1 text-sm text-muted-foreground">Posted by DETR staff. Licensed operators may apply after signing in.</p>
            </div>
            <Badge variant="secondary">{open.length} open</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {open.map((a) => (
              <Link key={a.id} to={`/opportunities/${a.id}`} className="group flex flex-col rounded-2xl border bg-card p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card-hover">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold group-hover:text-primary">{a.siteName}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{a.hostAgency}</p>
                  </div>
                  <Badge variant="secondary"><Store className="h-3 w-3" /> {SITE_TYPE_LABEL[a.siteType]}</Badge>
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{a.body}</p>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t pt-3 text-xs text-muted-foreground">
                  {a.county && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {a.county} County</span>}
                  {a.estimatedAnnual != null && <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> est. {formatCurrency(a.estimatedAnnual)}/yr</span>}
                  <span className="flex items-center gap-1"><CalendarClock className="h-3.5 w-3.5" /> apply by {formatDate(a.closesOn)}</span>
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">View details & apply <ArrowRight className="h-4 w-4" /></span>
              </Link>
            ))}
          </div>
        </section>

        {/* Sign in */}
        <section id="signin" className="mt-12 scroll-mt-20 rounded-2xl border bg-card p-6 shadow-card sm:p-8">
          <h2 className="text-2xl font-bold tracking-tight">Sign in</h2>
          <p className="mt-1 text-sm text-muted-foreground">Staff authenticate via DETR Active Directory SSO. Operators sign in with MFA + OTP. Choose an identity to preview the portal.</p>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5" /> Staff · AD SSO</div>
              <div className="grid gap-2 sm:grid-cols-2">
                {staff.map((p) => <SignInCard key={p.id} p={p} onClick={() => signIn(p)} />)}
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"><KeyRound className="h-3.5 w-3.5" /> Operators · MFA + OTP</div>
              <div className="grid gap-2 sm:grid-cols-2">
                {operators.map((p) => <SignInCard key={p.id} p={p} onClick={() => signIn(p)} />)}
              </div>
            </div>
          </div>
        </section>

        {/* What it does */}
        <section className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Store, title: "Operator portal", body: "Accessible, dark-theme, keyboard-first. Submit P&L, request purchases, open equipment tickets, apply to new sites." },
            { icon: Building2, title: "Staff portal", body: "Scoped queues, two-tier approvals, equipment & tickets, Sortly import, fiscal reports across three calendars." },
            { icon: FileText, title: "Administration", body: "Sites, operators, roles, form & workflow config, notifications, branding & 7-slot theme." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border bg-card p-5 shadow-card">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><f.icon className="h-5 w-5" /></div>
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground sm:px-6">
          Nevada DETR · Bureau of Services to the Blind & Visually Impaired · Business Enterprise of Nevada · UI prototype (RFP 90DETR-S3794)
        </div>
      </footer>
    </div>
  );
}

function SignInCard({ p, onClick }: { p: Persona; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-3 rounded-xl border bg-background p-3 text-left transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <Avatar className="h-9 w-9"><AvatarFallback>{initials(p.name)}</AvatarFallback></Avatar>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">{p.name}</div>
        <div className="truncate text-xs text-muted-foreground">{ROLE_LABEL[p.role]} · {p.authMethod.includes("SSO") ? "SSO" : "MFA"}</div>
      </div>
    </button>
  );
}
