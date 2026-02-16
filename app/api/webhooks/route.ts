// app/api/webhook/route.ts
import { db } from "@/app/lib/db";
import { userSubscriptions } from "@/app/lib/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("dodo-signature") as string;

  // Verify webhook signature (implement based on Dodo Payments docs)
  // const isValid = verifyDodoSignature(body, signature, process.env.DODO_WEBHOOK_SECRET!);
  // if (!isValid) {
  //   return new NextResponse("Invalid signature", { status: 400 });
  // }

  const event = JSON.parse(body);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data;
        const userId = session.metadata?.userId;

        if (!userId) {
          return new NextResponse("User ID not found", { status: 400 });
        }

        // Update or create subscription
        const existingSub = await db
          .select()
          .from(userSubscriptions)
          .where(eq(userSubscriptions.userId, userId));

        const subscriptionEndDate = new Date();
        subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1);

        if (existingSub[0]) {
          await db
            .update(userSubscriptions)
            .set({
              stripeCustomerId: session.customer_id,
              stripeSubscriptionId: session.subscription_id,
              plan: "pro",
              currentPeriodEnd: subscriptionEndDate,
              pdfCount: 0,
              lastResetDate: new Date(),
            })
            .where(eq(userSubscriptions.userId, userId));
        } else {
          await db.insert(userSubscriptions).values({
            userId,
            stripeCustomerId: session.customer_id,
            stripeSubscriptionId: session.subscription_id,
            plan: "pro",
            currentPeriodEnd: subscriptionEndDate,
            pdfCount: 0,
            lastResetDate: new Date(),
          });
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