import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Play, Save, Pause } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useDreamContext } from "@/contexts/DreamContext";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

const MAX_RECORDING_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export const AudioRecorder = () => {
  const { toast } = useToast();
  const { addDream } = useDreamContext();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Set up audio context for visualization
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Store final waveform data
        const finalWaveformData = [...waveformData];
        setWaveformData(finalWaveformData);
      };
      
      // Start the timer
      const startTime = Date.now();
      timerRef.current = window.setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      
      // Start visualizing the audio
      visualizeAudio();
      
      mediaRecorder.start();
      setIsRecording(true);
      audioChunksRef.current = [];
      
      toast({
        title: "Recording started",
        description: "Speak clearly to capture your dream.",
      });
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast({
        title: "Recording error",
        description: "Could not access your microphone. Please grant permission.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all the active processes
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      // Stop the tracks on the stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      toast({
        title: "Recording stopped",
        description: `Captured ${recordingTime} seconds of audio.`,
      });
    }
  };

  const visualizeAudio = () => {
    if (!analyserRef.current) return;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const updateWaveform = () => {
      if (!isRecording || !analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Sample some values from the frequency data for the waveform
      const sampleSize = 10;
      const samples = [];
      const step = Math.floor(bufferLength / sampleSize);
      
      for (let i = 0; i < sampleSize; i++) {
        const index = i * step;
        // Normalize the value between 0 and 1
        samples.push(dataArray[index] / 255);
      }
      
      setWaveformData(prev => {
        // Keep a limited number of samples (e.g., last 50)
        const newData = [...prev, ...samples];
        return newData.slice(Math.max(0, newData.length - 50));
      });
      
      animationFrameRef.current = requestAnimationFrame(updateWaveform);
    };
    
    updateWaveform();
  };

  const saveRecording = () => {
    if (!audioUrl) return;
    
    const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
    
    // Check file size before saving
    if (audioBlob.size > MAX_RECORDING_SIZE) {
      toast({
        title: "Recording too large",
        description: "Recording exceeds 5MB limit. Please record a shorter dream.",
        variant: "destructive",
      });
      return;
    }
    
    const newDream = {
      id: uuidv4(),
      audioBlob,
      audioUrl,
      title: `Dream ${new Date().toLocaleString()}`,
      createdAt: new Date(),
      duration: recordingTime,
      waveform: waveformData,
    };
    
    addDream(newDream);
    setAudioUrl(null);
    setRecordingTime(0);
    setWaveformData([]);
    
    toast({
      title: "Dream saved!",
      description: "Your dream has been added to your collection.",
    });
  };

  const playRecording = () => {
    if (!audioUrl || !audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Stop any other playing audio before playing this one
      document.querySelectorAll('audio').forEach(audio => audio.pause());
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
    
    toast({
      title: isPlaying ? "Paused" : "Playing recording",
      description: "Listen to your recorded dream.",
    });
  };

  const handleSliderChange = (value: number[]) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Set up audio player when URL changes
  useEffect(() => {
    if (!audioUrl) {
      setIsPlaying(false);
      setCurrentTime(0);
      return;
    }

    audioRef.current = new Audio(audioUrl);
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

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audioUrl]);

  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <div className="flex flex-col w-full h-32 relative rounded-xl glass p-4">
        {/* Waveform Visualization */}
        <div className="flex items-center justify-center gap-1 w-full h-full">
          {isRecording ? (
            // Live waveform when recording
            waveformData.map((value, index) => (
              <div
                key={index}
                className="w-1 bg-accent/80 rounded-full"
                style={{
                  height: `${Math.max(5, value * 70)}px`,
                  animation: `wave ${0.5 + Math.random() * 0.5}s ease-in-out infinite`,
                  animationDelay: `${index * 0.05}s`
                }}
              />
            ))
          ) : audioUrl ? (
            // Static waveform when recording is done
            waveformData.map((value, index) => (
              <div
                key={index}
                className={cn(
                  "w-1 rounded-full transition-colors duration-300",
                  currentTime / recordingTime > index / waveformData.length
                    ? "bg-primary/70"
                    : "bg-accent/70"
                )}
                style={{
                  height: `${Math.max(5, value * 70)}px`,
                }}
              />
            ))
          ) : (
            // Placeholder when no recording
            Array.from({ length: 20 }).map((_, index) => (
              <div
                key={index}
                className="w-1 bg-muted-foreground/30 rounded-full"
                style={{
                  height: `${10 + Math.random() * 20}px`,
                }}
              />
            ))
          )}
        </div>

        {/* Timer */}
        {(isRecording || audioUrl) && (
          <div className="absolute top-2 right-2 bg-background/80 backdrop-blur px-2 py-1 rounded-md text-xs font-medium">
            {isRecording ? `${recordingTime}s` : formatTime(currentTime)}
          </div>
        )}

        {/* Audio controls */}
        {audioUrl && !isRecording && (
          <div className="absolute bottom-2 left-2 right-2">
            <Slider
              value={[currentTime]}
              max={recordingTime}
              step={0.1}
              onValueChange={handleSliderChange}
              className="w-full"
            />
          </div>
        )}
      </div>

      <div className="flex gap-3">
        {!isRecording && !audioUrl && (
          <Button 
            onClick={startRecording} 
            className="animate-pulse-soft transition-all duration-300 hover:scale-105"
            size="lg"
          >
            <Mic className="mr-2 h-5 w-5" />
            Record Dream
          </Button>
        )}

        {isRecording && (
          <Button 
            onClick={stopRecording} 
            variant="destructive" 
            className="transition-all duration-300 hover:scale-105"
            size="lg"
          >
            <Square className="mr-2 h-4 w-4" />
            Stop Recording
          </Button>
        )}

        {audioUrl && (
          <>
            <Button 
              onClick={playRecording} 
              variant="secondary"
              className="transition-all duration-300 hover:scale-105"
            >
              {isPlaying ? (
                <>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Play
                </>
              )}
            </Button>
            
            <Button 
              onClick={saveRecording} 
              variant="default"
              className="transition-all duration-300 hover:scale-105"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Dream
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
