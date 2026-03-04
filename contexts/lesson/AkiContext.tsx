"use client";

import React, {
  createContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { Room, RoomEvent, createLocalTracks, DataPacket_Kind } from "livekit-client";
import { API_URL } from "@/app/constants";
import { useContext } from "react";

export function useAki() {
  const context = useContext(AskAkiContext);
  return context;
}

type AskAkiContextType = {
  askAki: boolean;
  toggleAskAki: () => void;
  getClassName: (id: string, baseClass: string) => string;
  toggleHighlight: (id: string) => void;
  sendContextUpdate: (context: any) => void;
  sendUserEvent: (type: string, data: any) => void;
  languagePreference: string;
  setLanguagePreference: (lang: string) => void;
};

const AskAkiContext = createContext<AskAkiContextType | null>(null);

export function AskAkiProvider({ children }: { children: React.ReactNode }) {
  const [askAki, setAskAki] = useState(false);
  const [highlightState, setHighlightState] = useState<string[]>([]);
  const [languagePreference, setLanguagePreference] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("aki_language_preference") || "en";
    }
    return "en";
  });

  const roomRef = useRef<Room | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const transcriptRef = useRef<string>("");

  const isResponseActiveRef = useRef(false);
  const currentContextRef = useRef<any>(null);
  const lastSentContextRef = useRef<string>("");

  // Map of language codes to full names for consistent prompting
  const languageNames: Record<string, string> = {
    en: "English",
    hi: "Hindi",
    ja: "Japanese",
    mr: "Marathi",
    bn: "Bengali",
    te: "Telugu",
    ta: "Tamil",
    gu: "Gujarati",
    kn: "Kannada",
    ml: "Malayalam",
    pa: "Punjabi",
  };

  const handleSetLanguagePreference = (lang: string) => {
    setLanguagePreference(lang);
    localStorage.setItem("aki_language_preference", lang);

    if (roomRef.current?.localParticipant) {
      // Update metadata as JSON so the agent can parse it consistently
      const metadata = JSON.stringify({
        lang: lang,
        context: currentContextRef.current
      });
      roomRef.current.localParticipant.setMetadata(metadata);
    }
  };

  // Helper to toggle highlights
  const toggleHighlight = useCallback((id: string) => {
    setHighlightState((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id],
    );
  }, []);

  // --- Tool Definitions ---
  const tools = {
    highlightElement: tool(
      async ({ elementId }) => {
        toggleHighlight(elementId);
        return { success: true, elementId };
      },
      {
        name: "highlightElement",
        description: "Highlight a specific DOM element on the page by its ID.",
        schema: z.object({
          elementId: z.string().describe("The ID of the element to highlight"),
        }),
      },
    ),
  };

  const connectToRealtime = async () => {
    try {
      console.log(`Connecting to LiveKit...`);

      // 1. Get token from backend with initial context
      const initialMetadata = JSON.stringify({
        lang: languagePreference,
        context: currentContextRef.current,
      });

      const response = await fetch(`${API_URL}/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metadata: initialMetadata }),
      });
      if (!response.ok) throw new Error("Failed to get LiveKit token");
      const { token, url } = await response.json();

      // 2. Initialize Room
      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });
      roomRef.current = room;

      // 3. Handle Events
      room
        .on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
          if (track.kind === "audio") {
            const element = track.attach();
            document.body.appendChild(element);
          }
        })
        .on(RoomEvent.DataReceived, (payload, participant, kind, topic) => {
          const decoder = new TextDecoder();
          const str = decoder.decode(payload);
          try {
            const data = JSON.parse(str);
            console.log("LiveKit Data Record:", data);
            // Handle transcripts or events from agent here
          } catch (e) {
            console.log("LiveKit Data Message:", str);
          }
        });

      // 4. Connect and Publish
      await room.connect(url, token);
      console.log("Connected to room:", room.name);

      const localTracks = await createLocalTracks({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
        video: false,
      });

      for (const track of localTracks) {
        await room.localParticipant.publishTrack(track);
      }

      // 5. Send initial context via metadata or data channel
      if (currentContextRef.current) {
        const langName = languageNames[languagePreference] || "English";
        room.localParticipant.setMetadata(languagePreference);

        const msg = JSON.stringify({
          type: "context_update",
          context: currentContextRef.current,
          language: langName
        });
        console.log("[FRONTEND] Sending initial context to LiveKit agent:", msg);
        room.localParticipant.publishData(new TextEncoder().encode(msg), { reliable: true });
      }

    } catch (error: any) {
      console.error("Connection error:", error);
      disconnect();
    }
  };

  // Handle tool calls from the model
  const handleToolCall = async (
    toolName: string,
    args: any,
    callId: string,
  ) => {
    const toolInstance = tools[toolName as keyof typeof tools];

    if (!toolInstance) {
      console.error(`Unknown tool: ${toolName}`);
      return;
    }

    console.log(`Executing tool: ${toolName} with args:`, args);

    // Parse arguments if they're a string
    let parsedArgs = args;
    if (typeof args === "string") {
      try {
        parsedArgs = JSON.parse(args);
      } catch (e) {
        console.error("Failed to parse tool arguments JSON:", e);
        return;
      }
    }

    try {
      const result = await (toolInstance as any).invoke(parsedArgs);
      console.log("Tool result:", result);

      // Send tool output back to the model
      const event = {
        type: "tool_output",
        call_id: callId,
        output: JSON.stringify(result),
      };

      if (roomRef.current?.localParticipant) {
        roomRef.current.localParticipant.publishData(
          new TextEncoder().encode(JSON.stringify(event)),
          { reliable: true }
        );
      }
    } catch (err) {
      console.error("Tool execution error:", err);
    }
  };

  const disconnect = useCallback(() => {
    if (roomRef.current) {
      roomRef.current.disconnect();
      roomRef.current = null;
    }
    transcriptRef.current = "";
    isResponseActiveRef.current = false;
  }, []);

  useEffect(() => {
    return () => disconnect();
  }, [disconnect]);

  const sendContextUpdate = useCallback((context: any) => {
    // Deep comparison optimization
    const contextStr = JSON.stringify(context);
    if (contextStr === lastSentContextRef.current) {
      // console.log("Context unchanged, skipping update");
      return;
    }
    lastSentContextRef.current = contextStr;
    currentContextRef.current = context;

    if (roomRef.current?.localParticipant) {
      const langName = languageNames[languagePreference] || "English";
      const sessionUpdate = {
        type: "context_update",
        context: context,
        preferred_language: langName
      };
      console.log("[FRONTEND] Sending context update to LiveKit agent:", sessionUpdate);
      roomRef.current.localParticipant.publishData(
        new TextEncoder().encode(JSON.stringify(sessionUpdate)),
        { reliable: true }
      );
    }
  }, [languagePreference]);

  // Ensure language updates are sent to the agent immediately
  useEffect(() => {
    if (languagePreference && currentContextRef.current) {
      console.log("[FRONTEND] Language preference changed, re-syncing context...");
      sendContextUpdate(currentContextRef.current);
    }
  }, [languagePreference, sendContextUpdate]);

  const sendUserEvent = useCallback((type: string, data: any) => {
    if (roomRef.current?.localParticipant) {
      const event = {
        type: "user_event",
        event_type: type,
        data: data
      };
      console.log("[FRONTEND] Sending user event to LiveKit agent:", event);
      roomRef.current.localParticipant.publishData(
        new TextEncoder().encode(JSON.stringify(event)),
        { reliable: true }
      );
    }
  }, []);

  /*
  const explainCurrentPage = useCallback(() => {
    if (!dcRef.current || dcRef.current.readyState !== "open") {
      console.warn("Data channel not ready, cannot send session update");
      return;
    }

    // Check if a response is already active
    if (isResponseActiveRef.current) {
      console.warn("Response already active, queuing page explanation");
      setTimeout(() => explainCurrentPage(), 1000);
      return;
    }

    // Get the current page HTML
    const pageHTML = document.body.innerHTML;

    // Send session update with instructions to explain the page
    const sessionUpdate = {
      type: "session.update",
      session: {
        instructions: `You are a natural, friendly language teacher having a voice conversation with your student. 

The student has just navigated to a new page or exercise in the language learning app. Here is the current page content:

${pageHTML}

Your task:
1. Analyze the page content to understand what lesson, exercise, or topic is being presented
2. Immediately start explaining this content to the student in a natural, conversational way - just like a real teacher would when introducing a new topic in class
3. Be warm, encouraging, and pedagogical in your approach
4. Keep your explanation concise but thorough (30-60 seconds)
5. At the end, invite the student to ask questions or let you know when they're ready to proceed

IMPORTANT: 
- Respond ONLY in audio/speech - do not use text
- Start explaining immediately without waiting for the user to ask
- Be natural and conversational, as if you're in a real classroom
- Focus on making the content clear and engaging`,
      },
    };

    console.log("Sending session update to explain page");
    dcRef.current.send(JSON.stringify(sessionUpdate));

    // Trigger a response from the model
    dcRef.current.send(JSON.stringify({ type: "response.create" }));

    // Mark response as active
    isResponseActiveRef.current = true;
  }, []);
  */

  const toggleAskAki = useCallback(() => {
    if (askAki) {
      setAskAki(false);
      disconnect();
    } else {
      setAskAki(true);
      connectToRealtime();
    }
  }, [askAki, disconnect]);

  const getClassName = useCallback(
    (id: string, baseClass: string) => {
      return highlightState?.includes(id)
        ? `${baseClass} bg-yellow-400`
        : baseClass;
    },
    [highlightState],
  );

  return (
    <AskAkiContext.Provider
      value={{
        askAki,
        toggleAskAki,
        getClassName,
        toggleHighlight,
        sendContextUpdate,
        sendUserEvent,
        languagePreference,
        setLanguagePreference: handleSetLanguagePreference,
      }}
    >
      {children}
    </AskAkiContext.Provider>
  );
}

export default AskAkiContext;
