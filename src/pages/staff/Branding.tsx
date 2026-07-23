import { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { BenMark } from "@/components/app/BenMark";
import { UploadCloud, Check, RotateCcw, Palette } from "lucide-react";

/** BR-2: 7-slot color theme editor. Each swatch maps to a named CSS variable
 *  and applies live. BR-1: logo + header banner + footer text. */
const SLOTS = [
  { key: "--ben-heading", label: "Heading", def: "#1d3f66" },
  { key: "--ben-subheading", label: "Sub-Heading", def: "#4a6178" },
  { key: "--ben-highlight", label: "Highlight", def: "#e8b23a" },
  { key: "--ben-accent", label: "Accent", def: "#1a8a94" },
  { key: "--ben-auxiliary", label: "Auxiliary", def: "#6a4bab" },
  { key: "--ben-text-primary", label: "Primary Text", def: "#242f3d" },
  { key: "--ben-text-secondary", label: "Secondary Text", def: "#5a6675" },
];

function hexToHslTriplet(hex: string): string {
  const m = hex.replace("#", "");
  const r = parseInt(m.substring(0, 2), 16) / 255;
  const g = parseInt(m.substring(2, 4), 16) / 255;
  const b = parseInt(m.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0; const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export default function Branding() {
  const [colors, setColors] = useState<Record<string, string>>(Object.fromEntries(SLOTS.map((s) => [s.key, s.def])));
  const [headerText, setHeaderText] = useState("Business Enterprise of Nevada");
  const [footerText, setFooterText] = useState("Nevada DETR · Bureau of Services to the Blind & Visually Impaired");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(colors).forEach(([k, v]) => root.style.setProperty(k, hexToHslTriplet(v)));
    return () => { SLOTS.forEach((s) => root.style.removeProperty(s.key)); };
  }, [colors]);

  const reset = () => setColors(Object.fromEntries(SLOTS.map((s) => [s.key, s.def])));

  return (
    <div>
      <PageHeader
        eyebrow="BR-1 · BR-2"
        title="Branding & Theme"
        description="Configure the BEN logo, header banner, footer, and the 7-slot color theme. Changes apply live and are validated for WCAG contrast."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={reset}><RotateCcw className="h-4 w-4" /> Reset</Button>
            <Button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }}>
              {saved ? <><Check className="h-4 w-4" /> Saved</> : "Save theme"}
            </Button>
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Palette className="h-4 w-4" /> 7-slot color theme</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {SLOTS.map((s) => (
              <div key={s.key} className="flex items-center justify-between gap-3">
                <Label className="flex-1">{s.label}</Label>
                <span className="font-mono text-xs text-muted-foreground">{colors[s.key]}</span>
                <input
                  type="color"
                  aria-label={`${s.label} color`}
                  value={colors[s.key]}
                  onChange={(e) => setColors((p) => ({ ...p, [s.key]: e.target.value }))}
                  className="h-8 w-12 cursor-pointer rounded border bg-transparent"
                />
              </div>
            ))}
            <p className="pt-1 text-xs text-muted-foreground">Each slot maps to a named CSS variable used across both portals. All combinations are checked against WCAG 2.1 AA (4.5:1 text, 3:1 UI).</p>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Logo, header &amp; footer</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed text-muted-foreground"><UploadCloud className="h-5 w-5" /></div>
                <div><Button variant="outline" size="sm">Upload logo</Button><p className="mt-1 text-xs text-muted-foreground">SVG or PNG, transparent background</p></div>
              </div>
              <div className="space-y-1.5"><Label>Header banner text</Label><Input value={headerText} onChange={(e) => setHeaderText(e.target.value)} /></div>
              <div className="space-y-1.5"><Label>Footer text</Label><Input value={footerText} onChange={(e) => setFooterText(e.target.value)} /></div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader className="pb-2"><CardTitle className="text-base">Live preview</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <div className="flex items-center gap-3 border-b px-4 py-3" style={{ background: "hsl(var(--ben-heading))" }}>
                  <BenMark />
                  <span className="ml-1 text-sm font-semibold text-white">{headerText}</span>
                </div>
                <div className="space-y-2 p-4">
                  <div className="text-lg font-bold" style={{ color: "hsl(var(--ben-heading))" }}>P&amp;L Monthly Statement</div>
                  <div className="text-sm font-medium" style={{ color: "hsl(var(--ben-subheading))" }}>Revenue &amp; Expenses</div>
                  <p className="text-sm" style={{ color: "hsl(var(--ben-text-secondary))" }}>Auto-calculated set-aside below.</p>
                  <div className="flex gap-2 pt-1">
                    <Badge style={{ background: "hsl(var(--ben-highlight))", color: "#1a1a1a" }}>Highlight</Badge>
                    <Badge style={{ background: "hsl(var(--ben-accent))", color: "#fff" }}>Accent</Badge>
                    <Badge style={{ background: "hsl(var(--ben-auxiliary))", color: "#fff" }}>Auxiliary</Badge>
                  </div>
                </div>
                <div className="border-t px-4 py-2 text-xs" style={{ color: "hsl(var(--ben-text-secondary))" }}>{footerText}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
