import {
    type JobContext,
    WorkerOptions,
    cli,
    defineAgent,
    llm,
    voice,
} from '@livekit/agents';
import * as deepgram from '@livekit/agents-plugin-deepgram';
import * as google from '@livekit/agents-plugin-google';
import * as openai from '@livekit/agents-plugin-openai';
import { RoomEvent } from 'livekit-client';
import 'dotenv/config';
import { fileURLToPath } from 'node:url';

export default defineAgent({
    entry: async (ctx: JobContext) => {
        await ctx.connect();
        console.log(`[AGENT] Connected to room: ${ctx.room.name}`);

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

        // Permanent Persona Instructions
        const baseInstructions = `You are Aki, a patient Japanese sensei teaching JLPT N5. 
Maintain your persona: patient, encouraging, loves anime.
Speak simple, slow Japanese. Use short sentences. 
Explanations should be in the student's preferred language. 
Keep explanations brief and focused (1-2 sentences max unless the student asks for more detail).
Focus on the current lesson and question provided in the conversation history.`;

        let session: voice.AgentSession;

        const getInitialMetadata = async () => {
            let human = null;
            let retries = 0;
            const maxRetries = 15;
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
                    return {
                        lang: data.lang || data.language || 'en',
                        context: data.context
                    };
                } catch (e) {
                    return { lang: human.metadata, context: null };
                }
            }
            return { lang: 'en', context: null };
        };

        // 1. Get initial context
        const { lang, context } = await getInitialMetadata();
        const langName = languageNames[lang] || lang || 'English';

        const chatCtx = new llm.ChatContext();
        chatCtx.addMessage({ role: 'system', content: baseInstructions });
        chatCtx.addMessage({ role: 'system', content: `The student's preferred language for explanations is ${langName}.` });

        let greeting = "Konnichiwa! I am Aki. I am ready to help you learn Japanese! What shall we do today?";

        if (context?.lesson) {
            const lesson = context.lesson;
            const question = context.question;
            chatCtx.addMessage({
                role: 'system',
                content: `Current Lesson: ${lesson.name} (${lesson.japanese}). Goal: ${lesson.structure_explanation}. Aki's Guide: ${lesson.aki_realtime_script}. ${question ? `Current Question: ${JSON.stringify(question)}` : ''}`
            });
            greeting = `Konnichiwa! I am Aki. I see we are starting the lesson on ${lesson.japanese}. I will explain things in ${langName}. How can I help you?`;
        }

        // 2. Initialize Agent & Session
        const agent = new voice.Agent({
            instructions: baseInstructions,
            stt: new deepgram.STT(),
            llm: new openai.LLM({ model: 'gpt-4o-mini' }),
            // Keep a single multilingual TTS instance for the entire session.
            tts: new google.beta.TTS(),
            chatCtx: chatCtx,
        });

        session = new voice.AgentSession({
            stt: agent.stt,
            llm: agent.llm,
            tts: agent.tts,
        });

        await session.start({ agent, room: ctx.room });
        await session.say(greeting);

        // Handle metadata updates by changing explanation context only.
        ctx.room.on(RoomEvent.ParticipantMetadataChanged, (_prevMetadata, participant) => {
            if (participant?.identity === ctx.room.localParticipant.identity) return;
            if (!participant.identity.startsWith('user-') || !participant.metadata) return;

            try {
                const data = JSON.parse(participant.metadata);
                const lang = data.lang || data.language;
                if (lang) {
                    console.log(`[AGENT] Instant language update: ${lang}`);
                    session.history.addMessage({
                        role: 'system',
                        content: `[CONTEXT UPDATE] The student's preferred language for explanations is now ${languageNames[lang] || lang}.`
                    });
                }
            } catch (e) {
                const lang = participant.metadata;
                if (lang) {
                    session.history.addMessage({
                        role: 'system',
                        content: `[CONTEXT UPDATE] The student's preferred language for explanations is now ${languageNames[lang] || lang}.`
                    });
                }
            }
        });

        // Handle Data Channel updates (Instant Context Injection)
        ctx.room.on(RoomEvent.DataReceived, (payload, participant, _kind, _topic) => {
            if (participant?.identity === ctx.room.localParticipant.identity) return;

            const decoder = new TextDecoder();
            const dataStr = decoder.decode(payload);
            try {
                const data = JSON.parse(dataStr);
                if (data.type === 'session.update' || data.type === 'context_update') {
                    const context = data.context;
                    const lang = data.language || data.lang;

                    if (lang) {
                        session.history.addMessage({
                            role: 'system',
                            content: `[CONTEXT UPDATE] The student's preferred language for explanations is now ${languageNames[lang] || lang}.`
                        });
                    }

                    if (context?.lesson) {
                        const lesson = context.lesson;
                        const question = context.question;
                        console.log(`[AGENT] Instant context injection: ${lesson.name}`);

                        session.history.addMessage({
                            role: 'system',
                            content: `[CONTEXT UPDATE] Current Lesson: ${lesson.name} (${lesson.japanese}). Goal: ${lesson.structure_explanation}. Aki's Guide: ${lesson.aki_realtime_script}. ${question ? `Current Question: ${JSON.stringify(question)}` : ''}`
                        });
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
