import { NextRequest, NextResponse } from "next/server";
import { Client, resources } from "coinbase-commerce-node";

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, name, description } = await request.json();

    const apiKey = process.env.COINBASE_API_KEY;

    if (!apiKey) {
      console.warn("Coinbase API key missing, returning mock url");
      // Return a dummy URL that just refreshes the page or goes to a demo for now
      return NextResponse.json({
        hosted_url: "https://commerce.coinbase.com/checkout/demo",
        code: "MOCK_CODE",
      });
    }

    Client.init(apiKey);

    const chargeData = {
      name: name,
      description: description,
      local_price: {
        amount: amount.toString(),
        currency: currency || "USD",
      },
      pricing_type: "fixed_price",
      // Redirects after payment (requires managed pages or custom success page)
      // redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing/success`,
      // cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    };

    const charge = await resources.Charge.create(chargeData as any);

    return NextResponse.json({
      hosted_url: charge.hosted_url,
      code: charge.code,
    });
  } catch (error) {
    console.error("Error creating Coinbase charge:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
