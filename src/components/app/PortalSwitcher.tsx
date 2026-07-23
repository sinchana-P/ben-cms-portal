import { useNavigate } from "react-router-dom";
import { useSession } from "@/context/session";
import { cn } from "@/lib/utils";
import { Building2, Store } from "lucide-react";

/** Segmented Staff | Operator switch. Switching jumps to a sensible default
 *  persona for that portal and navigates to its home — demonstrating both
 *  portals from one control. */
export function PortalSwitcher() {
  const { portal, setPersonaId } = useSession();
  const navigate = useNavigate();

  const go = (p: "staff" | "operator") => {
    if (p === portal) return;
    setPersonaId(p === "staff" ? "admin-1" : "op-maria");
    navigate(p === "staff" ? "/staff" : "/operator");
  };

  return (
    <div className="inline-flex rounded-lg border bg-muted/60 p-0.5" role="tablist" aria-label="Portal switcher">
      {([
        { key: "staff", label: "Staff", Icon: Building2 },
        { key: "operator", label: "Operator", Icon: Store },
      ] as const).map(({ key, label, Icon }) => (
        <button
          key={key}
          role="tab"
          aria-selected={portal === key}
          onClick={() => go(key)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors",
            portal === key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden />
          {label}
        </button>
      ))}
    </div>
  );
}
