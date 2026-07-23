import { useSession } from "@/context/session";
import { NOTIFICATIONS } from "@/data/notifications";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDateTime } from "@/lib/utils";
import {
  Bell, Inbox, CheckCircle2, DollarSign, Wrench, PenLine, Megaphone, AlertTriangle,
} from "lucide-react";

const ICONS: Record<string, typeof Bell> = {
  inbox: Inbox, check: CheckCircle2, dollar: DollarSign, wrench: Wrench,
  signature: PenLine, megaphone: Megaphone, alert: AlertTriangle,
};

export function NotificationsButton() {
  const { persona } = useSession();
  const items = NOTIFICATIONS.filter(
    (n) =>
      n.forRole.includes(persona.role) &&
      (!n.forOperatorId || n.forOperatorId === persona.id)
  );
  const unread = items.filter((n) => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications, ${unread} unread`}>
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between border-b px-4 py-2.5">
          <span className="text-sm font-semibold">Notifications</span>
          <span className="text-xs text-muted-foreground">{unread} unread</span>
        </div>
        <ScrollArea className="max-h-96">
          <ul className="divide-y">
            {items.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-muted-foreground">You're all caught up.</li>
            )}
            {items.map((n) => {
              const Icon = ICONS[n.icon] ?? Bell;
              return (
                <li key={n.id} className={`flex gap-3 px-4 py-3 ${!n.read ? "bg-primary/[0.03]" : ""}`}>
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.body}</p>
                    <time className="mt-0.5 block text-[11px] text-muted-foreground">{formatDateTime(n.at)}</time>
                  </div>
                  {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="unread" />}
                </li>
              );
            })}
          </ul>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
