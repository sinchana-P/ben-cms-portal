import { useSession } from "@/context/session";
import { Button } from "@/components/ui/button";
import {
  Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,
} from "@/components/ui/tooltip";
import { Sun, Moon, Contrast } from "lucide-react";

export function ThemeControls() {
  const { themeMode, setThemeMode, highContrast, setHighContrast } = useSession();
  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setThemeMode(themeMode === "dark" ? "light" : "dark")}
              aria-label={themeMode === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            >
              {themeMode === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{themeMode === "dark" ? "Light theme" : "Dark theme"}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={highContrast ? "default" : "ghost"}
              size="icon"
              onClick={() => setHighContrast(!highContrast)}
              aria-label="Toggle high-contrast mode"
              aria-pressed={highContrast}
            >
              <Contrast className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>High contrast {highContrast ? "on" : "off"}</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
