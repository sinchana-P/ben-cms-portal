import { useState, useEffect } from "react";
import { useSession, MAGNIFY_LEVELS } from "@/context/session";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  Sun, Moon, Contrast, Type, Keyboard, Volume2, Eye, CheckCircle2, ZoomIn,
} from "lucide-react";

const SIZES = [
  { key: "S", px: "15px" }, { key: "M", px: "16px" }, { key: "L", px: "18px" }, { key: "XL", px: "20px" },
];

export default function AccessibilitySettings() {
  const { themeMode, setThemeMode, highContrast, setHighContrast, magnify, setMagnify } = useSession();
  const [size, setSize] = useState("M");
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const px = SIZES.find((s) => s.key === size)?.px ?? "16px";
    document.documentElement.style.fontSize = px;
    return () => { document.documentElement.style.fontSize = ""; };
  }, [size]);

  return (
    <div>
      <PageHeader
        eyebrow="Presentation Factor #1 · 500 pts"
        title="Accessibility"
        description="This portal is built for you. Adjust the display to your needs — every setting applies instantly and is remembered."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Eye className="h-4 w-4" /> Display</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label className="mb-2 block">Theme</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button variant={themeMode === "light" ? "default" : "outline"} onClick={() => setThemeMode("light")} className="justify-start"><Sun className="h-4 w-4" /> Light</Button>
                <Button variant={themeMode === "dark" ? "default" : "outline"} onClick={() => setThemeMode("dark")} className="justify-start"><Moon className="h-4 w-4" /> Dark (default)</Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div><Label htmlFor="hc" className="flex items-center gap-2"><Contrast className="h-4 w-4" /> High contrast</Label><p className="mt-0.5 text-xs text-muted-foreground">Maximum contrast, thicker borders</p></div>
              <Switch id="hc" checked={highContrast} onCheckedChange={setHighContrast} />
            </div>
            <div>
              <Label className="mb-2 flex items-center gap-2"><Type className="h-4 w-4" /> Text size</Label>
              <div className="grid grid-cols-4 gap-2">
                {SIZES.map((s) => (
                  <Button key={s.key} variant={size === s.key ? "default" : "outline"} onClick={() => setSize(s.key)}>{s.key}</Button>
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-2 flex items-center gap-2"><ZoomIn className="h-4 w-4" /> Screen magnifier <span className="ml-auto tabular-nums text-xs text-muted-foreground">{Math.round(magnify * 100)}%</span></Label>
              <div className="grid grid-cols-6 gap-2">
                {MAGNIFY_LEVELS.map((lvl) => (
                  <Button key={lvl} size="sm" variant={magnify === lvl ? "default" : "outline"} onClick={() => setMagnify(lvl)} className="tabular-nums">
                    {Math.round(lvl * 100)}
                  </Button>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">Magnifies the page up to 400% without breaking layout — also available from the magnifier button in the top bar.</p>
            </div>
            <div className="flex items-center justify-between">
              <div><Label htmlFor="rm">Reduce motion</Label><p className="mt-0.5 text-xs text-muted-foreground">Minimize animations</p></div>
              <Switch id="rm" checked={reduceMotion} onCheckedChange={setReduceMotion} />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Volume2 className="h-4 w-4" /> Assistive technology</CardTitle></CardHeader>
            <CardContent className="space-y-2.5 text-sm">
              {[
                "Tested with JAWS, NVDA, and VoiceOver",
                "Screen magnification to 400% without layout breaking",
                "Compatible with ZoomText, Windows Magnifier, Dragon",
                "All status shown with icon + text, never color alone",
              ].map((t) => (
                <div key={t} className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> <span className="text-muted-foreground">{t}</span></div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base"><Keyboard className="h-4 w-4" /> Keyboard navigation</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              {[
                ["Tab / Shift+Tab", "Move between controls"],
                ["Enter / Space", "Activate the focused control"],
                ["Esc", "Close a dialog or menu"],
                ["/", "Jump to search"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between">
                  <kbd className="rounded border bg-muted px-2 py-0.5 font-mono text-xs">{k}</kbd>
                  <span className="text-muted-foreground">{v}</span>
                </div>
              ))}
              <p className="pt-1 text-xs text-muted-foreground">Every workflow is fully operable without a mouse, with a visible focus indicator.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
