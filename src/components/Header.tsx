import React from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { ProfileButton } from "@/components/ProfileButton";

export const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="flex items-center justify-between py-6">
      <div className="flex items-center">
        <div className="bg-primary/10 p-2 rounded-full mr-3">
          <SunIcon className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          DreamKeeper
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm font-medium text-muted-foreground hidden sm:block">
          Voice-Activated Dream Archive
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="rounded-full"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <SunIcon className="h-4 w-4 mr-2" />
          ) : (
            <MoonIcon className="h-4 w-4 mr-2" />
          )}
          {theme === "dark" ? "Light Mode" : "Night Mode"}
        </Button>
        <ProfileButton />
      </div>
    </header>
  );
};
