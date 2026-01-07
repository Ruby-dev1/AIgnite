"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Sparkles, User, Bot, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { chatWithAI } from "@/lib/ai-career-service"
import { cn } from "@/lib/utils"

interface Message {
    role: "user" | "ai"
    content: string
}

export default function AIChat() {
    const [messages, setMessages] = useState<Message[]>([
        { role: "ai", content: "Hello! I'm your AI Career Advisor. How can I help you today? You can ask me about different career paths, skills you should learn, or even how to prepare for interviews!" }
    ])
    const [input, setInput] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMessage = input.trim()
        setInput("")
        setMessages(prev => [...prev, { role: "user", content: userMessage }])
        setIsLoading(true)

        try {
            const response = await chatWithAI(userMessage, messages)
            setMessages(prev => [...prev, { role: "ai", content: response }])
        } catch (error: any) {
            let errorMsg = "I'm sorry, I encountered an error. Could you please try again?"
            if (error.message === "QUOTA_EXCEEDED") {
                errorMsg = "I've reached my daily limit for free career advice. Please try again tomorrow, or wait a few minutes if I'm just busy!"
            }
            setMessages(prev => [...prev, { role: "ai", content: errorMsg }])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900">
            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scroll-smooth"
            >
                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                            "flex gap-3 max-w-[85%]",
                            msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                        )}
                    >
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                            msg.role === "user" ? "bg-indigo-600 text-white" : "bg-white dark:bg-slate-800 text-indigo-600 border dark:border-slate-700"
                        )}>
                            {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                        </div>
                        <div className={cn(
                            "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                            msg.role === "user"
                                ? "bg-indigo-600 text-white rounded-tr-none"
                                : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border dark:border-slate-700 rounded-tl-none"
                        )}>
                            {msg.content}
                        </div>
                    </motion.div>
                ))}
                {isLoading && (
                    <div className="flex gap-3 max-w-[85%] mr-auto">
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 text-indigo-600 border dark:border-slate-700 flex items-center justify-center">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div className="p-4 rounded-2xl rounded-tl-none bg-white dark:bg-slate-800 border dark:border-slate-700 flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                            <span className="text-sm text-slate-500">Thinking...</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t dark:border-slate-800 bg-white dark:bg-slate-900/50">
                <div className="max-w-3xl mx-auto relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-4 pl-6 pr-14 text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-xl transition-all shadow-md shadow-indigo-500/20"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <p className="text-[10px] text-center text-slate-400 mt-3 font-medium uppercase tracking-wider">
                    Powered by AIgnite Gemini Counsel
                </p>
            </div>
        </div>
    )
}
