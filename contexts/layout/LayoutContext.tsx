"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface LayoutContextType {
  sidebarVisible: boolean;
  setSidebarVisible: (visible: boolean | ((prev: boolean) => boolean)) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  return (
    <LayoutContext.Provider value={{ sidebarVisible, setSidebarVisible }}>
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
