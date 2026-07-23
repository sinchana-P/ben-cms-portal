import { useState } from "react";
import { useSession } from "@/context/session";
import { PortalSwitcher } from "./PortalSwitcher";
import { AccountSwitcher } from "./AccountSwitcher";
import { ThemeControls } from "./ThemeControls";
import { NotificationsButton } from "./NotificationsButton";
import { NavList } from "./Sidebar";
import { BenMark } from "./BenMark";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Menu, ShieldCheck, KeyRound } from "lucide-react";

export function Header() {
  const { persona } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-card/95 px-3 backdrop-blur sm:px-4">
      {/* Mobile nav trigger */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b">
            <SheetTitle asChild><div><BenMark /></div></SheetTitle>
          </SheetHeader>
          <div className="py-3"><NavList onNavigate={() => setOpen(false)} /></div>
        </SheetContent>
      </Sheet>

      <div className="lg:hidden"><BenMark /></div>

      <div className="hidden lg:block">
        <PortalSwitcher />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <Badge variant="secondary" className="hidden gap-1 md:inline-flex">
          {persona.authMethod.includes("SSO") ? <ShieldCheck className="h-3 w-3" /> : <KeyRound className="h-3 w-3" />}
          {persona.authMethod.includes("SSO") ? "AD SSO" : "MFA + OTP"}
        </Badge>
        <div className="lg:hidden"><PortalSwitcher /></div>
        <ThemeControls />
        <NotificationsButton />
        <AccountSwitcher />
      </div>
    </header>
  );
}
