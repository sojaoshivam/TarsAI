// app/lib/subscription.ts
import { db } from "./db";
import { userSubscriptions } from "./db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

const DAY_IN_MS = 86_400_000;

export async function checkSubscription() {
  const { userId } = await auth();

  if (!userId) {
    return { isValid: false, plan: "free" as const };
  }

  const _userSubscriptions = await db
    .select()
    .from(userSubscriptions)
    .where(eq(userSubscriptions.userId, userId));

  if (!_userSubscriptions[0]) {
    // Create free plan subscription for new user
    await db.insert(userSubscriptions).values({
      userId,
      plan: "free",
      pdfCount: 0,
    });
    return { isValid: false, plan: "free" as const };
  }

  const subscription = _userSubscriptions[0];

  // Check if it's a new month and reset PDF count
  const now = new Date();
  const lastReset = subscription.lastResetDate || subscription.createdAt;
  const monthsSinceReset = 
    (now.getFullYear() - lastReset.getFullYear()) * 12 + 
    (now.getMonth() - lastReset.getMonth());

  if (monthsSinceReset >= 1 && subscription.plan === "pro") {
    // Reset PDF count for new month
    await db
      .update(userSubscriptions)
      .set({ pdfCount: 0, lastResetDate: now })
      .where(eq(userSubscriptions.userId, userId));
    
    subscription.pdfCount = 0;
  }

  const isValid =
    subscription.plan === "pro" &&
    subscription.currentPeriodEnd &&
    subscription.currentPeriodEnd.getTime() + DAY_IN_MS > Date.now();

  return { 
    isValid, 
    plan: subscription.plan,
    pdfCount: subscription.pdfCount,
    pdfLimit: subscription.plan === "free" ? 2 : 20,
  };
}

export async function canUploadPDF() {
  const { userId } = await auth();
  if (!userId) return { canUpload: false, reason: "Not authenticated" };

  const subscriptionStatus = await checkSubscription();
  const { plan, pdfCount, pdfLimit } = subscriptionStatus;

//   if (pdfCount >= pdfLimit) {
//     return {
//       canUpload: false,
//       reason: plan === "free" 
//         ? "Free plan limit reached. Upgrade to Pro for 20 PDFs per month."
//         : "Monthly PDF limit reached. Limit resets next month.",
//       pdfCount,
//       pdfLimit,
//     };
//   }

  return { canUpload: true, pdfCount, pdfLimit };
}

export async function incrementPDFCount() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  const _userSubscriptions = await db
    .select()
    .from(userSubscriptions)
    .where(eq(userSubscriptions.userId, userId));

  if (!_userSubscriptions[0]) {
    throw new Error("Subscription not found");
  }

  await db
    .update(userSubscriptions)
    .set({ pdfCount: _userSubscriptions[0].pdfCount + 1 })
    .where(eq(userSubscriptions.userId, userId));
}