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
    // Use origin from request headers as base URL fallback
    const origin = process.env.NEXT_BASE_URL || req.headers.get("origin") || "http://localhost:3000";

    const checkoutSession = {
      url: `${process.env.DODO_CHECKOUT_URL}&metadata[userId]=${userId}&return_url=${encodeURIComponent(`${origin}/dashboard`)}&redirect_url=${encodeURIComponent(`${origin}/dashboard`)}`,
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