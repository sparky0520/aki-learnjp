import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Razorpay from "razorpay";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Get active subscription from DB
    const { data: sub, error: dbError } = await supabase
      .from("subscriptions")
      .select("subscription_id, status")
      .eq("user_id", userId)
      .in("status", ["active", "authenticated"])
      .single();

    if (dbError || !sub) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 },
      );
    }

    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      // Mock success
      return NextResponse.json({ status: "cancelled" });
    }

    const instance = new Razorpay({
      key_id: key_id,
      key_secret: key_secret,
    });

    // 2. Cancel on Razorpay (cancel at cycle end = false means immediate, true means end of cycle)
    // Usually preventing immediate cancellation refund logic is easier by setting cancel_at_cycle_end=true
    // But Razorpay API defaults: cancel(subId, cancelAtCycleEnd)

    await instance.subscriptions.cancel(sub.subscription_id, false);

    // 3. Update DB locally (Webhook will confirm later, but good to mark pending)
    await supabase
      .from("subscriptions")
      .update({ status: "cancelled" })
      .eq("subscription_id", sub.subscription_id);

    return NextResponse.json({ message: "Subscription cancelled" });
  } catch (error: any) {
    console.error("Error cancelling subscription:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
