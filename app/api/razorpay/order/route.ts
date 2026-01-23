import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request: NextRequest) {
  try {
    const { amount, currency } = await request.json();

    // Initialize Razorpay
    // If keys are missing, we'll return a mock order for demo purposes
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      console.warn("Razorpay keys missing, using mock order_id");
      return NextResponse.json({
        id: "order_mock_" + Math.random().toString(36).substring(7),
        amount: amount,
        currency: currency,
        status: "created",
      });
    }

    const instance = new Razorpay({
      key_id: key_id,
      key_secret: key_secret,
    });

    const options = {
      amount: Math.round(amount * 100), // Razorpay accepts amount in paise (smallest unit)
      currency: currency || "INR",
      receipt: "receipt#" + Date.now(),
    };

    const order = await instance.orders.create(options);

    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
