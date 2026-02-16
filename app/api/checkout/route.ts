// app/api/checkout/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Initialize Dodo Payments checkout
    // Replace with actual Dodo Payments API call
    const checkoutSession = {
      url: `${process.env.DODO_CHECKOUT_URL}?price=${process.env.DODO_PRICE_ID}&metadata[userId]=${userId}`,
    };

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}