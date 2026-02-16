import { db } from "@/app/lib/db"
import { chats, messages } from "@/app/lib/db/schema"
import PdfViewer from "@/components/dashboard/PdfViewer"
import Sidebar from "@/components/dashboard/Sidebar"
import ChatComponent from "@/components/dashboard/ChatComponent"
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
        <div className="flex max-h-screen overflow-hidden bg-[#0a0a0a]">
            <div className="flex w-full h-full">
                {/* Chat Sidebar */}
                <div className="flex-[1] max-w-xs">
                    <Sidebar chatId={chatIdNum} chats={_chats} />
                </div>

                {/* PDF Viewer */}
                <div className="flex-[5] max-h-screen p-4 overflow-scroll">
                    <PdfViewer pdfUrl={currentChat?.pdfUrl || ' '} />
                </div>

                {/* Resizable Divider */}
                <div className="w-1 bg-gray-800/50 hover:bg-cyan-500/30 cursor-col-resize transition-colors relative group">
                    <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-cyan-500/10" />
                </div>

                {/* Chat Component */}
                <div className="flex-[3]">
                    <ChatComponent
                        key={chatIdNum} // Critical for resetting chat state
                        chatId={chatIdNum}
                        fileKey={currentChat?.fileKey || ''}
                        initialMessages={initialMessages}
                    />
                </div>
            </div>
        </div>
    )
}

export default ChatsPage