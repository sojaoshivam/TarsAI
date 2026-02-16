import { db } from "@/app/lib/db";
import { messages as messageSchema, chats } from "@/app/lib/db/schema";
import { UIMessage } from "ai";
import { asc, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { text } from "stream/consumers";


export async function POST(req: Request) {
    try {
        const { chatId } = await req.json();
        if (!chatId) {
            return new NextResponse("Missing chatId", { status: 400 });
        }

        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
        if (_chats.length !== 1 || _chats[0].userId !== userId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        //fetch messages filter by chatId and order in ascendinf order
        const _mesages = await db
            .select().from(messageSchema).where(eq(messageSchema.chatId, chatId)).orderBy(asc(messageSchema.createdAt));

        const uiMessages: UIMessage[] = _mesages.map((msg) => ({
            id: msg.id.toString(),
            role: msg.role === "system" ? "system" : "user",
            parts: [{ type: 'text', text: msg.content }]
        }))
        return NextResponse.json(uiMessages);

    } catch (error) {
        console.log("Error fetching previous messages", error)
        return new NextResponse("Internal server error", { status: 500 })
    }
}