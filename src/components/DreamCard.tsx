
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Trash2 } from "lucide-react";
import { Dream } from "@/types/dream";
import { useDreamContext } from "@/contexts/DreamContext";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface DreamCardProps {
  dream: Dream;
  className?: string;
}

export const DreamCard = ({ dream, className }: DreamCardProps) => {
  const { removeDream, selectedDreamId, setSelectedDreamId } = useDreamContext();

  const handlePlay = () => {
    const audio = new Audio(dream.audioUrl);
    audio.play();
    setSelectedDreamId(dream.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeDream(dream.id);
    if (selectedDreamId === dream.id) {
      setSelectedDreamId(null);
    }
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <Card 
      className={cn(
        "w-full transition-all duration-300 hover:shadow-md cursor-pointer overflow-hidden relative",
        selectedDreamId === dream.id ? "ring-2 ring-primary/50" : "",
        className
      )}
      onClick={handlePlay}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium line-clamp-1">{dream.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="pb-2">
        {/* Waveform visualization */}
        <div className="flex items-end justify-start gap-px h-12 my-1">
          {dream.waveform.map((value, index) => (
            <div 
              key={index}
              className="w-1 bg-accent/60 rounded-full" 
              style={{ height: `${Math.max(2, value * 40)}px` }}
            />
          ))}
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
          <span>{formatDate(dream.createdAt)}</span>
          <span>{dream.duration}s</span>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handlePlay} 
          className="text-xs hover:bg-accent/10"
        >
          <Play className="h-3 w-3 mr-1" />
          Play
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleDelete} 
          className="text-xs hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Remove
        </Button>
      </CardFooter>
    </Card>
  );
};
