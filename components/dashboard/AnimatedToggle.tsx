"use client"

import { motion } from "framer-motion"
import { cn } from "@/app/lib/utils"
import { FileText, MessageSquare } from "lucide-react"

type Tab = 'pdf' | 'chat'

type Props = {
    activeTab: Tab
    onTabChange: (tab: Tab) => void
}

const AnimatedToggle = ({ activeTab, onTabChange }: Props) => {
    return (
        <div className="flex p-1 bg-black rounded-xl relative">
            <button
                onClick={() => onTabChange('pdf')}
                className={cn(
                    "flex-1 relative px-4 py-2 text-sm font-medium transition-colors z-10 flex items-center justify-center gap-2",
                    activeTab === 'pdf' ? "text-cyan-400" : "text-gray-400 hover:text-gray-300"
                )}
            >
                {activeTab === 'pdf' && (
                    <motion.div
                        layoutId="active-tab-bg"
                        className="absolute inset-0 bg-[#1a1a1a] rounded-lg"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        style={{ zIndex: -1 }}
                    />
                )}
                <FileText className="w-4 h-4" />
                <span>PDF</span>
            </button>

            <button
                onClick={() => onTabChange('chat')}
                className={cn(
                    "flex-1 relative px-4 py-2 text-sm font-medium transition-colors z-10 flex items-center justify-center gap-2",
                    activeTab === 'chat' ? "text-cyan-400" : "text-gray-400 hover:text-gray-300"
                )}
            >
                {activeTab === 'chat' && (
                    <motion.div
                        layoutId="active-tab-bg"
                        className="absolute inset-0 bg-[#1a1a1a] rounded-lg"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        style={{ zIndex: -1 }}
                    />
                )}
                <MessageSquare className="w-4 h-4" />
                <span>Chat</span>
            </button>
        </div>
    )
}

export default AnimatedToggle
