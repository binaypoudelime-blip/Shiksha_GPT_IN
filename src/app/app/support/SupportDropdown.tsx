"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HelpCircle, X, ThumbsUp, ThumbsDown, MessageSquare, Newspaper } from "lucide-react";

export default function SupportDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<"feedback" | "news">("feedback");
    const [feedbackText, setFeedbackText] = useState("");
    const [rating, setRating] = useState<"good" | "bad" | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle submission logic here
        console.log({ feedbackText, rating });
        setFeedbackText("");
        setRating(null);
        setIsOpen(false);
        alert("Thanks for your feedback!");
    };

    return (
        <div className="relative group/support" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`p-2 rounded-xl transition-colors flex items-center justify-center relative ${isOpen ? "bg-primary/10 text-primary" : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"}`}
            >
                <HelpCircle className="w-5 h-5" />
                
                {/* Tooltip */}
                {!isOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover/support:opacity-100 pointer-events-none transition-all duration-200 translate-y-2 group-hover/support:translate-y-0 z-50">
                        <div className="bg-slate-900 dark:bg-slate-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap">
                            Support
                        </div>
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-800 rotate-45"></div>
                    </div>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute -right-[60px] md:right-0 mt-2 w-[calc(100vw-32px)] md:w-[400px] max-h-[85vh] overflow-y-auto bg-white dark:bg-[#1A1A1E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header Tabs */}
                        <div className="flex border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-[#1A1A1E] z-10 pt-2 px-2 gap-1 rounded-t-2xl">
                            <button
                                onClick={() => setActiveTab("feedback")}
                                className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                                    activeTab === "feedback" 
                                    ? "border-primary text-primary" 
                                    : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                }`}
                            >
                                <MessageSquare className="w-4 h-4" />
                                Feedback
                            </button>
                            <button
                                onClick={() => setActiveTab("news")}
                                className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
                                    activeTab === "news" 
                                    ? "border-primary text-primary" 
                                    : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                                }`}
                            >
                                <Newspaper className="w-4 h-4" />
                                News
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute right-3 top-3 p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="p-5">
                            <AnimatePresence mode="wait">
                                {activeTab === "feedback" ? (
                                    <motion.form
                                        key="feedback"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        transition={{ duration: 0.15 }}
                                        onSubmit={handleSubmit}
                                        className="space-y-4"
                                    >
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                                                Please explain in detail the feedback or issue you are having.
                                            </label>
                                            <textarea
                                                value={feedbackText}
                                                onChange={(e) => setFeedbackText(e.target.value)}
                                                placeholder="Please explain in detail the feedback or issue you are having..."
                                                className="w-full h-32 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all dark:text-white placeholder:text-slate-400"
                                                required
                                            />
                                        </div>

                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setRating("good")}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
                                                    rating === "good" 
                                                    ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400" 
                                                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                                                }`}
                                            >
                                                <ThumbsUp className={`w-3.5 h-3.5 ${rating === "good" ? "fill-current" : ""}`} /> Good
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setRating("bad")}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border ${
                                                    rating === "bad" 
                                                    ? "bg-red-50 border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400" 
                                                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                                                }`}
                                            >
                                                <ThumbsDown className={`w-3.5 h-3.5 ${rating === "bad" ? "fill-current" : ""}`} /> Bad
                                            </button>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full py-2.5 mt-4 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold rounded-xl transition-colors"
                                        >
                                            Submit
                                        </button>
                                    </motion.form>
                                ) : (
                                    <motion.div
                                        key="news"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.15 }}
                                        className="py-10 text-center"
                                    >
                                        <Newspaper className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">No News Yet</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Check back later for updates and announcements!
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
