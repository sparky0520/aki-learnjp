"use client";

import { AskAkiProvider } from "../contexts/AkiContext";
import { AnswersProvider } from "../contexts/AnswersContext";
import { LastAccessedProvider } from "../contexts/LastAccessedContext";
import { AuthProvider } from "../contexts/AuthContext";

import { LayoutProvider } from "../contexts/LayoutContext";
import { ProgressProvider } from "../contexts/ProgressContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AskAkiProvider>
        <AnswersProvider>
          <LastAccessedProvider>
            <ProgressProvider>
              <LayoutProvider>{children}</LayoutProvider>
            </ProgressProvider>
          </LastAccessedProvider>
        </AnswersProvider>
      </AskAkiProvider>
    </AuthProvider>
  );
}
