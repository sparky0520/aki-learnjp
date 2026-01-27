"use client";
import { createContext, useContext, useState } from "react";

const AnswersContext = createContext(null);

export function AnswersProvider({ children }: { children: React.ReactNode }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const setAnswer = (partNo: number, val: string) => {
    setAnswers((prev) => ({
      ...prev,
      [partNo]: val,
    }));
  };

  return (
    <AnswersContext.Provider value={{ answers, setAnswers, setAnswer }}>
      {children}
    </AnswersContext.Provider>
  );
}

export function useAnswers() {
  return useContext(AnswersContext);
}
