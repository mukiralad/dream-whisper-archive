import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Dream } from "../types/dream";
import { supabase, STORAGE_BUCKET, initializeStorage } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "./AuthContext";

interface DreamContextType {
  dreams: Dream[];
  addDream: (dream: Dream) => Promise<void>;
  removeDream: (id: string) => Promise<void>;
  selectedDreamId: string | null;
  setSelectedDreamId: (id: string | null) => void;
  isLoading: boolean;
}

const DreamContext = createContext<DreamContextType | undefined>(undefined);

export const DreamProvider = ({ children }: { children: ReactNode }) => {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [selectedDreamId, setSelectedDreamId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Initialize storage and fetch dreams on component mount or when user changes
  useEffect(() => {
    if (user) {
      const init = async () => {
        await initializeStorage();
        await fetchDreams();
      };
      init();
    } else {
      setDreams([]);
    }
  }, [user]);

  const fetchDreams = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('dreams')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        // Create signed URLs for each dream recording
        const fetchedDreams = await Promise.all(
          data.map(async (item) => {
            const { data: signedUrl } = await supabase.storage
              .from(STORAGE_BUCKET)
              .createSignedUrl(`${user.id}/${item.id}.wav`, 3600); // 1 hour expiry

            return {
              id: item.id,
              title: item.title,
              audioUrl: signedUrl?.signedUrl || '',
              createdAt: new Date(item.created_at),
              duration: item.duration,
              waveform: item.waveform
            };
          })
        );
        setDreams(fetchedDreams);
      }
    } catch (error) {
      console.error('Error fetching dreams:', error);
      toast({
        title: "Error",
        description: "Failed to load dreams",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addDream = async (dream: Dream) => {
    if (!user) return;

    try {
      // Upload audio file to storage in user's folder
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(`${user.id}/${dream.id}.wav`, dream.audioBlob, {
          contentType: 'audio/wav',
          cacheControl: '3600',
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get a signed URL for the uploaded file
      const { data: signedUrl } = await supabase.storage
        .from(STORAGE_BUCKET)
        .createSignedUrl(`${user.id}/${dream.id}.wav`, 3600);

      // Save dream metadata to database with user_id
      const { error: dbError } = await supabase
        .from('dreams')
        .insert([
          {
            id: dream.id,
            title: dream.title,
            created_at: dream.createdAt.toISOString(),
            duration: dream.duration,
            waveform: dream.waveform,
            user_id: user.id
          }
        ]);

      if (dbError) {
        throw dbError;
      }

      // Update local state with the signed URL
      const newDream = {
        ...dream,
        audioUrl: signedUrl?.signedUrl || dream.audioUrl,
      };
      setDreams((prev) => [...prev, newDream]);

      toast({
        title: "Success",
        description: "Dream saved successfully",
      });
    } catch (error) {
      console.error('Error adding dream:', error);
      toast({
        title: "Error",
        description: "Failed to save dream",
        variant: "destructive",
      });
      throw error;
    }
  };

  const removeDream = async (id: string) => {
    if (!user) return;

    try {
      // Remove audio file from storage
      const { error: storageError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([`${user.id}/${id}.wav`]);

      if (storageError) {
        throw storageError;
      }

      // Remove dream metadata from database
      const { error: dbError } = await supabase
        .from('dreams')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (dbError) {
        throw dbError;
      }

      setDreams((prev) => prev.filter((dream) => dream.id !== id));
      toast({
        title: "Success",
        description: "Dream removed successfully",
      });
    } catch (error) {
      console.error('Error removing dream:', error);
      toast({
        title: "Error",
        description: "Failed to remove dream",
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    dreams,
    addDream,
    removeDream,
    selectedDreamId,
    setSelectedDreamId,
    isLoading
  };

  return <DreamContext.Provider value={value}>{children}</DreamContext.Provider>;
};

export const useDreamContext = () => {
  const context = useContext(DreamContext);
  if (context === undefined) {
    throw new Error("useDreamContext must be used within a DreamProvider");
  }
  return context;
};
