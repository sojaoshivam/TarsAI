"use client"

import { useState } from "react"
import { DrizzleChat } from "@/app/lib/db/schema"
import Sidebar from "@/components/dashboard/Sidebar"
import MobileSidebar from "@/components/dashboard/MobileSidebar"
import PdfViewer from "@/components/dashboard/PdfViewer"
import ChatComponent from "@/components/dashboard/ChatComponent"
import { UIMessage } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { FileText, MessageSquare } from "lucide-react"
import { cn } from "@/app/lib/utils"
import AnimatedToggle from "@/components/dashboard/AnimatedToggle"

type Props = {
    chatId: number
    initialMessages: UIMessage[]
    currentChat: DrizzleChat
    chats: DrizzleChat[]
}

const ChatPageClient = ({ chatId, initialMessages, currentChat, chats }: Props) => {
    // 'pdf' | 'chat'
    const [activeTab, setActiveTab] = useState<'pdf' | 'chat'>('chat')

    return (
        <div className="flex flex-col h-[100dvh] overflow-hidden bg-[#0a0a0a]">
            {/* Mobile Header with Tabs */}
            <div className="md:hidden flex items-center justify-between p-2 border-b border-gray-800 bg-[#0a0a0a]/95 backdrop-blur z-50">
                <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                    <MobileSidebar chatId={chatId} chats={chats} />
                    <span className="font-bold text-gray-200 truncate text-sm">
                        {currentChat.pdfName}
                    </span>
                </div>

                <div className="flex  rounded-lg p-1 gap-1">
                    <AnimatedToggle activeTab={activeTab} onTabChange={setActiveTab} />
                </div>
            </div>

            <div className="flex w-full h-full overflow-hidden relative">

                {/* Desktop Sidebar (Left) */}
                <div className="hidden md:flex flex-[1] max-w-md min-w-[250px] border-r border-gray-800/50">
                    <Sidebar chatId={chatId} chats={chats} />
                </div>

                {/* PDF Viewer (Center) */}
                {/* On mobile, only show if activeTab is 'pdf' */}
                <div className={cn(
                    "flex-1 md:flex-[5] p-2 md:p-4 overflow-y-auto bg-gray-900/50 md:bg-transparent",
                    "md:block", // Always show on desktop
                    activeTab === 'pdf' ? "block" : "hidden md:block" // Toggle on mobile
                )}>
                    <PdfViewer pdfUrl={currentChat.pdfUrl || ''} />
                </div>

                {/* Resizable Divider (Desktop only) */}
                <div className="hidden md:block w-1 bg-gray-800/50 hover:bg-cyan-500/30 cursor-col-resize transition-colors relative group">
                    <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-cyan-500/10" />
                </div>

                {/* Chat Component (Right) */}
                {/* On mobile, only show if activeTab is 'chat' */}
                <div className={cn(
                    "flex-1 md:flex-[3] bg-[#0a0a0a] border-l border-gray-800/50",
                    "md:block", // Always show on desktop
                    activeTab === 'chat' ? "block" : "hidden md:block" // Toggle on mobile
                )}>
                    <ChatComponent
                        key={chatId}
                        chatId={chatId}
                        fileKey={currentChat.fileKey || ''}
                        initialMessages={initialMessages}
                    />
                </div>
            </div>
        </div>
    )
}

export default ChatPageClient
