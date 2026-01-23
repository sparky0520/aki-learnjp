"use client";

import { AskAkiProvider } from "@/contexts/AkiContext";
import { AnswersProvider } from "@/contexts/AnswersContext";
import { LastAccessedProvider } from "@/contexts/LastAccessedContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AskAkiProvider>
      <AnswersProvider>
        <LastAccessedProvider>
          {children}
        </LastAccessedProvider>
      </AnswersProvider>
    </AskAkiProvider>
  );
}
