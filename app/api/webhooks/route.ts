// app/api/webhook/route.ts
import { db } from "@/app/lib/db";
import { userSubscriptions } from "@/app/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("dodo-signature") as string;

  // Verify webhook signature (implement based on Dodo Payments docs)
  // const isValid = verifyDodoSignature(body, signature, process.env.DODO_WEBHOOK_SECRET!);
  // if (!isValid) {
  //   return new NextResponse("Invalid signature", { status: 400 });
  // }

  const event = JSON.parse(body);
  console.log('Webhook received:', event.type);
  console.log('Webhook body:', JSON.stringify(event, null, 2));

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "payment.succeeded": // Possible Dodo event
      case "subscription.active": // Possible Dodo event
        {
          const session = event.data || event;

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

          // Fallback: Look up by email if userId is still missing
          if (!userId) {
            const email = session.customer_email || session.email || session.customer_details?.email;
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

          console.log(`Processing ${event.type} for userId:`, userId);

          if (!userId) {
            console.error("Webhook: User ID not found in session metadata or email lookup");
            return new NextResponse("User ID not found", { status: 400 });
          }

          // Update or create subscription
          const existingSub = await db
            .select()
            .from(userSubscriptions)
            .where(eq(userSubscriptions.userId, userId));

          const subscriptionEndDate = new Date();
          subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

          const subId = session.subscription_id || session.id || "manual_sub_" + Date.now();
          const custId = session.customer_id || session.customer || "manual_cust_" + Date.now();

          if (existingSub[0]) {
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
            console.log("Updated existing subscription for", userId);
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
            console.log("Created new subscription for", userId);
          }

          break;
        }

      case "subscription.updated": {
        const subscription = event.data;
        const customerId = subscription.customer_id;

        await db
          .update(userSubscriptions)
          .set({
            plan: subscription.status === "active" ? "pro" : "free",
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          })
          .where(eq(userSubscriptions.stripeCustomerId, customerId));

        break;
      }

      case "subscription.cancelled": {
        const subscription = event.data;
        const customerId = subscription.customer_id;

        await db
          .update(userSubscriptions)
          .set({
            plan: "free",
            currentPeriodEnd: null,
          })
          .where(eq(userSubscriptions.stripeCustomerId, customerId));

        break;
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}