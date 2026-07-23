import { useMemo, useState } from "react";
import type { BenForm, FormField } from "@/types";
import { SET_ASIDE_RATE } from "@/data/forms";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { UploadCloud, Calculator, Info } from "lucide-react";

type Values = Record<string, string | number | boolean>;

function num(v: unknown): number {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? ""));
  return isNaN(n) ? 0 : n;
}

export function computeField(field: FormField, values: Values, setAsideRate: number = SET_ASIDE_RATE): number {
  if (field.computeKind === "sum") {
    return (field.computeFrom ?? []).reduce((acc, k) => acc + num(values[k]), 0);
  }
  if (field.computeKind === "profit") {
    const rev = num(values.rev_taxable) + num(values.rev_nontaxable) + num(values.rev_vending);
    const exp = num(values.exp_cogs) + num(values.exp_operating) + num(values.exp_payroll);
    return rev - exp;
  }
  if (field.computeKind === "setaside") {
    const rev = num(values.rev_taxable) + num(values.rev_nontaxable) + num(values.rev_vending);
    const exp = num(values.exp_cogs) + num(values.exp_operating) + num(values.exp_payroll);
    return Math.max(0, Math.round((rev - exp) * setAsideRate));
  }
  return 0;
}

export function FormRenderer({
  form,
  initial = {},
  readOnly = false,
  optionOverrides = {},
  setAsideRate = SET_ASIDE_RATE,
}: {
  form: BenForm;
  initial?: Values;
  readOnly?: boolean;
  optionOverrides?: Record<string, string[]>;
  /** per-site set-aside rate (fraction, e.g. 0.065) — P&L set-aside uses this */
  setAsideRate?: number;
}) {
  const [values, setValues] = useState<Values>(initial);
  const set = (k: string, v: string | number | boolean) => setValues((p) => ({ ...p, [k]: v }));

  const sections = form.sections;
  const bySection = useMemo(() => {
    const map: Record<string, FormField[]> = {};
    form.fields.forEach((f) => {
      const s = f.section ?? "Details";
      (map[s] ||= []).push(f);
    });
    return map;
  }, [form]);

  return (
    <div className="space-y-5">
      {sections.map((section) => (
        <Card key={section} className="overflow-hidden">
          <div className="border-b bg-muted/40 px-5 py-2.5 text-sm font-semibold" style={{ color: "hsl(var(--ben-subheading))" }}>
            {section}
          </div>
          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
            {(bySection[section] ?? []).map((field) => (
              <Field
                key={field.key}
                field={field}
                value={field.type === "computed" ? computeField(field, values, setAsideRate) : values[field.key]}
                onChange={(v) => set(field.key, v)}
                readOnly={readOnly || field.readOnly || field.type === "computed"}
                options={optionOverrides[field.key] ?? field.options}
              />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

function Field({
  field,
  value,
  onChange,
  readOnly,
  options,
}: {
  field: FormField;
  value: any;
  onChange: (v: string | number) => void;
  readOnly: boolean;
  options?: string[];
}) {
  const span = field.colSpan === 2 ? "sm:col-span-2" : "";
  const isComputed = field.type === "computed";
  const isMoney = field.type === "currency" || isComputed;

  return (
    <div className={cn("space-y-1.5", span)}>
      <Label htmlFor={field.key} className="flex items-center gap-1.5">
        {isComputed && <Calculator className="h-3.5 w-3.5 text-primary" aria-hidden />}
        {field.label}
        {field.required && !readOnly && <span className="text-destructive" aria-hidden>*</span>}
      </Label>

      {isComputed ? (
        <div
          className={cn(
            "flex h-12 items-center rounded-lg border px-4 tabular-nums",
            field.computeKind === "setaside"
              ? "border-primary/40 bg-gradient-to-r from-primary/10 to-[hsl(var(--ben-highlight)/0.12)]"
              : "border-transparent bg-muted/60"
          )}
          aria-live="polite"
        >
          <span className={cn(
            "font-bold",
            field.computeKind === "setaside" ? "text-xl text-primary" : "text-lg text-foreground"
          )}>
            {formatCurrency(num(value))}
          </span>
        </div>
      ) : field.type === "textarea" ? (
        <Textarea id={field.key} value={String(value ?? "")} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} disabled={readOnly} rows={3} />
      ) : field.type === "select" ? (
        <Select value={value ? String(value) : undefined} onValueChange={onChange} disabled={readOnly}>
          <SelectTrigger id={field.key}><SelectValue placeholder="Select…" /></SelectTrigger>
          <SelectContent>
            {(options ?? []).map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
          </SelectContent>
        </Select>
      ) : field.type === "file" ? (
        <div className="flex items-center gap-2 rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground">
          <UploadCloud className="h-4 w-4" aria-hidden />
          {readOnly ? "1 file attached" : "Drag a file or click to upload"}
        </div>
      ) : (
        <div className="relative">
          {isMoney && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>}
          <Input
            id={field.key}
            type={field.type === "number" || field.type === "currency" || field.type === "percentage" ? "number" : field.type === "date" ? "date" : "text"}
            inputMode={isMoney ? "decimal" : undefined}
            step={field.type === "currency" ? "0.01" : field.type === "percentage" ? "0.1" : undefined}
            min={field.min}
            max={field.type === "percentage" ? 100 : field.max}
            value={value === undefined || value === null ? "" : String(value)}
            placeholder={field.placeholder}
            onChange={(e) => onChange(field.type === "text" || field.type === "date" ? e.target.value : e.target.valueAsNumber || 0)}
            disabled={readOnly}
            className={cn(isMoney && "pl-6", field.type === "percentage" && "pr-8")}
            aria-describedby={field.help ? `${field.key}-help` : undefined}
          />
          {field.type === "percentage" && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>}
        </div>
      )}

      {field.help && (
        <p id={`${field.key}-help`} className="flex items-start gap-1 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-3 w-3 shrink-0" aria-hidden /> {field.help}
        </p>
      )}
    </div>
  );
}
