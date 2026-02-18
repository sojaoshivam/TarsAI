
import { checkSubscription } from "@/app/lib/subscription";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { isValid: false, plan: "free", pdfCount: 0, pdfLimit: 2 },
                { status: 200 }
            );
        }

        const subscription = await checkSubscription();

        // Ensure all required fields are always present
        const response = {
            isValid: subscription.isValid ?? false,
            plan: subscription.plan ?? "free",
            pdfCount: subscription.pdfCount ?? 0,
            pdfLimit: subscription.pdfLimit ?? 2,
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error) {
        console.error("Subscription fetch error:", error);
        // Return default free plan on error instead of 500
        return NextResponse.json(
            { isValid: false, plan: "free", pdfCount: 0, pdfLimit: 2 },
            { status: 200 }
        );
    }
}
