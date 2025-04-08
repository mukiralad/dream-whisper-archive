import React from "react";
import { useDreamContext } from "@/contexts/DreamContext";
import { DreamCard } from "./DreamCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

export const DreamTimeline = () => {
  const { dreams, isLoading } = useDreamContext();

  // Group dreams by date
  const dreamsByDate = dreams.reduce((acc, dream) => {
    const dateKey = format(dream.createdAt, "yyyy-MM-dd");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(dream);
    return acc;
  }, {} as Record<string, typeof dreams>);

  const sortedDates = Object.keys(dreamsByDate).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-60 text-center p-4">
        <div className="text-4xl mb-4 opacity-20">🌙</div>
        <h3 className="text-lg font-medium mb-1">Loading dreams...</h3>
        <p className="text-sm text-muted-foreground">
          Please wait while we fetch your dreams.
        </p>
      </div>
    );
  }

  if (dreams.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-60 text-center p-4">
        <div className="text-4xl mb-4 opacity-20">💤</div>
        <h3 className="text-lg font-medium mb-1">No dreams yet</h3>
        <p className="text-sm text-muted-foreground">
          Record your first dream to see it here.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-8 pb-6">
        {sortedDates.map((dateKey) => (
          <div key={dateKey} className="space-y-3">
            <h3 className="text-sm font-medium sticky top-0 backdrop-blur-sm bg-background/80 py-2 z-10">
              {format(new Date(dateKey), "EEEE, MMMM d")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dreamsByDate[dateKey].map((dream) => (
                <DreamCard 
                  key={dream.id} 
                  dream={dream}
                  className="animate-fade-in"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
