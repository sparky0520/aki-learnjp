import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function GET() {
  try {
    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json(
        { error: "Razorpay keys missing" },
        { status: 500 },
      );
    }

    const instance = new Razorpay({
      key_id: key_id,
      key_secret: key_secret,
    });

    // Create Basic Plan
    const basicPlan = await instance.plans.create({
      period: "monthly",
      interval: 1,
      item: {
        name: "Aki Basic Plan",
        amount: 1999, // $19.99 in cents
        currency: "USD",
        description: "Access to Basic features",
      },
    });

    // Create Premium Plan
    const premiumPlan = await instance.plans.create({
      period: "monthly",
      interval: 1,
      item: {
        name: "Aki Premium Plan",
        amount: 2999, // $29.99
        currency: "USD",
        description: "Access to Premium features",
      },
    });

    return NextResponse.json({
      message: "Plans created successfully",
      basic_plan_id: basicPlan.id,
      premium_plan_id: premiumPlan.id,
      note: "Please copy these IDs to your .env file as BASIC_PLAN_ID and PREMIUM_PLAN_ID",
    });
  } catch (error: any) {
    console.error("Error creating plans:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
