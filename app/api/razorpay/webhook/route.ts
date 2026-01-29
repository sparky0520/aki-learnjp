import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";
import { createClerkClient } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!secret || !signature) {
      // In dev without webhook setup, just log
      console.warn("Missing webhook secret or signature");
      return NextResponse.json({ status: "ignored" });
    }

    // specific validation logic
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);
    const { payload } = event;

    // We are interested in subscription events
    if (event.event.startsWith("subscription.")) {
      const subscription = payload.subscription.entity;
      const userId = subscription.notes?.userId;

      if (!userId) {
        console.error("No userId found in subscription notes");
        return NextResponse.json({ status: "ignored_no_user" });
      }

      const status = subscription.status; // active, halted, cancelled, completed, expired
      const planId = subscription.plan_id;

      // 1. Update Supabase
      const { error: dbError } = await supabase.from("subscriptions").upsert(
        {
          subscription_id: subscription.id,
          user_id: userId,
          plan_id: planId,
          status: status,
          current_period_end: new Date(
            subscription.current_end * 1000,
          ).toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "subscription_id" },
      );

      if (dbError) console.error("Supabase error:", dbError);

      // 2. Update Clerk Metadata
      const clerk = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY,
      });

      let isSubscribed = false;
      if (status === "active" || status === "authenticated") {
        isSubscribed = true;
      }

      await clerk.users.updateUserMetadata(userId, {
        publicMetadata: {
          isSubscribed: isSubscribed,
          planId: planId,
          subscriptionStatus: status,
        },
      });

      console.log(`Updated user ${userId} subscription status to ${status}`);
    }

    return NextResponse.json({ status: "success" });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
