"use client";

import React from "react";
import questionScripts from "@/question_type_scripts.json";

interface AkiContextProps {
  questionType: keyof typeof questionScripts.question_types;
  lessonAboutContent?: string;
  currentQuestion?: unknown;
  correctAnswer?: unknown;
}

const AkiContext: React.FC<AkiContextProps> = ({
  questionType,
  lessonAboutContent,
  currentQuestion,
  correctAnswer,
}) => {
  const typeData = questionScripts.question_types[questionType];

  return (
    <div id="aki-context" style={{ display: "none" }}>
      <script
        id="aki-context-type"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(typeData) }}
      />
      {lessonAboutContent && (
        <div id="aki-context-lesson-about">{lessonAboutContent}</div>
      )}
      {currentQuestion && (
        <script
          id="aki-context-question"
          type="application/json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(currentQuestion) }}
        />
      )}
      {correctAnswer && (
        <script
          id="aki-context-answer"
          type="application/json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(correctAnswer) }}
        />
      )}
    </div>
  );
};

export default AkiContext;
