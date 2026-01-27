"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface BottomBarState {
  handleNext?: () => void;
  handlePrev?: () => void;
  currentQuestion?: number;
  finalQuestion?: number;
  nextFlag?: boolean;
  reading?: boolean;
}

interface LayoutContextType {
  bottomBarState: BottomBarState;
  setBottomBarState: (state: Partial<BottomBarState>) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [bottomBarState, setBottomBar] = useState<BottomBarState>({
    reading: false,
  });

  const setBottomBarState = useCallback(
    (state: Partial<BottomBarState>) => {
      setBottomBar((prev) => ({ ...prev, ...state }));
    },
    [setBottomBar],
  );

  return (
    <LayoutContext.Provider
      value={{
        bottomBarState,
        setBottomBarState,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}
