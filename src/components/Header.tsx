
import React from "react";
import { MoonIcon, SunMoon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between py-6">
      <div className="flex items-center">
        <div className="bg-primary/10 p-2 rounded-full mr-3">
          <SunMoon className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          DreamKeeper
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm font-medium text-muted-foreground hidden sm:block">
          Voice-Activated Dream Archive
        </div>
        <Button variant="outline" size="sm" className="rounded-full">
          <MoonIcon className="h-4 w-4 mr-2" />
          Night Mode
        </Button>
      </div>
    </header>
  );
};
