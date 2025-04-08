import React, { useRef, useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Trash2 } from "lucide-react";
import { Dream } from "@/types/dream";
import { useDreamContext } from "@/contexts/DreamContext";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

interface DreamCardProps {
  dream: Dream;
  className?: string;
}

export const DreamCard = ({ dream, className }: DreamCardProps) => {
  const { removeDream, selectedDreamId, setSelectedDreamId } = useDreamContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio instance on mount
    audioRef.current = new Audio(dream.audioUrl);
    
    // Set up event listeners
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    
    // Cleanup on unmount
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [dream.audioUrl]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Stop any other playing audio before playing this one
      document.querySelectorAll('audio').forEach(audio => audio.pause());
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
    setSelectedDreamId(dream.id);
  };

  const handleSliderChange = (value: number[]) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.pause();
    }
    removeDream(dream.id);
    if (selectedDreamId === dream.id) {
      setSelectedDreamId(null);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <Card 
      className={cn(
        "w-full transition-all duration-300 hover:shadow-md overflow-hidden relative",
        selectedDreamId === dream.id ? "ring-2 ring-primary/50" : "",
        className
      )}
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
              className={cn(
                "w-1 rounded-full transition-colors duration-300",
                currentTime / dream.duration > index / dream.waveform.length
                  ? "bg-primary/60"
                  : "bg-accent/60"
              )}
              style={{ height: `${Math.max(2, value * 40)}px` }}
            />
          ))}
        </div>
        
        {/* Audio controls */}
        <div className="space-y-2 mt-4">
          <Slider
            value={[currentTime]}
            max={dream.duration}
            step={0.1}
            onValueChange={handleSliderChange}
            className="w-full"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(dream.duration)}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between items-center">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handlePlayPause}
          className="text-xs hover:bg-accent/10"
        >
          {isPlaying ? (
            <>
              <Pause className="h-3 w-3 mr-1" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-3 w-3 mr-1" />
              Play
            </>
          )}
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
