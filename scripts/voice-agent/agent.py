import asyncio
import logging
from dotenv import load_dotenv
from livekit.agents import JobContext, WorkerOptions, cli, voice_assistant
from livekit.plugins import openai, deepgram, azure

load_dotenv()

logger = logging.getLogger("aki-agent")
logger.setLevel(logging.INFO)

async def entrypoint(ctx: JobContext):
    # Initial config (default: English)
    initial_ctx = openai.ChatContext().append(
        role="system",
        text=(
            "You are Aki, a friendly Japanese sensei teaching JLPT N5. "
            "Speak simple, slow Japanese. Use short sentences. "
            "Explanations should be in the student's preferred language. "
            "Identity: Patient, encouraging, loves anime."
        ),
    )

    await ctx.connect()

    # Create the assistant with default providers
    # We use Deepgram for STT as it's very fast and supports multiple languages.
    # We use Azure for TTS as it has excellent natural voices for Indian languages and Japanese.
    assistant = voice_assistant.VoiceAssistant(
        vad=openai.VAD.load(),
        stt=deepgram.STT(),
        llm=openai.LLM(
            model="gpt-4o-mini", # Use OpenAI for now, can switch to Grok via base_url
        ),
        tts=azure.TTS(voice="en-IN-NeerjaNeural"), # Default Indian English
        chat_context=initial_ctx,
    )

    assistant.start(ctx.room)

    # Listen for changes in room metadata to update the student's mother tongue
    @ctx.room.on("participant_metadata_changed")
    def on_metadata_changed(participant, _):
        if participant.identity == ctx.room.local_participant.identity:
            return
            
        metadata = participant.metadata
        if not metadata:
            return
            
        # Example: metadata = "hi" (Hindi)
        # In a real app, you'd parse JSON metadata
        if metadata == "hi":
            assistant.tts = azure.TTS(voice="hi-IN-SwaraNeural")
            assistant.chat_context.append(
                role="system",
                text="The student's preferred language for explanations is now Hindi."
            )
        elif metadata == "ja":
            assistant.tts = azure.TTS(voice="ja-JP-NanamiNeural")
            assistant.chat_context.append(
                role="system",
                text="The student's preferred language for explanations is now Japanese."
            )
        # Add more languages here...

    await assistant.say("Konnichiwa! I am Aki. How can I help you today?")

if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))
