import { NavLink } from "react-router-dom";
import { useSession } from "@/context/session";
import { useAppData } from "@/context/appData";
import { navFor } from "@/data/nav";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { BenMark } from "./BenMark";

function useBadgeCounts() {
  const { persona } = useSession();
  const { cases: CASES } = useAppData();
  const approvals = CASES.filter((c) =>
    persona.role === "beo"
      ? c.state === "beo_review" && c.assignedBeoId === persona.id
      : persona.role === "chief"
      ? c.state === "chief_review"
      : false
  ).length;
  const acks = CASES.filter(
    (c) => c.operatorId === persona.id && c.state === "awaiting_ack"
  ).length;
  return { approvals, acks };
}

export function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const { portal, persona } = useSession();
  const items = navFor(portal, persona.role);
  const badges = useBadgeCounts();

  return (
    <nav className="flex flex-col gap-0.5 px-3" aria-label="Main navigation">
      {items.map((item) => {
        const count = item.badgeKey === "approvals" ? badges.approvals : item.badgeKey === "acks" ? badges.acks : 0;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/staff" || item.to === "/operator"}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )
            }
          >
            <item.icon className="h-4 w-4 shrink-0" aria-hidden />
            <span className="flex-1 truncate">{item.label}</span>
            {count > 0 && <Badge variant="warning" className="h-5 px-1.5">{count}</Badge>}
          </NavLink>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const { portal } = useSession();
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-card lg:flex">
      <div className="flex h-14 items-center border-b px-5">
        <BenMark />
      </div>
      <div className="flex items-center gap-2 px-5 py-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {portal === "staff" ? "Staff Portal" : "Operator Portal"}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto pb-4 scrollbar-thin">
        <NavList />
      </div>
      <div className="border-t p-3">
        <div className="rounded-md bg-muted/50 px-3 py-2 text-[11px] text-muted-foreground">
          UI prototype · RFP 90DETR-S3794 · mock data
        </div>
      </div>
    </aside>
  );
}
