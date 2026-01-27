"use client";

import { AskAkiProvider } from "../contexts/AkiContext";
import { AnswersProvider } from "../contexts/AnswersContext";
import { LastAccessedProvider } from "../contexts/LastAccessedContext";
import { AuthProvider } from "../contexts/AuthContext";

import { ProgressProvider } from "../contexts/ProgressContext";

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
