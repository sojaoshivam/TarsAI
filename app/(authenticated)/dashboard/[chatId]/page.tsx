import { db } from "@/app/lib/db"
import { chats, messages } from "@/app/lib/db/schema"
import ChatPageClient from "./ChatPageClient"
import { auth } from "@clerk/nextjs/server"
import { eq, asc } from "drizzle-orm"
import { redirect } from "next/navigation"
import { UIMessage } from "@ai-sdk/react"

type Props = {
    params: Promise<{
        chatId: string
    }>
}

const ChatsPage = async ({ params }: Props) => {
    const { chatId } = await params;
    const { userId } = await auth()

    if (!userId) {
        return redirect("/sign-in")
    }

    const _chats = await db.select().from(chats).where(eq(chats.userId, userId))

    if (!_chats) {
        return redirect("/")
    }

    const chatIdNum = Number(chatId);

    if (!_chats.find(chat => chat.id === chatIdNum)) {
        return redirect("/");
    }

    const currentChat = _chats.find(chat => chat.id === chatIdNum);

    // 1. Fetch messages ordered by creation time
    const _messages = await db
        .select()
        .from(messages)
        .where(eq(messages.chatId, chatIdNum))
        .orderBy(asc(messages.createdAt));

    // 2. Map DB messages to UI format with correct Role and Type
    const initialMessages: UIMessage[] = _messages.map(msg => ({
        id: msg.id.toString(),
        role: msg.role === "system" ? "assistant" : "user",
        content: msg.content,
        createdAt: new Date(msg.createdAt),
        // Helper for Vercel AI SDK 3.3+ (optional but good for compatibility)
        parts: [{ type: 'text', text: msg.content }]
    }));

    return (
        <ChatPageClient
            chatId={chatIdNum}
            initialMessages={initialMessages}
            currentChat={currentChat!}
        />
    )
}

export default ChatsPage
