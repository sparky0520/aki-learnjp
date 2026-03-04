import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET) {
      return new NextResponse("Missing LiveKit keys", { status: 500 });
    }

    const { userId, orgId } = await auth();
    
    // Generate a unique room name for the user/session
    const roomName = `room-${userId || 'anon'}-${Date.now()}`;
    const participantName = `user-${userId || 'anon'}`;

    // Create a token
    const at = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_API_SECRET,
      {
        identity: participantName,
        name: participantName,
      }
    );

    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const token = await at.toJwt();

    return NextResponse.json({
      token,
      url: process.env.LIVEKIT_URL || "wss://aki-livekit.livekit.cloud", // Placeholder or from env
      roomName,
    });
  } catch (err: any) {
    console.error("Server error:", err);
    return new NextResponse(err.message, { status: 500 });
  }
}
