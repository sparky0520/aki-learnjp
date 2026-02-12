import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Razorpay from "razorpay";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId } = await request.json();
    if (!planId) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 },
      );
    }

    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      // Mock for development if keys are missing
      console.warn("Razorpay keys missing, using mock subscription");
      return NextResponse.json({
        id: "sub_mock_" + Math.random().toString(36).substring(7),
        entity: "subscription",
        plan_id: planId,
        status: "created",
      });
    }

    const instance = new Razorpay({
      key_id: key_id,
      key_secret: key_secret,
    });

    // Create Subscription
    console.log(`Creating subscription for Plan ID: ${planId}`);

    // Validate planId format (basic check)
    if (!planId.startsWith("plan_")) {
      console.warn(`Invalid Plan ID format: ${planId}`);
    }

    const subscription = await instance.subscriptions.create({
      plan_id: planId,
      customer_notify: 1,
      total_count: 120, // 10 years monthly
      quantity: 1,
      notes: {
        userId: userId, // Important: Store userId in notes for webhook to identify user
      },
    });

    return NextResponse.json(subscription);
  } catch (error: any) {
    console.error("Error creating subscription:", error);
    // Enhanced error logging
    if (error.error && error.error.description) {
      console.error("Razorpay Error Description:", error.error.description);
    }

    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

