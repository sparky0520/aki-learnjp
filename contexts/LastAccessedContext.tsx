"use client";
import { createContext, useContext, useState } from "react";

const LastAccessedContext = createContext<any>(null);

export function LastAccessedProvider({ children }: { children: React.ReactNode }) {
    const [lastAccessed, setLastAccessed] = useState({
        lessonNumber: 1,
        courseNumber: 1
    });

    return (
        <LastAccessedContext.Provider value={{ lastAccessed, setLastAccessed }}>
            {children}
        </LastAccessedContext.Provider>
    );
}

export const useLastAccessed = () => useContext(LastAccessedContext);
