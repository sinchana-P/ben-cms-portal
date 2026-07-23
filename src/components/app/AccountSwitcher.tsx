import { useNavigate } from "react-router-dom";
import { useSession } from "@/context/session";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ROLE_LABEL } from "@/data/personas";
import { initials } from "@/lib/utils";
import { ChevronsUpDown, Check, ShieldCheck, KeyRound } from "lucide-react";

/** The demo centerpiece: switch the acting user. Changing account changes
 *  role → nav + permissions, and portal + data scope (operators see only
 *  their own sites). Demonstrates RBAC, separation of duties, isolation. */
export function AccountSwitcher() {
  const { persona, personas, setPersonaId } = useSession();
  const navigate = useNavigate();

  const staff = personas.filter((p) => p.portal === "staff");
  const operators = personas.filter((p) => p.portal === "operator");

  const pick = (id: string, portal: string) => {
    setPersonaId(id);
    navigate(portal === "staff" ? "/staff" : "/operator");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border bg-background px-2 py-1.5 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar className="h-7 w-7">
          <AvatarFallback>{initials(persona.name)}</AvatarFallback>
        </Avatar>
        <div className="hidden leading-tight sm:block">
          <div className="text-xs font-semibold">{persona.name}</div>
          <div className="text-[11px] text-muted-foreground">{persona.title}</div>
        </div>
        <ChevronsUpDown className="h-4 w-4 text-muted-foreground" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <div className="px-2 py-1.5">
          <p className="text-xs text-muted-foreground">
            Viewing as — switch to preview any role. Auth &amp; data scope change live.
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex items-center gap-1.5">
          <ShieldCheck className="h-3 w-3" /> Staff Portal · AD SSO
        </DropdownMenuLabel>
        {staff.map((p) => (
          <DropdownMenuItem key={p.id} onClick={() => pick(p.id, p.portal)}>
            <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px]">{initials(p.name)}</AvatarFallback></Avatar>
            <span className="flex-1">
              <span className="block text-sm">{p.name}</span>
              <span className="block text-xs text-muted-foreground">{ROLE_LABEL[p.role]}</span>
            </span>
            {persona.id === p.id && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="flex items-center gap-1.5">
          <KeyRound className="h-3 w-3" /> Operator Portal · MFA + OTP
        </DropdownMenuLabel>
        {operators.map((p) => (
          <DropdownMenuItem key={p.id} onClick={() => pick(p.id, p.portal)}>
            <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px]">{initials(p.name)}</AvatarFallback></Avatar>
            <span className="flex-1">
              <span className="block text-sm">{p.name}</span>
              <span className="block text-xs text-muted-foreground">{p.title}</span>
            </span>
            {persona.id === p.id && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
