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
import { API_URL } from "@/app/constants";

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

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const isResponseActiveRef = useRef(false);
  const currentContextRef = useRef<any>(null);
  const lastSentContextRef = useRef<string>("");
  const transcriptRef = useRef<string>("");

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

    // Update session instructions if session exists
    if (dcRef.current && dcRef.current.readyState === "open") {
      const langName = languageNames[lang] || "English";
      const instructionUpdate = {
        type: "session.update",
        session: {
          instructions: `Identity & Style: You are Aki, a friendly and experienced Japanese sensei. You're encouraging, use a mix of Japanese and English, and focus on practical usage. You provide helpful examples and clarify nuances. You love Japanese culture.
The student prefers explanations in ${langName}. Always respond or explain concepts primarily using this language when teaching Japanese.`,
        },
      };
      dcRef.current.send(JSON.stringify(instructionUpdate));
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
      console.log(`API URL: ${API_URL}`);

      // Create peer connection
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // Set up audio element for playback
      if (!audioRef.current) {
        audioRef.current = document.createElement("audio");
        audioRef.current.autoplay = true;
      }

      pc.ontrack = (e) => {
        console.log("Received remote track");
        if (audioRef.current) {
          audioRef.current.srcObject = e.streams[0];
        }
      };

      // Monitor connection state
      pc.onconnectionstatechange = () => {
        console.log("Connection state:", pc.connectionState);
      };

      // Get microphone access
      const ms = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      localStreamRef.current = ms;
      ms.getTracks().forEach((track) => pc.addTrack(track, ms));

      // Set up data channel for events
      const dc = pc.createDataChannel("oai-events");
      dcRef.current = dc;

      dc.addEventListener("open", () => {
        console.log("Data channel opened - Connected to OpenAI Realtime API");
        if (currentContextRef.current) {
          console.log("Sending cached context on connection");
          const langName = languageNames[languagePreference] || "English";
          const sessionUpdate = {
            type: "session.update",
            session: {
              instructions: `You are Aki, a patient Japanese sensei teaching JLPT N5 beginners.
                  
Current Lesson Context (JSON):
${JSON.stringify(currentContextRef.current, null, 2)}

Preferred Language for Explanations: ${langName}

Core Rules:
- Always speak simple, slow Japanese using N5 vocabulary only
- Use short sentences 
- Be gentle and encouraging
- Use ${langName} for explanations and if the student is confused
- Reference anime when helpful`,
            },
          };
          dc.send(JSON.stringify(sessionUpdate));
        }
      });

      dc.addEventListener("message", async (e) => {
        const msg = JSON.parse(e.data);
        console.log("Realtime Event:", msg.type);

        // Capture transcript
        if (msg.type === "conversation.item.input_audio_transcription.completed") {
          transcriptRef.current += `User: ${msg.transcript}\n`;
        } else if (msg.type === "response.audio_transcript.done") {
          transcriptRef.current += `Aki: ${msg.transcript}\n`;
        }

        // Track response lifecycle
        if (msg.type === "response.created") {
          isResponseActiveRef.current = true;
        } else if (msg.type === "response.done") {
          isResponseActiveRef.current = false;
        }

        // Handle function calls - Standard event type
        if (msg.type === "response.function_call_arguments.done") {
          await handleToolCall(msg.name, msg.arguments, msg.call_id);
        }
        // Handle function calls - Alternative event via output_item.done
        else if (
          msg.type === "response.output_item.done" &&
          msg.item?.type === "function_call"
        ) {
          await handleToolCall(
            msg.item.name,
            msg.item.arguments,
            msg.item.call_id,
          );
        }
      });

      dc.addEventListener("close", () => {
        console.log("Data channel closed - Disconnected from API");
      });

      dc.addEventListener("error", (error) => {
        console.error("Data channel error:", error);
      });

      // Create and send offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Wait for ICE gathering to complete
      await waitForIceGatheringComplete(pc);

      console.log("Sending SDP offer to server...");
      const sessionResponse = await fetch(`${API_URL}/session`, {
        method: "POST",
        body: pc.localDescription?.sdp,
        headers: {
          "Content-Type": "application/sdp",
        },
      });

      if (!sessionResponse.ok) {
        const errorText = await sessionResponse.text();
        throw new Error(`Failed to connect to server: ${errorText}`);
      }

      const answerSdp = await sessionResponse.text();
      const answer: RTCSessionDescriptionInit = {
        type: "answer",
        sdp: answerSdp,
      };

      await pc.setRemoteDescription(answer);
      console.log("WebRTC connection established successfully");
    } catch (error: any) {
      console.error("Connection error:", error);
      disconnect();
    }
  };

  // Helper to wait for ICE gathering to complete
  const waitForIceGatheringComplete = (
    pc: RTCPeerConnection,
  ): Promise<void> => {
    return new Promise((resolve) => {
      if (pc.iceGatheringState === "complete") {
        resolve();
      } else {
        const checkState = () => {
          if (pc.iceGatheringState === "complete") {
            pc.removeEventListener("icegatheringstatechange", checkState);
            resolve();
          }
        };
        pc.addEventListener("icegatheringstatechange", checkState);
      }
    });
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
        type: "conversation.item.create",
        item: {
          type: "function_call_output",
          call_id: callId,
          output: JSON.stringify(result),
        },
      };

      if (dcRef.current && dcRef.current.readyState === "open") {
        dcRef.current.send(JSON.stringify(event));
        // Trigger another response after tool output
        dcRef.current.send(JSON.stringify({ type: "response.create" }));
      }
    } catch (err) {
      console.error("Tool execution error:", err);
    }
  };

  const disconnect = useCallback(() => {
    if (transcriptRef.current.trim().length > 0) {
      console.log("Sending session transcript for summarization...");
      fetch(`${API_URL}/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: transcriptRef.current }),
      }).catch((err) => console.error("Failed to summarize session:", err));
    }
    transcriptRef.current = "";

    if (dcRef.current) {
      dcRef.current.close();
      dcRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.srcObject = null;
    }
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

    if (dcRef.current && dcRef.current.readyState === "open") {
      const sessionUpdate = {
        type: "session.update",
        session: {
          instructions: `You are Aki, a patient Japanese sensei teaching JLPT N5 beginners.
          
Current Lesson Context (JSON):
${JSON.stringify(context, null, 2)}

Preferred Language for Explanations: ${languagePreference === 'hi' ? 'Hindi' : languagePreference === 'ja' ? 'Japanese' : 'English'}

Core Rules:
- Always speak simple, slow Japanese using N5 vocabulary only
- Use short sentences 
- Be gentle and encouraging
- Use ${languagePreference === 'hi' ? 'Hindi' : languagePreference === 'ja' ? 'Japanese' : 'English'} for explanations and if the student is confused
- Reference anime when helpful

Tool Rules:
- When using tools: suspend persona completely, output only the tool call, no Japanese.`,
        },
      };
      console.log("Sending context update to model");
      dcRef.current.send(JSON.stringify(sessionUpdate));
    }
  }, []);

  const sendUserEvent = useCallback((type: string, data: any) => {
    if (dcRef.current && dcRef.current.readyState === "open") {
      const event = {
        type: "conversation.item.create",
        item: {
          type: "message",
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Event: ${type}\nData: ${JSON.stringify(data)}`,
            },
          ],
        },
      };
      dcRef.current.send(JSON.stringify(event));
      // Trigger response if it's an important event (like submitting an answer)
      if (type === "answer_submitted") {
        dcRef.current.send(JSON.stringify({ type: "response.create" }));
      }
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
