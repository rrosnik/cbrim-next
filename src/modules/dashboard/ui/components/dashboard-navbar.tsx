"use client";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from "lucide-react";

import { DashboardCommand } from "./dashboard-command";

export const DashboardNavbar = () => {
  const { toggleSidebar, state, isMobile } = useSidebar();
  const [commandOpen, setCommandOpen] = useState(false);

  // Detect platform (could be a hook or util)
  const isMac =
    typeof navigator !== "undefined" &&
    navigator.platform.toUpperCase().indexOf("MAC") >= 0;

  useEffect(() => {
    const handleShortCuts = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", handleShortCuts);

    return () => {
      document.removeEventListener("keydown", handleShortCuts);
    };
  }, []);

  return (
    <>
      <DashboardCommand open={commandOpen} setOpen={setCommandOpen} />
      <nav className="flex px-4 gap-x-2 items-center py-3 border-b bg-background">
        <Button className="size-9" variant="outline" onClick={toggleSidebar}>
          {state === "collapsed" || isMobile ? (
            <PanelLeftIcon className="size-4" />
          ) : (
            <PanelLeftCloseIcon className="size-4" />
          )}
        </Button>
        <Button
          className="h-9 w-60 justify-start font-normal text-muted-foreground hover:text-muted-foreground"
          variant="outline"
          size="sm"
          onClick={() => setCommandOpen((open) => !open)}
        >
          <SearchIcon />
          Search ...
          <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <span>{isMac ? "⌘" : "Ctrl+"}</span>K
          </kbd>
        </Button>{" "}
      </nav>
    </>
  );
};
