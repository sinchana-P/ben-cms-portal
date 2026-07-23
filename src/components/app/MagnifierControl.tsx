import { useSession, MAGNIFY_LEVELS } from "@/context/session";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ZoomIn, ZoomOut, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/** Screen magnifier (AX-4 / RFP §5.2 — 400% magnification, ZoomText-class).
 *  Zooms the page content up to 4×; header controls stay full-size. */
export function MagnifierControl() {
  const { magnify, setMagnify } = useSession();
  const idx = MAGNIFY_LEVELS.indexOf(magnify);
  const pct = Math.round(magnify * 100);
  const active = magnify !== 1;

  const step = (dir: 1 | -1) => {
    const next = Math.min(MAGNIFY_LEVELS.length - 1, Math.max(0, (idx < 0 ? 0 : idx) + dir));
    setMagnify(MAGNIFY_LEVELS[next]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={active ? "default" : "ghost"}
          size="sm"
          className="gap-1.5"
          aria-label={`Screen magnifier, currently ${pct} percent`}
        >
          <ZoomIn className="h-4 w-4" />
          {active && <span className="tabular-nums text-xs">{pct}%</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold">Screen magnifier</span>
          <span className="tabular-nums text-sm text-muted-foreground">{pct}%</span>
        </div>
        <div className="mb-3 flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => step(-1)} disabled={magnify === MAGNIFY_LEVELS[0]} aria-label="Zoom out"><Minus className="h-4 w-4" /></Button>
          <div className="flex h-9 flex-1 items-center justify-center rounded-md border bg-muted/50 text-sm font-semibold tabular-nums" aria-live="polite">{pct}%</div>
          <Button variant="outline" size="icon" onClick={() => step(1)} disabled={magnify === MAGNIFY_LEVELS[MAGNIFY_LEVELS.length - 1]} aria-label="Zoom in"><Plus className="h-4 w-4" /></Button>
        </div>
        <div className="grid grid-cols-6 gap-1">
          {MAGNIFY_LEVELS.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setMagnify(lvl)}
              aria-pressed={magnify === lvl}
              className={cn(
                "rounded-md border py-1 text-xs font-semibold tabular-nums transition-colors",
                magnify === lvl ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent"
              )}
            >
              {Math.round(lvl * 100)}
            </button>
          ))}
        </div>
        {active && (
          <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={() => setMagnify(1)}>
            <ZoomOut className="h-4 w-4" /> Reset to 100%
          </Button>
        )}
        <p className="mt-2 text-[11px] text-muted-foreground">Magnifies content up to 400% without breaking layout. Works alongside browser zoom and ZoomText.</p>
      </PopoverContent>
    </Popover>
  );
}
