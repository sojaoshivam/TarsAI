"use client"

import { useState } from "react"
import { DrizzleChat } from "@/app/lib/db/schema"
import PdfViewer from "@/components/dashboard/PdfViewer"
import ChatComponent from "@/components/dashboard/ChatComponent"
import { UIMessage } from "@ai-sdk/react"
import { cn } from "@/app/lib/utils"
import AnimatedToggle from "@/components/dashboard/AnimatedToggle"

type Props = {
    chatId: number
    initialMessages: UIMessage[]
    currentChat: DrizzleChat
}

const ChatPageClient = ({ chatId, initialMessages, currentChat }: Props) => {
    // 'pdf' | 'chat'
    const [activeTab, setActiveTab] = useState<'pdf' | 'chat'>('chat')

    return (
        <div className="flex flex-col h-full overflow-hidden bg-[#0a0a0a] w-full">
            {/* Mobile Header with Tabs */}
            <div className="lg:hidden flex items-center justify-between p-2 sm:p-3 border-b border-gray-800 bg-[#0a0a0a]/95 backdrop-blur z-40 gap-2">
                <span className="font-bold text-gray-200 truncate text-xs sm:text-sm flex-1 mr-1 sm:mr-2">
                    {currentChat.pdfName}
                </span>

                <div className="flex rounded-lg p-0.5 sm:p-1 gap-0.5 sm:gap-1 flex-shrink-0">
                    <AnimatedToggle activeTab={activeTab} onTabChange={setActiveTab} />
                </div>
            </div>

            <div className="flex w-full h-full overflow-hidden relative flex-1">
                {/* PDF Viewer (Center) */}
                {/* On mobile, only show if activeTab is 'pdf' */}
                <div className={cn(
                    "flex-1 lg:flex-[5] p-1.5 sm:p-2 md:p-3 lg:p-4 overflow-y-auto bg-gray-900/50 lg:bg-transparent",
                    "lg:block", // Always show on desktop
                    activeTab === 'pdf' ? "block" : "hidden lg:block" // Toggle on mobile
                )}>
                    <PdfViewer pdfUrl={currentChat.pdfUrl || ''} />
                </div>

                {/* Resizable Divider (Desktop only) */}
                <div className="hidden lg:block w-0.5 sm:w-1 bg-gray-800/50 hover:bg-cyan-500/30 cursor-col-resize transition-colors relative group">
                    <div className="absolute inset-y-0 -left-1 -right-1 group-hover:bg-cyan-500/10" />
                </div>

                {/* Chat Component (Right) */}
                {/* On mobile, only show if activeTab is 'chat' */}
                <div className={cn(
                    "flex-1 lg:flex-[3] bg-[#0a0a0a] border-l border-gray-800/50",
                    "lg:block", // Always show on desktop
                    activeTab === 'chat' ? "block" : "hidden lg:block" // Toggle on mobile
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
