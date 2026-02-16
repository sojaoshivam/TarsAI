
import { checkSubscription } from "@/app/lib/subscription";
import { NextResponse } from "next/server";

export async function GET() {
    const subscription = await checkSubscription();
    return NextResponse.json(subscription);
}
