import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get user's primary email from Clerk
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const userEmail = user.primaryEmailAddress?.emailAddress;

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    const origin =
      process.env.NEXT_BASE_URL || req.headers.get("origin") || "http://localhost:3000";

    // Build checkout URL with email parameter
    const checkoutUrl = `${process.env.DODO_CHECKOUT_URL}?email=${encodeURIComponent(
      userEmail
    )}&return_url=${encodeURIComponent(
      `${origin}/dashboard`
    )}&redirect_url=${encodeURIComponent(`${origin}/dashboard`)}`;

    return NextResponse.json({ url: checkoutUrl });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

