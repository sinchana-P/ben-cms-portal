import { useEffect, useRef, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, formatCurrency } from "@/lib/utils";
import {
  Lock, CreditCard, Landmark, Loader2, CheckCircle2, XCircle, ShieldCheck, Building2,
} from "lucide-react";

export type PayMethod = "card" | "ach" | "check";
type Phase = "form" | "processing" | "success" | "failed";

/**
 * Sandbox payment gateway. Inbound = operator pays the program via the
 * State-Treasurer (CyberSource) hosted flow (Card / ACH). Outbound = Fiscal
 * issues a disbursement to the operator (ACH / check). NO real funds move and
 * the app never stores card data — the gateway tokenizes (PCI SAQ-A). This
 * screen simulates that handoff for the demo.
 */
export function PaymentGatewayDialog({
  open,
  onOpenChange,
  direction,
  amount,
  operatorName,
  kindLabel,
  onComplete,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  direction: "inbound" | "outbound";
  amount: number;
  operatorName: string;
  kindLabel: string;
  onComplete: (status: "completed" | "processing" | "failed", method: PayMethod) => void;
}) {
  const isInbound = direction === "inbound";
  const [method, setMethod] = useState<PayMethod>(isInbound ? "card" : "ach");
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [phase, setPhase] = useState<Phase>("form");
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (open) { setPhase("form"); setMethod(isInbound ? "card" : "ach"); setSimulateFailure(false); }
    return () => { if (timer.current) window.clearTimeout(timer.current); };
  }, [open, isInbound]);

  const pay = () => {
    setPhase("processing");
    timer.current = window.setTimeout(() => {
      if (isInbound && simulateFailure) {
        setPhase("failed");
        onComplete("failed", method);
      } else {
        setPhase("success");
        onComplete(isInbound ? "completed" : "processing", method);
      }
    }, 1400);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            {isInbound ? "Secure payment" : "Issue disbursement"}
          </DialogTitle>
          <DialogDescription>
            {isInbound
              ? "State Treasurer's Office gateway — CyberSource (sandbox)"
              : `To ${operatorName} — via State disbursement (ACH / check)`}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/40 p-3 text-center">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{kindLabel}</div>
          <div className="text-2xl font-bold tabular-nums">{formatCurrency(amount)}</div>
        </div>

        {phase === "form" && (
          <div className="space-y-4">
            {/* Method selector */}
            <div className="grid grid-cols-2 gap-2">
              {(isInbound ? (["card", "ach"] as const) : (["ach", "check"] as const)).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-lg border py-2.5 text-sm font-medium transition-colors",
                    method === m ? "border-primary bg-primary/10 text-primary" : "hover:bg-accent"
                  )}
                >
                  {m === "card" ? <CreditCard className="h-4 w-4" /> : m === "ach" ? <Landmark className="h-4 w-4" /> : <Building2 className="h-4 w-4" />}
                  {m === "card" ? "Card / Debit" : m === "ach" ? "ACH / eCheck" : "Check"}
                </button>
              ))}
            </div>

            {/* Sandbox fields (test data — not collected/stored) */}
            {method === "card" && (
              <div className="space-y-2">
                <div className="space-y-1"><Label className="text-xs">Card number</Label><Input value="4111 1111 1111 1111" readOnly className="font-mono" /></div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1"><Label className="text-xs">Expiry</Label><Input value="12 / 28" readOnly /></div>
                  <div className="space-y-1"><Label className="text-xs">CVV</Label><Input value="•••" readOnly /></div>
                </div>
              </div>
            )}
            {method === "ach" && (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1"><Label className="text-xs">Routing</Label><Input value="121000358" readOnly className="font-mono" /></div>
                <div className="space-y-1"><Label className="text-xs">Account</Label><Input value="••••6789" readOnly className="font-mono" /></div>
              </div>
            )}
            {method === "check" && (
              <p className="rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">A physical check will be issued through the State disbursement process and mailed to the operator on file.</p>
            )}

            {isInbound && (
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <Checkbox checked={simulateFailure} onCheckedChange={(v) => setSimulateFailure(!!v)} /> Simulate a declined payment (to demo the failure path)
              </label>
            )}

            <Button className="w-full" onClick={pay}>
              <Lock className="h-4 w-4" /> {isInbound ? `Pay ${formatCurrency(amount)}` : `Issue ${formatCurrency(amount)}`}
            </Button>
            <p className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
              <Lock className="h-3 w-3" /> Sandbox — no real funds move. The app never stores card data (gateway-tokenized, PCI SAQ-A).
            </p>
          </div>
        )}

        {phase === "processing" && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">Contacting the State Treasurer gateway…</p>
            <p className="text-xs text-muted-foreground">Authorizing {method.toUpperCase()} · CyberSource sandbox</p>
          </div>
        )}

        {phase === "success" && (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <CheckCircle2 className="h-10 w-10 text-success" />
            <p className="text-base font-semibold">{isInbound ? "Payment received" : "Disbursement issued"}</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              {isInbound
                ? `${formatCurrency(amount)} paid via ${method.toUpperCase()}. Recorded to the account statement; email + in-app confirmation sent.`
                : `${formatCurrency(amount)} issued to ${operatorName} via ${method.toUpperCase()}. ACH settles in 1–3 business days; operator notified.`}
            </p>
            <Button className="mt-2 w-full" onClick={() => onOpenChange(false)}>Done</Button>
          </div>
        )}

        {phase === "failed" && (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <XCircle className="h-10 w-10 text-destructive" />
            <p className="text-base font-semibold">Payment declined</p>
            <p className="max-w-xs text-sm text-muted-foreground">The gateway declined this {method.toUpperCase()} transaction. A failure notification was sent; you can retry.</p>
            <div className="mt-2 flex w-full gap-2">
              <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Close</Button>
              <Button className="flex-1" onClick={() => setPhase("form")}>Retry</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
