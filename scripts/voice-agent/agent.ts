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

        // Voice mapping for ElevenLabs (Example IDs, replace with your preferred ones)
        const langVoiceMap: Record<string, string> = {
            hi: 'pNInz6obpgmqEHCBUM9G', // Representative Hindi-like voice
            mr: 'TxGEqnSAs9VkoYpYEY9q',
            bn: 'pNInz6obpgmqEHCBUM9G',
            ja: 'AZnzp1LfhjBvDGo8RK8f', // Japanese voice
            en: '21m00Tcm4T7sXD67SqrW', // Standard English
        };

        await session.start({ agent, room: ctx.room });

        ctx.room.on(RoomEvent.ParticipantMetadataChanged, (metadata, participant) => {
            if (participant?.identity === ctx.room.localParticipant.identity) return;

            const lang = metadata;
            if (lang && langVoiceMap[lang]) {
                console.log(`Setting ElevenLabs voice for language: ${lang}`);
                session.tts = new elevenlabs.TTS({ voiceId: langVoiceMap[lang] });
                session.chatCtx.addMessage({
                    role: 'system',
                    content: `The student's preferred language for explanations is now ${lang}.`
                });
            }
        });

        await session.say("Konnichiwa! I am Aki. How can I help you today?");
    },
});

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename || process.argv[1]?.endsWith('agent.ts')) {
    cli.runApp(new WorkerOptions({ agent: __filename }));
}
