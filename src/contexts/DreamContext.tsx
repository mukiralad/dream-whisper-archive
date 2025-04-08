
import React, { createContext, useState, useContext, ReactNode } from "react";
import { Dream } from "../types/dream";

interface DreamContextType {
  dreams: Dream[];
  addDream: (dream: Dream) => void;
  removeDream: (id: string) => void;
  selectedDreamId: string | null;
  setSelectedDreamId: (id: string | null) => void;
}

const DreamContext = createContext<DreamContextType | undefined>(undefined);

export const DreamProvider = ({ children }: { children: ReactNode }) => {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [selectedDreamId, setSelectedDreamId] = useState<string | null>(null);

  const addDream = (dream: Dream) => {
    setDreams((prev) => [...prev, dream]);
  };

  const removeDream = (id: string) => {
    setDreams((prev) => prev.filter((dream) => dream.id !== id));
  };

  const value = {
    dreams,
    addDream,
    removeDream,
    selectedDreamId,
    setSelectedDreamId
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
