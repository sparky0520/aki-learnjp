"use client";

import React, { createContext, useContext, useState } from "react";

interface BottomBarState {
  handleNext?: () => void;
  handlePrev?: () => void;
  currentQuestion?: number;
  finalQuestion?: number;
  nextFlag?: boolean;
  reading?: boolean;
  isVisible: boolean;
}

interface LayoutContextType {
  bottomBarState: BottomBarState;
  setBottomBarState: (state: Partial<BottomBarState>) => void;
  showBottomBar: (options: Omit<BottomBarState, "isVisible">) => void;
  hideBottomBar: () => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const [bottomBarState, setBottomBar] = useState<BottomBarState>({
    isVisible: false,
    reading: false,
  });

  const setBottomBarState = (state: Partial<BottomBarState>) => {
    setBottomBar((prev) => ({ ...prev, ...state }));
  };

  const showBottomBar = (options: Omit<BottomBarState, "isVisible">) => {
    setBottomBar({ ...options, isVisible: true });
  };

  const hideBottomBar = () => {
    setBottomBar((prev) => ({ ...prev, isVisible: false }));
  };

  return (
    <LayoutContext.Provider
      value={{
        bottomBarState,
        setBottomBarState,
        showBottomBar,
        hideBottomBar,
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
