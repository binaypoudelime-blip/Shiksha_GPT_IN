"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
    Send,
    Plus,
    Mic,
    MoreVertical,
    Paperclip,
    Search,
    ArrowUp,
    Menu,
    User,
    Bot,
    Settings,
    LogOut,
    MessageSquarePlus,
    Copy,
    Check,
    Volume2,
    Square
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { useSidebar } from "../../context/SidebarContext";
import { useVoiceRecording } from "@/hooks/useVoiceRecording";
import { API_BASE_URL } from "@/lib/constants";


interface Message {
    role: "user" | "assistant";
    content: string | any[];
    created_at: string;
}

import { Suspense } from "react";

function ChatContent() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isDeepSearch, setIsDeepSearch] = useState(false);
    const { isOpen: isSidebarOpen, toggle: toggleSidebar, triggerRefresh } = useSidebar();
    const [conversationId, setConversationId] = useState("");
    const [user, setUser] = useState<any>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [playingIndex, setPlayingIndex] = useState<number | null>(null);
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlId = searchParams.get("id");

    const { isRecording, isTranscribing, startRecording, stopRecording } = useVoiceRecording((transcript) => {
        setInput(prev => {
            const newValue = prev ? `${prev} ${transcript}` : transcript;
            return newValue;
        });
    });

    const fetchConversationDetail = async (id: string) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_BASE_URL}/api/conversation/${id}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setConversationId(data._id);
                setMessages(data.messages || []);
            }
        } catch (error) {
            console.error("Failed to fetch conversation detail", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (urlId) {
            // Only fetch if the URL ID is different from what we're currently showing
            if (urlId !== conversationId) {
                fetchConversationDetail(urlId);
            }
        } else {
            // Only clear if we currently have a conversation loaded
            if (conversationId !== "") {
                setConversationId("");
                setMessages([]);
            }
        }
    }, [urlId, conversationId]);

    const handleSignOut = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        router.push("/auth/login");
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        }
    }, []);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
        }
    }, [input]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userPrompt = input;
        setInput("");

        // Add user message locally
        const newUserMessage: Message = {
            role: "user",
            content: userPrompt,
            created_at: new Date().toISOString()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setIsLoading(true);

        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_BASE_URL}/api/message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    conversation_id: conversationId || null,
                    user_id: user?._id || user?.id || user?.user_id || "688c489cdb3cdc055588e6a3",
                    prompt: userPrompt,
                    "deep-search": isDeepSearch
                })
            });

            const data = await response.json();

            if (response.ok) {
                const isNewChat = !conversationId;
                setConversationId(data.conversation_id);

                // Append the updated messages to history. 
                // data.messages contains the latest interaction (user prompt + assistant response).
                // We replace our local placeholder (added before the fetch) with the server's version.
                setMessages(prev => {
                    if (!prev.length) return data.messages;
                    const history = prev.slice(0, -1);
                    return [...history, ...data.messages];
                });

                if (isNewChat) {
                    router.replace(`/app/chat?id=${data.conversation_id}`, { scroll: false });
                    triggerRefresh();
                }
            } else {
                console.error("API error:", data);
                // Optionally handle error in UI
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleSpeak = (text: string, index: number) => {
        if (!synth) return;

        if (playingIndex === index) {
            synth.cancel();
            setPlayingIndex(null);
            return;
        }

        synth.cancel();

        const cleanText = text
            .replace(/```[\s\S]*?```/g, '') // Remove code blocks entirely
            .replace(/`[^`]*`/g, '') // Remove inline code
            .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
            .replace(/\[([^\]]+)\]\(.*?\)/g, '$1') // Extract text from links
            .replace(/[#*~_>]/g, '') // Remove special markdown characters
            .replace(/[-]{3,}/g, '') // Remove horizontal rules
            .replace(/\s+/g, ' ') // Clean up extra whitespace/newlines
            .trim();

        const utterance = new SpeechSynthesisUtterance(cleanText);

        utterance.onend = () => {
            setPlayingIndex(null);
        };

        utterance.onerror = () => {
            setPlayingIndex(null);
        };

        setPlayingIndex(index);
        synth.speak(utterance);
    };

    useEffect(() => {
        return () => {
            if (synth) {
                synth.cancel();
            }
        };
    }, []);

    const getMessageText = (content: string | any[]): string => {
        if (typeof content === 'string') return content;
        if (Array.isArray(content)) return content.map(item => item.text || '').join('');
        return '';
    };

    const userName = user?.name || "N/A";

    return (
        <div
            className={`fixed inset-0 ${isSidebarOpen ? 'lg:left-52' : 'lg:left-16'} bg-white dark:bg-[#0C0C0E] text-slate-900 dark:text-white flex flex-col z-40 transition-all duration-300`}
        >
            {/* Header */}
            <header className="h-14 flex items-center justify-between px-4 border-b border-slate-200 dark:border-white/[0.05] bg-white dark:bg-[#0C0C0E]">
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleSidebar}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-white/[0.05] rounded-lg transition-colors text-slate-500 dark:text-slate-400"
                    >
                        <Menu className="w-5 h-5" />
                    </button>

                </div>

                <div className="flex-1 flex items-center justify-center overflow-hidden px-4">
                    <h1 className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate">
                        {messages.length > 0 ? (() => {
                            const content = typeof messages[0].content === 'string'
                                ? messages[0].content
                                : Array.isArray(messages[0].content)
                                    ? messages[0].content.map(item => item.text || '').join('')
                                    : '';
                            return content.length > 50 ? content.substring(0, 50) + '...' : content;
                        })() : "New chat"}
                    </h1>
                </div>

                <div className="flex items-center gap-10">
                    <div className="relative group/new-chat">
                        <button
                            onClick={() => {
                                setMessages([]);
                                setConversationId("");
                                setInput("");
                                router.push("/app/chat");
                            }}
                            className="p-1.5 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/[0.05] rounded-lg transition-colors text-slate-500 dark:text-slate-400"
                        >
                            <MessageSquarePlus className="w-5 h-5" />
                        </button>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover/new-chat:opacity-100 pointer-events-none transition-all duration-200 translate-y-1 group-hover/new-chat:translate-y-0 z-50">
                            <div className="bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl whitespace-nowrap">
                                New Chat
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-white/10 hover:opacity-80 transition-opacity"
                        >
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                                    {userName}
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">
                                    Grade {user?.grade || "N/A"}
                                </span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-600/20">
                                {userName
                                    .split(' ')
                                    .map((n: string) => n[0])
                                    .join('')
                                    .toUpperCase()
                                    .substring(0, 2) || "U"}
                            </div>
                        </button>

                        <AnimatePresence>
                            {isProfileOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsProfileOpen(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1A1A1E] border border-slate-200 dark:border-white/[0.08] rounded-2xl shadow-xl z-50 overflow-hidden"
                                    >
                                        <div className="p-4 border-b border-slate-100 dark:border-white/[0.05]">
                                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Account</p>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                                                    {userName
                                                        .split(' ')
                                                        .map((n: string) => n[0])
                                                        .join('')
                                                        .toUpperCase()
                                                        .substring(0, 2) || "U"}
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-bold dark:text-white truncate">{user?.name || "Guest"}</p>
                                                    <p className="text-[10px] text-slate-500 truncate">{user?.email || "No email"}</p>

                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-2">
                                            <Link
                                                href="/app/profile"
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors group"
                                            >
                                                <Settings className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                                                Profile Settings
                                            </Link>
                                            <button
                                                onClick={handleSignOut}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Sign Out
                                            </button>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </header>

            {/* Main Chat Area */}
            <main className="flex-1 overflow-y-auto flex flex-col items-center">
                <div className="w-full max-w-3xl flex-1 flex flex-col py-8 px-4">
                    {messages.length === 0 ? (
                        /* Initial State */
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex-1 flex flex-col items-center justify-center text-center gap-6 mt-[-10vh]"
                        >
                            <img src="/logo.png" alt="ShikshaGPT Logo" className="w-16 h-16 object-contain" />
                            <div className="space-y-2">
                                <motion.h2
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-l font-bold tracking-tight text-slate-900 dark:text-white"
                                >
                                    Hi, {userName}, I'm ShikshaGPT.
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="text-slate-500 dark:text-slate-400 text-xs"
                                >
                                    How can I help you today?
                                </motion.p>
                            </div>
                        </motion.div>
                    ) : (
                        /* Messages List */
                        <div className="space-y-8">
                            {(() => {
                                const lastAssistantIdx = [...messages].reverse().findIndex(m => m.role === 'assistant');
                                const actualLastAssistantIdx = lastAssistantIdx !== -1 ? messages.length - 1 - lastAssistantIdx : -1;

                                return messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                                    >
                                        {msg.role === 'user' ? (
                                            <div className="flex items-center gap-2 group max-w-[85%]">
                                                <button
                                                    onClick={() => handleCopy(getMessageText(msg.content), idx)}
                                                    className={`flex items-center gap-1.5 px-3 py-1.5 transition-all text-[12px] font-medium rounded-lg order-first ${copiedIndex === idx
                                                        ? "opacity-100 bg-slate-100 dark:bg-white/5"
                                                        : "opacity-0 group-hover:opacity-100 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 dark:text-slate-500"
                                                        }`}
                                                    title="Copy message"
                                                >
                                                    {copiedIndex === idx ? (
                                                        <>
                                                            <Check className="w-3.5 h-3.5 text-green-500" />
                                                            <span className="text-green-500">Copied!</span>
                                                        </>
                                                    ) : (
                                                        <Copy className="w-4 h-4" />
                                                    )}
                                                </button>
                                                <div className="bg-slate-100 dark:bg-[#1E1E22] px-4 py-2.5 rounded-[20px] text-[15px] leading-relaxed text-slate-900 dark:text-slate-200">
                                                    {typeof msg.content === 'string'
                                                        ? msg.content
                                                        : Array.isArray(msg.content)
                                                            ? msg.content.map(item => item.text || '').join('')
                                                            : ''
                                                    }
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-3 w-full relative">
                                                <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center mt-1">
                                                    <img src="/logo.png" alt="AI" className="w-full h-full object-contain" />
                                                </div>
                                                <div className="text-[15px] leading-7 text-slate-700 dark:text-slate-200 pl-1 markdown-content">
                                                    <ReactMarkdown
                                                        remarkPlugins={[remarkGfm, remarkBreaks, remarkMath]}
                                                        rehypePlugins={[rehypeKatex]}
                                                        components={{
                                                            p: ({ node, ...props }) => <p className="mb-5 last:mb-0" {...props} />,
                                                            ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-5 space-y-2" {...props} />,
                                                            ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-5 space-y-2" {...props} />,
                                                            li: ({ node, ...props }) => <li className="mb-2 ml-4" {...props} />,
                                                            table: ({ node, ...props }) => (
                                                                <div className="overflow-x-auto my-6 rounded-xl border border-slate-200 dark:border-slate-800">
                                                                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800" {...props} />
                                                                </div>
                                                            ),
                                                            thead: ({ node, ...props }) => <thead className="bg-slate-50 dark:bg-white/5" {...props} />,
                                                            tbody: ({ node, ...props }) => <tbody className="bg-white dark:bg-transparent divide-y divide-slate-100 dark:divide-slate-800" {...props} />,
                                                            tr: ({ node, ...props }) => <tr {...props} />,
                                                            th: ({ node, ...props }) => <th className="px-5 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider" {...props} />,
                                                            td: ({ node, ...props }) => <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-normal" {...props} />
                                                        }}
                                                    >
                                                        {typeof msg.content === 'string'
                                                            ? msg.content.replace(/\\n/g, '\n')
                                                            : Array.isArray(msg.content)
                                                                ? msg.content.map(item => (item.text || '').replace(/\\n/g, '\n')).join('')
                                                                : ''
                                                        }
                                                    </ReactMarkdown>
                                                </div>
                                                {idx === actualLastAssistantIdx && (
                                                    <div className="flex items-center gap-2 mt-2 pl-1">
                                                        <button
                                                            onClick={() => handleCopy(getMessageText(msg.content), idx)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all text-[12px] font-medium text-slate-500 dark:text-slate-400 group/copy"
                                                        >
                                                            {copiedIndex === idx ? (
                                                                <>
                                                                    <Check className="w-3.5 h-3.5 text-green-500" />
                                                                    <span className="text-green-500">Copied!</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Copy className="w-3.5 h-3.5 group-hover/copy:text-indigo-500 transition-colors" />
                                                                    <span>Copy response</span>
                                                                </>
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() => handleSpeak(getMessageText(msg.content), idx)}
                                                            className={`flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-all text-[12px] font-medium group/speak ${playingIndex === idx ? 'text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10' : 'text-slate-500 dark:text-slate-400'}`}
                                                            title={playingIndex === idx ? "Stop speaking" : "Speak response"}
                                                        >
                                                            {playingIndex === idx ? (
                                                                <>
                                                                    <Square className="w-3.5 h-3.5 fill-current" />
                                                                    <span>Stop</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Volume2 className="w-3.5 h-3.5 group-hover/speak:text-indigo-500 transition-colors" />
                                                                    <span>Listen</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ));
                            })()}
                            {isLoading && (
                                <div className="flex flex-col gap-3">
                                    <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center animate-pulse">
                                        <img src="/logo.png" alt="AI" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex gap-1 items-center pl-1">
                                        <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                        <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                        <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
            </main>

            {/* Footer Input Area */}
            <footer className="p-4 pb-4 flex flex-col items-center bg-white dark:bg-[#0C0C0E]">
                <div className="w-full max-w-2xl relative group">
                    <div className={`backdrop-blur-sm border rounded-[24px] transition-all duration-300 p-1.5 flex flex-col gap-1 ${isDeepSearch
                        ? "bg-indigo-50/30 dark:bg-indigo-900/10 border-indigo-500/40 ring-4 ring-indigo-500/5"
                        : "bg-slate-50/50 dark:bg-[#1A1A1E]/80 border-slate-200 dark:border-white/[0.08]"
                        } focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/5 focus-within:bg-white dark:focus-within:bg-[#202024]`}>
                        <textarea
                            ref={textareaRef}
                            rows={1}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder={isTranscribing ? "Transcribing..." : "Ask ShikshaGPT"}
                            className="w-full bg-transparent border-none outline-none resize-none px-3.5 py-2 text-[15px] overflow-y-auto text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                        />

                        <div className="flex items-center justify-between px-1.5 pb-1">
                            <div className="flex items-center gap-1">
                                <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full text-slate-400 dark:text-slate-500 transition-colors">
                                    <Plus className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setIsDeepSearch(!isDeepSearch)}
                                    className={`flex items-center gap-1.5 px-3 py-1.2 rounded-full text-[11px] font-semibold transition-all border ${isDeepSearch
                                        ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm shadow-indigo-500/10"
                                        : "border-slate-200/60 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                                        }`}
                                >
                                    <Search className={`w-3.5 h-3.5 ${isDeepSearch ? 'text-indigo-500 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'}`} />
                                    Deep Research
                                </button>
                            </div>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={isRecording ? stopRecording : startRecording}
                                    className={`p-1.5 rounded-full transition-all ${isRecording
                                        ? "bg-red-500 text-white animate-pulse"
                                        : isTranscribing
                                            ? "bg-slate-100 dark:bg-white/5 text-slate-300 dark:text-slate-600 cursor-not-allowed"
                                            : "hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 dark:text-slate-500"
                                        }`}
                                    disabled={isTranscribing}
                                >
                                    <Mic className={`w-4 h-4 ${isRecording ? 'scale-110' : ''}`} />
                                </button>
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className={`p-1.5 rounded-full transition-all flex items-center justify-center ${input.trim() && !isLoading
                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                                        : "bg-slate-100 dark:bg-white/5 text-slate-300 dark:text-slate-600"
                                        }`}
                                >
                                    <ArrowUp className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                    ShikshaGPT can make mistakes, so double-check it
                </p>
            </footer>
        </div>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={
            <div className="fixed inset-0 bg-white dark:bg-[#0C0C0E] flex items-center justify-center">
                <img src="/logo.png" alt="Loading..." className="w-12 h-12 animate-pulse" />
            </div>
        }>
            <ChatContent />
        </Suspense>
    );
}

