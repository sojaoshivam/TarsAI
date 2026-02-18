import { db } from "@/app/lib/db";
import { chats, messages } from "@/app/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { chatId } = await req.json();

        if (!chatId) {
            return new NextResponse("Chat ID is required", { status: 400 });
        }

        // Verify chat belongs to user
        const chat = await db.select().from(chats).where(eq(chats.id, chatId)).limit(1);

        if (!chat || chat.length === 0) {
            console.error(`Chat not found for chatId: ${chatId}`);
            return new NextResponse("Chat not found", { status: 404 });
        }

        if (chat[0].userId !== userId) {
            console.error(`Unauthorized access for chatId: ${chatId} by userId: ${userId}`);
            return new NextResponse("Unauthorized", { status: 401 });
        }

        console.log(`Deleting messages for chatId: ${chatId}`);
        // Delete messages associated with the chat first (foreign key constraint)
        await db.delete(messages).where(eq(messages.chatId, chatId));

        console.log(`Deleting chat record for chatId: ${chatId}`);
        // Delete the chat itself
        await db.delete(chats).where(eq(chats.id, chatId));

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error deleting chat:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
