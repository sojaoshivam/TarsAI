"use client"
import { Button } from "../ui/button";
import { Input } from "../ui/input"
import { SendHorizontal, Square } from 'lucide-react';
import { useState, useEffect, useRef } from "react";
import BounceLoader from "../ui/loader";
import { useChat, UIMessage } from "@ai-sdk/react"
import { useQuery } from "@tanstack/react-query";
import axios from "axios"; // Make sure you have axios installed

type Props = {
  chatId: number
  fileKey: string
  initialMessages: UIMessage[]
}

export default function ChatComponent({ chatId, fileKey }: Props) {
  const [input, setInput] = useState("")
  
  // 1. Fetch messages from DB using TanStack Query
  const { data: dbMessages, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      // Fetch from the API route we created earlier
      const response = await axios.post<UIMessage[]>("/api/get-messages", { chatId });
      return response.data;
    },
  });

  // 2. Initialize Vercel AI SDK
  const { messages, setMessages, sendMessage, status, error, stop } = useChat({
    api: '/api/chat',
    body: { chatId, fileKey },
   
  });

  // 3. Sync fetched DB messages into the Chat SDK state
  useEffect(() => {
    if (dbMessages && dbMessages.length > 0) {
      setMessages(dbMessages);
    }
  }, [dbMessages, setMessages]);

  // 4. Auto-scroll to bottom when new messages arrive
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messages?.length) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || status !== "ready") return;
    sendMessage({ text: input }, { body: { chatId, fileKey } })
    setInput("")
  }

  // Show a loading screen while fetching initial history
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-2">
          <BounceLoader />
          <span className="text-gray-500 text-sm">Loading history...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-screen bg-[#0a0a0a] text-gray-100">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-6">
        {error && (
          <div className="text-red-400 text-sm px-4 py-3 bg-red-950/20 border border-red-900/30 rounded-lg">
            {error.message}
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in duration-300`}
          >
            <div className={`max-w-[80%] ${message.role === "user" ? "order-1" : "order-2"}`}>
              {/* Only show label for Assistant */}
              {message.role === "assistant" && (
                <div className="text-xs text-cyan-400 mb-1.5 ml-1 font-medium tracking-wide">
                  TARS AI
                </div>
              )}

              {/* Message Content Bubble */}
              <div
                className={`px-4 py-3 rounded-xl ${message.role === "user"
                  ? "bg-[#1a1a1a] border border-cyan-500/20 shadow-lg shadow-cyan-500/5"
                  : "bg-[#141414] border border-gray-800"
                  }`}
              >
                {/* AI SDK 5.0 Rendering Logic */}
                {message.parts ? (
                  message.parts.map((part, index) => {
                    if (part.type === "text") {
                      return (
                        <p key={index} className="whitespace-pre-wrap text-sm leading-relaxed">
                          {part.text}
                        </p>
                      );
                    }
                    return null;
                  })
                ) : (
                  // Fallback if parts are missing (rare)
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.parts}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading/Streaming Indicator */}
        {(status === "submitted" || status === "streaming") && (
          <div className="flex justify-start animate-in fade-in duration-300">
            <div className="max-w-[80%]">
              <div className="text-xs text-cyan-400 mb-1.5 ml-1 font-medium tracking-wide">
                TARS AI
              </div>
              <div className="px-4 py-3 rounded-xl bg-[#141414] border border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Thinking</span>
                  <BounceLoader />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Invisible element to scroll to */}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800/50 bg-[#0a0a0a]/80 backdrop-blur-sm">
        <form className="px-4 py-4 max-w-4xl mx-auto" onSubmit={handleSubmit}>
          <div className="flex items-end gap-2">
            <div className="flex-1 relative">
              <Input
                placeholder="Message TARS..."
                onChange={(e) => setInput(e.target.value)}
                value={input}
                disabled={status === "submitted"}
                className="bg-[#141414] border-gray-800 focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 text-gray-100 placeholder:text-gray-600 rounded-xl px-4 py-3 h-auto resize-none transition-all"
              />
            </div>

            {status === "submitted" || status === "streaming" ? (
              <Button
                type="button"
                onClick={() => stop()}
                className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl p-3 transition-all"
              >
                <Square className="h-5 w-5 text-red-400" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={status !== "ready" || !input.trim()}
                className="bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl p-3 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <SendHorizontal className="h-5 w-5 text-cyan-400" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}