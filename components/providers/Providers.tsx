"use client";

import { AskAkiProvider } from "../../contexts/lesson/AkiContext";
import { AnswersProvider } from "../../contexts/lesson/AnswersContext";
import { LastAccessedProvider } from "../../contexts/lesson/LastAccessedContext";
import { AuthProvider } from "../../contexts/auth/AuthContext";

import { ProgressProvider } from "../../contexts/lesson/ProgressContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AskAkiProvider>
        <AnswersProvider>
          <LastAccessedProvider>
            <ProgressProvider>{children}</ProgressProvider>
          </LastAccessedProvider>
        </AnswersProvider>
      </AskAkiProvider>
    </AuthProvider>
  );
}
