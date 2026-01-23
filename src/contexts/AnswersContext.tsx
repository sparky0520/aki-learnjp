"use client";
import { createContext, useContext, useState } from "react";

const AnswersContext = createContext<any>(null);

export function AnswersProvider({ children }: { children: React.ReactNode }) {
    const [answers, setAnswers] = useState({});

    return (
        <AnswersContext.Provider value={{ answers, setAnswers }}>
            {children}
        </AnswersContext.Provider>
    );
}
