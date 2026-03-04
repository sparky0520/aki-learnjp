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
        console.log(`[AGENT] Connected to room: ${ctx.room.name}`);

        const initialContext = new llm.ChatContext();
        initialContext.addMessage({
            role: 'system',
            content: `You are Aki, a patient Japanese sensei teaching JLPT N5. 
      Speak simple, slow Japanese. Use short sentences. 
      Explanations should be in the student's preferred language. 
      Identity: Patient, encouraging, loves anime.`,
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

        // Initialize session placeholders
        let session: voice.AgentSession;

        // Function to wait for and parse initial metadata
        const getInitialMetadata = async () => {
            let human = null;
            let retries = 0;
            const maxRetries = 15; // Wait up to 7.5 seconds

            while (!human && retries < maxRetries) {
                human = Array.from(ctx.room.remoteParticipants.values()).find(p => p.identity.startsWith('user-'));
                if (!human || !human.metadata) {
                    await new Promise(resolve => setTimeout(resolve, 500));
                    retries++;
                } else {
                    break;
                }
            }

            if (human?.metadata) {
                try {
                    const data = JSON.parse(human.metadata);
                    console.log(`[AGENT] Parsed metadata:`, data);
                    return {
                        lang: data.lang || data.language || human.metadata,
                        context: data.context
                    };
                } catch (e) {
                    console.warn("[AGENT] Failed to parse initial metadata as JSON, using raw string", human.metadata);
                    return { lang: human.metadata, context: null };
                }
            }
            return { lang: 'en', context: null };
        };

        // 1. Get metadata BEFORE starting the session
        const { lang, context } = await getInitialMetadata();
        const langName = languageNames[lang] || lang || 'English';
        console.log(`[AGENT] Initializing with lang=${langName}, contextPresent=${!!context}`);

        // 2. Build initial instructions
        let instructions = 'You are Aki, a patient Japanese sensei teaching JLPT N5. Speak simple, slow Japanese. Use short sentences. Explanations should be in the student\'s preferred language. Identity: Patient, encouraging, loves anime.';
        let greeting = "Konnichiwa! I am Aki. I am ready to help you learn Japanese! What shall we do today?";

        if (context?.lesson) {
            const lesson = context.lesson;
            const question = context.question;
            instructions = `
You are Aki, a patient Japanese sensei teaching JLPT N5.
Current Lesson: ${lesson.name} (${lesson.japanese})
Lesson Goal: ${lesson.structure_explanation}
Aki's Guide: ${lesson.aki_realtime_script}

${question ? `Current Question: ${JSON.stringify(question)}` : ''}

Maintain your persona: patient, encouraging, loves anime.
Speak simple, slow Japanese. Explanations in ${langName}.
`;
            greeting = `Konnichiwa! I am Aki. I see we are starting the lesson on ${lesson.japanese}. I will explain things in ${langName}. How can I help you?`;
        } else {
            initialContext.addMessage({
                role: 'system',
                content: `The student's preferred language for explanations is ${langName}.`
            });
        }

        // 3. Create the agent with correct initial state
        const agent = new voice.Agent({
            instructions: instructions,
            stt: new deepgram.STT(),
            llm: new openai.LLM({ model: 'gpt-4o-mini' }),
            tts: new elevenlabs.TTS({ voiceId: langVoiceMap[lang] || langVoiceMap['en'] }),
            chatCtx: initialContext,
        });

        session = new voice.AgentSession({
            stt: agent.stt,
            llm: agent.llm,
            tts: agent.tts,
        });

        // 4. Start session and greet
        await session.start({ agent, room: ctx.room });
        await session.say(greeting);

        // Handle dynamic updates from the room (metadata-based)
        ctx.room.on(RoomEvent.ParticipantMetadataChanged, (_prevMetadata, participant) => {
            if (participant?.identity === ctx.room.localParticipant.identity) return;
            if (!participant.identity.startsWith('user-') || !participant.metadata) return;

            console.log(`[AGENT] ParticipantMetadataChanged: ${participant.identity}`);
            try {
                const data = JSON.parse(participant.metadata);
                const lang = data.lang || data.language;

                if (lang && langVoiceMap[lang]) {
                    console.log(`[AGENT] Updating voice to: ${lang}`);
                    session.tts = new elevenlabs.TTS({ voiceId: langVoiceMap[lang] });
                    session.history.addMessage({
                        role: 'system',
                        content: `The student's preferred language for explanations is now ${languageNames[lang] || lang}.`
                    });
                }
            } catch (e) {
                // Fallback for raw string metadata
                const lang = participant.metadata;
                if (langVoiceMap[lang]) {
                    session.tts = new elevenlabs.TTS({ voiceId: langVoiceMap[lang] });
                }
            }
        });

        // Handle session updates via data channel
        ctx.room.on(RoomEvent.DataReceived, (payload, participant, _kind, _topic) => {
            if (participant?.identity === ctx.room.localParticipant.identity) return;

            const decoder = new TextDecoder();
            const dataStr = decoder.decode(payload);
            try {
                const data = JSON.parse(dataStr);
                if (data.type === 'session.update' || data.type === 'context_update') {
                    const context = data.context;
                    const lang = data.preferred_language || data.language || data.lang;

                    if (lang && langVoiceMap[lang]) {
                        session.tts = new elevenlabs.TTS({ voiceId: langVoiceMap[lang] });
                    }

                    if (context?.lesson) {
                        const lesson = context.lesson;
                        const question = context.question;
                        const currentLang = languageNames[lang] || lang || langName;

                        const newInstructions = `
You are Aki, a patient Japanese sensei teaching JLPT N5.
Current Lesson: ${lesson.name} (${lesson.japanese})
Lesson Goal: ${lesson.structure_explanation}
Aki's Guide: ${lesson.aki_realtime_script}

${question ? `Current Question: ${JSON.stringify(question)}` : ''}

Maintain your persona: patient, encouraging, loves anime.
Speak simple, slow Japanese. Explanations in ${currentLang}.
`;
                        session.updateAgent(new voice.Agent({
                            instructions: newInstructions,
                            stt: session.stt!,
                            llm: session.llm!,
                            tts: session.tts!,
                            chatCtx: session.history,
                        }));
                    }
                }
            } catch (e) {
                console.warn("[AGENT] Failed to parse data message", e);
            }
        });
    },
});

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename || process.argv[1]?.endsWith('agent.ts')) {
    cli.runApp(new WorkerOptions({ agent: __filename }));
}
