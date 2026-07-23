import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useSession } from "@/context/session";

export function AppShell() {
  const { magnify } = useSession();
  return (
    <div className="app-canvas flex min-h-screen bg-background">
      <a href="#main" className="skip-link">Skip to main content</a>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        {/* Screen magnification (AX-4): zoom scales content only; header/nav
            stay full-size so controls remain reachable at any zoom. */}
        <main
          id="main"
          className="flex-1 overflow-x-hidden px-4 py-6 sm:px-6 lg:px-8"
          style={{ zoom: magnify } as React.CSSProperties}
        >
          <div className="mx-auto max-w-6xl animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
