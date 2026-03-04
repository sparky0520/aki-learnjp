import {
    type JobContext,
    WorkerOptions,
    cli,
    defineAgent,
    llm,
    voice,
} from '@livekit/agents';
import * as deepgram from '@livekit/agents-plugin-deepgram';
import * as openai from '@livekit/agents-plugin-openai';
import * as elevenlabs from '@livekit/agents-plugin-elevenlabs';
import { RoomEvent } from 'livekit-client';
import 'dotenv/config';
import { fileURLToPath } from 'node:url';

export default defineAgent({
    entry: async (ctx: JobContext) => {
        await ctx.connect();

        const initialContext = new llm.ChatContext();
        initialContext.addMessage({
            role: 'system',
            content: `You are Aki, a patient Japanese sensei teaching JLPT N5. 
      Speak simple, slow Japanese. Use short sentences. 
      Explanations should be in the student's preferred language. 
      Identity: Patient, encouraging, loves anime.`,
        });

        const agent = new voice.Agent({
            instructions: 'You are Aki, a patient Japanese sensei teaching JLPT N5. Speak simple, slow Japanese. Use short sentences. Explanations should be in the student\'s preferred language. Identity: Patient, encouraging, loves anime.',
            stt: new deepgram.STT(),
            llm: new openai.LLM({
                model: 'gpt-4o-mini',
            }),
            tts: new elevenlabs.TTS(), // Uses ELEVEN_API_KEY from .env
            chatCtx: initialContext,
        });

        const session = new voice.AgentSession({
            stt: agent.stt,
            llm: agent.llm,
            tts: agent.tts,
        });

        const langVoiceMap: Record<string, string> = {
            hi: 'cgSgspJ2msm6clMCkdW9', // Hindi - Aria
            mr: 'TxGEqnSAs9VkoYpYEY9q', // Marathi - Liam
            bn: 'cgSgspJ2msm6clMCkdW9', // Bengali - Aria
            ja: 'AZnzp1LfhjBvDGo8RK8f', // Japanese - Nicole
            en: '21m00Tcm4T7sXD67SqrW', // English - Rachel
            ta: 'cgSgspJ2msm6clMCkdW9', // Tamil - Aria
            te: 'cgSgspJ2msm6clMCkdW9', // Telugu - Aria
            gu: 'cgSgspJ2msm6clMCkdW9', // Gujarati - Aria
            kn: 'cgSgspJ2msm6clMCkdW9', // Kannada - Aria
            ml: 'cgSgspJ2msm6clMCkdW9', // Malayalam - Aria
            pa: 'cgSgspJ2msm6clMCkdW9', // Punjabi - Aria
        };

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

        // Check for initial metadata of the human participant if already present
        const handleInitialMetadata = () => {
            const human = Array.from(ctx.room.remoteParticipants.values()).find(p => p.identity.startsWith('user-'));
            if (human?.metadata) {
                try {
                    const data = JSON.parse(human.metadata);
                    const lang = data.lang || data.language || human.metadata;
                    const context = data.context;

                    console.log(`[AGENT] Detected initial metadata language: ${lang}`);

                    if (langVoiceMap[lang]) {
                        session.tts = new elevenlabs.TTS({ voiceId: langVoiceMap[lang] });
                    }

                    if (context) {
                        console.log("[AGENT] Applying initial lesson context from metadata");
                        const lesson = context.lesson;
                        const question = context.question;

                        const newInstructions = `
You are Aki, a patient Japanese sensei teaching JLPT N5.
Current Lesson: ${lesson.name} (${lesson.japanese})
Lesson Goal: ${lesson.structure_explanation}
Aki's Guide: ${lesson.aki_realtime_script}

${question ? `Current Question: ${JSON.stringify(question)}` : ''}

Maintain your persona: patient, encouraging, loves anime.
Speak simple, slow Japanese. Explanations in ${languageNames[lang] || lang || 'the student\'s preferred language'}.
`;
                        // Update the agent with these instructions
                        const updatedAgent = new voice.Agent({
                            instructions: newInstructions,
                            stt: session.stt!,
                            llm: session.llm!,
                            tts: session.tts!,
                            chatCtx: session.history,
                        });
                        session.updateAgent(updatedAgent);
                    } else if (langVoiceMap[lang]) {
                        const langName = languageNames[lang] || lang;
                        session.history.addMessage({
                            role: 'system',
                            content: `The student's preferred language for explanations is ${langName}.`
                        });
                    }
                } catch (e) {
                    // Fallback if metadata is not JSON (legacy or simple string)
                    const lang = human.metadata;
                    if (langVoiceMap[lang]) {
                        session.tts = new elevenlabs.TTS({ voiceId: langVoiceMap[lang] });
                        const langName = languageNames[lang] || lang;
                        session.history.addMessage({
                            role: 'system',
                            content: `The student's preferred language for explanations is ${langName}.`
                        });
                    }
                }
            }
        };

        await session.start({ agent, room: ctx.room });
        handleInitialMetadata();

        // Handle dynamic updates from the room (metadata-based)
        ctx.room.on(RoomEvent.ParticipantMetadataChanged, (_prevMetadata, participant) => {
            console.log(`[AGENT] ParticipantMetadataChanged: ${participant.identity} has metadata: ${participant.metadata}`);
            if (participant?.identity === ctx.room.localParticipant.identity) return;

            const lang = participant.metadata;
            if (lang && langVoiceMap[lang]) {
                console.log(`[AGENT] Setting ElevenLabs voice for language: ${lang}`);

                // Update the session's TTS directly for immediate effect
                session.tts = new elevenlabs.TTS({ voiceId: langVoiceMap[lang] });

                session.history.addMessage({
                    role: 'system',
                    content: `The student's preferred language for explanations is now ${lang}.`
                });
            }
        });

        // Handle session updates via data channel (e.g., from AkiContext.tsx)
        ctx.room.on(RoomEvent.DataReceived, (payload, participant, kind, topic) => {
            if (participant?.identity === ctx.room.localParticipant.identity) return;

            const decoder = new TextDecoder();
            const dataStr = decoder.decode(payload);
            console.log(`[AGENT] DataReceived from ${participant?.identity}. Type: ${dataStr.slice(0, 100)}...`);

            try {
                const data = JSON.parse(dataStr);

                if (data.type === 'session.update' || data.type === 'context_update') {
                    const context = data.context;
                    const instructions = data.session?.instructions || context?.instructions;
                    const lang = data.preferred_language || data.language;

                    // Update voice if language is provided in data channel
                    if (lang && langVoiceMap[lang]) {
                        console.log(`[AGENT] Setting ElevenLabs voice from data channel: ${lang}`);
                        session.tts = new elevenlabs.TTS({ voiceId: langVoiceMap[lang] });
                    }

                    if (context || instructions) {
                        console.log("[AGENT] Updating agent context/instructions via data channel");

                        let newInstructions = instructions || agent.instructions;

                        if (context?.lesson) {
                            const lesson = context.lesson;
                            const question = context.question;

                            newInstructions = `
You are Aki, a patient Japanese sensei teaching JLPT N5.
Current Lesson: ${lesson.name} (${lesson.japanese})
Lesson Goal: ${lesson.structure_explanation}
Aki's Guide: ${lesson.aki_realtime_script}

${question ? `Current Question: ${JSON.stringify(question)}` : ''}

Maintain your persona: patient, encouraging, loves anime.
Speak simple, slow Japanese. Explanations in ${lang || 'the student\'s preferred language'}.
`;
                        }

                        // Create a new agent with updated instructions but keep existing context/models
                        const updatedAgent = new voice.Agent({
                            instructions: newInstructions,
                            stt: session.stt!,
                            llm: session.llm!,
                            tts: session.tts!, // Use the (potentially updated) TTS
                            chatCtx: session.history,
                        });

                        session.updateAgent(updatedAgent);
                    }
                }

                // Handle other custom events
                if (data.type === 'user_event') {
                    console.log(`[AGENT] Received user event: ${data.event_type}`, data.data);
                }

            } catch (e) {
                console.warn("[AGENT] Failed to parse data message as JSON", dataStr);
            }
        });

        await session.say("Konnichiwa! I am Aki. How can I help you today?");
    },
});

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename || process.argv[1]?.endsWith('agent.ts')) {
    cli.runApp(new WorkerOptions({ agent: __filename }));
}
