import { db } from "@/app/lib/db";
import { userSubscriptions } from "@/app/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Extract the event
    const event = body.data || body;
    const eventType = body.type;

    // Only process payment success events
    const paymentSuccessEvents = [
      "checkout.session.completed",
      "payment.succeeded",
      "subscription.active",
      "subscription.updated",
      "subscription.renewed",
    ];

    if (!paymentSuccessEvents.includes(eventType)) {
      return NextResponse.json({ received: true });
    }

    // Get the customer email from the payment
    const customerEmail =
      event.customer?.email ||
      event.customer_email ||
      event.email;

    if (!customerEmail) {
      console.error("Webhook: No customer email found");
      return NextResponse.json(
        { error: "No customer email found" },
        { status: 400 }
      );
    }

    // Look up user in Clerk by email
    const client = await clerkClient();
    const users = await client.users.getUserList({
      emailAddress: [customerEmail],
      limit: 1,
    });

    if (!users.data || users.data.length === 0) {
      console.error("Webhook: User not found for email:", customerEmail);
      return NextResponse.json(
        { error: "User not found" },
        { status: 400 }
      );
    }

    const userId = users.data[0].id;

    // Set subscription end date to 1 month from now
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

    // Get subscription IDs from event
    const subId = event.subscription_id || event.id || "manual_" + Date.now();
    const custId = event.customer?.customer_id || event.customer_id || "manual_" + Date.now();

    // Check if user already has a subscription
    const existingSub = await db
      .select()
      .from(userSubscriptions)
      .where(eq(userSubscriptions.userId, userId));

    if (existingSub.length > 0) {
      // Update existing subscription
      await db
        .update(userSubscriptions)
        .set({
          stripeCustomerId: custId,
          stripeSubscriptionId: subId,
          plan: "pro",
          currentPeriodEnd: subscriptionEndDate,
          pdfCount: 0,
          lastResetDate: new Date(),
        })
        .where(eq(userSubscriptions.userId, userId));
    } else {
      // Create new subscription
      await db.insert(userSubscriptions).values({
        userId,
        stripeCustomerId: custId,
        stripeSubscriptionId: subId,
        plan: "pro",
        currentPeriodEnd: subscriptionEndDate,
        pdfCount: 0,
        lastResetDate: new Date(),
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
