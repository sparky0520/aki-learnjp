"use client";

import React, { useContext, useEffect, useRef } from "react";
import questionScripts from "@/question_type_scripts.json";
import AskAkiContext from "@/contexts/lesson/AkiContext";

interface AkiContextProps {
  questionType: keyof typeof questionScripts.question_types;
  lessonAboutContent?: string;
  currentQuestion?: unknown;
  correctAnswer?: unknown;
  userAnswer?: unknown;
  mistakes?: number;
}

const AkiContext: React.FC<AkiContextProps> = ({
  questionType,
  lessonAboutContent,
  currentQuestion,
  correctAnswer,
  userAnswer,
  mistakes,
}) => {
  const { sendContextUpdate } = useContext(AskAkiContext) || {};
  const lastContextRef = useRef<string>("");

  useEffect(() => {
    if (!sendContextUpdate) return;

    const typeData = questionScripts.question_types[questionType];

    // Construct the context object
    const contextPayload = {
      lesson: {
        type: questionType,
        ...typeData,
        description: lessonAboutContent,
      },
      question: currentQuestion,
      answer: {
        correct: correctAnswer,
        user_current: userAnswer,
      },
      user_state: {
        mistakes: mistakes || 0,
      },
    };

    // Deep compare or just stringify check to avoid loop/spam
    const contextStr = JSON.stringify(contextPayload);
    if (contextStr !== lastContextRef.current) {
      lastContextRef.current = contextStr;
      sendContextUpdate(contextPayload);
    }
  }, [
    questionType,
    lessonAboutContent,
    currentQuestion,
    correctAnswer,
    userAnswer,
    mistakes,
    sendContextUpdate,
  ]);

  return null;
};

export default AkiContext;
