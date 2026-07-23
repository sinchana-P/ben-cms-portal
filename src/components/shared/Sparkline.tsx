import { useId } from "react";
import { cn } from "@/lib/utils";

/** Tiny inline SVG sparkline — area + line + emphasized endpoint. No deps. */
export function Sparkline({
  data,
  className,
  strokeClassName = "text-primary",
  height = 36,
}: {
  data: number[];
  className?: string;
  strokeClassName?: string;
  height?: number;
}) {
  const id = useId().replace(/:/g, "");
  const w = 100;
  const h = height;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pad = 3;
  const pts = data.map((d, i) => {
    const x = data.length > 1 ? (i / (data.length - 1)) * (w - pad * 2) + pad : w / 2;
    const y = h - pad - ((d - min) / span) * (h - pad * 2);
    return [x, y] as const;
  });
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${h} L${pts[0][0].toFixed(1)},${h} Z`;
  const last = pts[pts.length - 1];

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={cn("h-9 w-full", strokeClassName, className)} aria-hidden>
      <defs>
        <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-${id})`} />
      <path d={line} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      <circle cx={last[0]} cy={last[1]} r="2.4" fill="currentColor" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
