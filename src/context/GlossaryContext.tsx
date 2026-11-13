import React, { createContext, useContext, useState } from 'react';
import { GlossaryTerm } from '../data/glossaryData.ts';

interface GlossaryContextValue {
  hoveredTerm: GlossaryTerm | null;
  lastInspectedTerm: GlossaryTerm | null;
  pinnedTerm: GlossaryTerm | null;
  isGlossaryEnabled: boolean;
  isIndexOpen: boolean;
  setHoveredTerm: (term: GlossaryTerm | null) => void;
  setPinnedTerm: (term: GlossaryTerm | null) => void;
  toggleGlossaryEnabled: () => void;
  setIsIndexOpen: (open: boolean) => void;
}

const GlossaryContext = createContext<GlossaryContextValue | null>(null);

export const GlossaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hoveredTerm, setHoveredTermState] = useState<GlossaryTerm | null>(null);
  const [lastInspectedTerm, setLastInspectedTerm] = useState<GlossaryTerm | null>(null);
  const [pinnedTerm, setPinnedTerm] = useState<GlossaryTerm | null>(null);
  const [isGlossaryEnabled, setIsGlossaryEnabled] = useState<boolean>(true);
  const [isIndexOpen, setIsIndexOpen] = useState<boolean>(false);

  const setHoveredTerm = (term: GlossaryTerm | null) => {
    setHoveredTermState(term);
    if (term) {
      setLastInspectedTerm(term);
    }
  };

  const toggleGlossaryEnabled = () => {
    setIsGlossaryEnabled((prev) => !prev);
  };

  return (
    <GlossaryContext.Provider
      value={{
        hoveredTerm,
        lastInspectedTerm,
        pinnedTerm,
        isGlossaryEnabled,
        isIndexOpen,
        setHoveredTerm,
        setPinnedTerm,
        toggleGlossaryEnabled,
        setIsIndexOpen,
      }}
    >
      {children}
    </GlossaryContext.Provider>
  );
};

export function useGlossary(): GlossaryContextValue {
  const ctx = useContext(GlossaryContext);
  if (!ctx) {
    throw new Error('useGlossary must be used within a GlossaryProvider');
  }
  return ctx;
}
