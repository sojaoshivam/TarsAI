import { db } from "@/app/lib/db";
import { userSubscriptions } from "@/app/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { verifyDodoSignature, getWebhookSecret } from "@/app/lib/webhook-verification";

export async function POST(req: Request) {
  console.log("🚀 WEBHOOK POST RECEIVED!");

  try {
    const body = await req.text();

    // Verify webhook signature
    const headersList = await headers();
    const signature = headersList.get('x-signature') || headersList.get('stripe-signature') || '';
    const webhookSecret = getWebhookSecret('dodo');

    if (!webhookSecret) {
      console.error('Webhook secret not configured');
      return new NextResponse('Webhook not configured', { status: 500 });
    }

    if (!signature) {
      console.error('Missing webhook signature');
      return new NextResponse('Unauthorized: Missing signature', { status: 401 });
    }

    // Verify signature (assuming Dodo payments by default)
    const isValid = verifyDodoSignature(body, signature, webhookSecret);
    if (!isValid) {
      console.error('Invalid webhook signature');
      return new NextResponse('Unauthorized: Invalid signature', { status: 401 });
    }

    const event = JSON.parse(body);

    console.log('--- WEBHOOK START ---');
    console.log('Event Type:', event.type);
    console.log('Event Data:', JSON.stringify(event.data || event, null, 2));

    const session = event.data || event;
    const eventType = event.type;

    // Handle Subscription/Payment Success
    if (
      eventType === "checkout.session.completed" ||
      eventType === "payment.succeeded" ||
      eventType === "subscription.active"
    ) {
      let userId = session.metadata?.userId || session.customer?.metadata?.userId;

      // Handle case where metadata is a string
      if (!userId && session.metadata && typeof session.metadata === 'string') {
        try {
          const parsedMeta = JSON.parse(session.metadata);
          userId = parsedMeta.userId;
        } catch (e) {
          console.log("Failed to parse metadata string");
        }
      }

      // Fallback: Look up by email
      if (!userId) {
        const email = session.customer_email || session.email || session.customer_details?.email || session.customer?.email;
        if (email) {
          console.log("Looking up user by email:", email);
          try {
            const client = await clerkClient();
            const users = await client.users.getUserList({ emailAddress: [email], limit: 1 });
            if (users.data.length > 0) {
              userId = users.data[0].id;
              console.log("Found user by email:", userId);
            }
          } catch (error) {
            console.error("Clerk lookup failed:", error);
          }
        }
      }

      if (!userId) {
        console.error("Webhook: User ID not found");
        return new NextResponse("User ID not found", { status: 400 }); // Return 400 for bad request
      }

      // Update or create subscription
      const existingSub = await db
        .select()
        .from(userSubscriptions)
        .where(eq(userSubscriptions.userId, userId));

      const subscriptionEndDate = new Date();
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

      const subId = session.subscription_id || session.id || "manual_" + Date.now();
      const custId = session.customer_id || session.customer || "manual_" + Date.now();

      if (existingSub.length > 0) {
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
        console.log("Updated PRO subscription for", userId);
      } else {
        await db.insert(userSubscriptions).values({
          userId,
          stripeCustomerId: custId,
          stripeSubscriptionId: subId,
          plan: "pro",
          currentPeriodEnd: subscriptionEndDate,
          pdfCount: 0,
          lastResetDate: new Date(),
        });
        console.log("Created PRO subscription for", userId);
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}