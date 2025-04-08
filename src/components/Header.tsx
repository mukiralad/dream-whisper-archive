
import React from "react";
import { MoonIcon } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between py-6">
      <div className="flex items-center">
        <div className="bg-primary/10 p-2 rounded-full mr-3">
          <MoonIcon className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          DreamKeeper
        </h1>
      </div>
      <div className="text-sm font-medium text-muted-foreground">
        Voice-Activated Dream Archive
      </div>
    </header>
  );
};
