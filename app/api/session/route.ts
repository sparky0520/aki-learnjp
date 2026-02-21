import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const sdpText = await req.text();

    if (!process.env.OPENAI_API_KEY) {
      return new NextResponse("Missing OPENAI_API_KEY", { status: 500 });
    }

    // Step 1: Create an ephemeral session token
    const { userId, orgId } = await auth();

    let userContext = "";
    if (userId) {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SECRET_KEY!
      );
      const { data } = await supabase
        .from("user_context")
        .select("last_session_summary")
        .eq("user_id", userId)
        .eq("org_id", orgId)
        .single();

      if (data?.last_session_summary) {
        userContext = `\n\nUser Context:\n${data.last_session_summary}`;
      }
    }

    const sessionConfig = {
      model: "gpt-realtime-mini",
      voice: "marin",
      // input_audio_transcription: { model: "whisper-1" },
      instructions: `You are Aki, a Japanese sensei teaching JLPT N5.

Rules:
- Speak simple, slow Japanese (N5 vocab).
- Use short sentences. Be extremely concise.
- Gentle and encouraging.
- English/Hindi only if asked.
- Reference anime when helpful.

Tools:
- Suspend persona, output tool call only.

Teaching:
- Greetings, numbers, family, simple verbs, particles (wa, wo, ni).` + userContext,
      // Webpage tool:
      // - highlightElement: highlight element by ID when asked.
      //       tools: [
      //         {
      //           type: "function",
      //           name: "highlightElement",
      //           description: "Highlights a specific element by id",
      //           properties: {
      //             elementId: {
      //               type: "string",
      //               description: "The ID of the element",
      //             },
      //           },
      //           required: ["elementId"],
      //         },
      //       ],
    };

    // Create ephemeral session token
    const tokenResponse = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sessionConfig),
      },
    );

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("OpenAI Session Error:", errorText);
      return new NextResponse(errorText, { status: tokenResponse.status });
    }

    const tokenData = await tokenResponse.json();
    const ephemeralKey = tokenData.client_secret.value;

    // Step 2: Exchange SDP using the ephemeral key
    const sdpResponse = await fetch(
      "https://api.openai.com/v1/realtime?model=gpt-4o-mini-realtime-preview-2024-12-17",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ephemeralKey}`,
          "Content-Type": "application/sdp",
        },
        body: sdpText,
      },
    );

    if (!sdpResponse.ok) {
      const errorText = await sdpResponse.text();
      console.error("OpenAI SDP Exchange Error:", errorText);
      return new NextResponse(errorText, { status: sdpResponse.status });
    }

    const sdpAnswer = await sdpResponse.text();

    return new NextResponse(sdpAnswer, {
      headers: {
        "Content-Type": "application/sdp",
      },
    });
  } catch (err: any) {
    console.error("Server error:", err);
    return new NextResponse(err.message, { status: 500 });
  }
}
