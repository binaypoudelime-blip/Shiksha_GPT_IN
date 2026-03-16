"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Send, User, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { Navbar } from "../components/Navbar";

export default function ContactPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");

        // Simulating an API call
        setTimeout(() => {
            setStatus("success");
            setName("");
            setEmail("");
            setMessage("");

            // Revert back to idle after 3s
            setTimeout(() => setStatus("idle"), 3000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-indigo-100 selection:text-primary transition-colors duration-300">
            <Navbar />

            <main className="max-w-[1440px] mx-auto px-4 md:px-10 py-12 md:py-20 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                    {/* Left Side: Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col gap-10"
                    >
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading tracking-tight text-slate-900 dark:text-white leading-tight">
                                Get in touch with <br /> <span className="text-gradient">Our Team</span>
                            </h1>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed mt-4">
                                Have questions about how ShikshaGPT can help you learn smarter? We're here to help! Reach out to us using the form or details below.
                            </p>
                        </div>

                        <div className="flex flex-col gap-8 mt-2">
                            <div className="flex items-start gap-5 group">
                                <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div className="mt-1">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Our Location</h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-base">
                                        Jyothi complex, 4th cross,<br />
                                        Manjunath layout, Munnekolal,<br />
                                        Bangalore
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-5 group">
                                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div className="mt-1">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Phone Number</h3>
                                    <a href="tel:8553230475" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-base font-medium">
                                        8553230475
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-5 group">
                                <div className="p-4 rounded-2xl bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 group-hover:scale-110 group-hover:bg-pink-500 group-hover:text-white transition-all shadow-sm">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div className="mt-1">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">Email Address</h3>
                                    <a href="mailto:shikshagptindia@gmail.com" className="text-slate-600 dark:text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors break-all text-base font-medium">
                                        shikshagptindia@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Background Decoration */}
                        <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
                    </motion.div>

                    {/* Right Side: Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white dark:bg-slate-900/80 backdrop-blur-xl p-8 md:p-12 rounded-[32px] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 relative overflow-hidden h-fit"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-[50px] pointer-events-none"></div>

                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8 font-heading">Send us a Message</h2>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6 relative z-10">
                            <div className="space-y-2.5">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Your Name</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-slate-900 dark:text-white text-base"
                                        required
                                        disabled={status === "loading" || status === "success"}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Your Email</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="john@example.com"
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-slate-900 dark:text-white text-base"
                                        required
                                        disabled={status === "loading" || status === "success"}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Message</label>
                                <div className="relative group">
                                    <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="How can we help you today?"
                                        rows={5}
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all text-slate-900 dark:text-white text-base resize-none"
                                        required
                                        disabled={status === "loading" || status === "success"}
                                    ></textarea>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={status === "loading" || status === "success"}
                                className={`w-full font-bold py-4 rounded-2xl shadow-xl transition-all text-base tracking-wide mt-4 flex items-center justify-center gap-2 ${status === "success"
                                        ? "bg-emerald-500 text-white shadow-emerald-200 dark:shadow-none"
                                        : "bg-primary text-white shadow-indigo-200 dark:shadow-none hover:shadow-2xl hover:shadow-indigo-300 hover:-translate-y-1 active:scale-95"
                                    } disabled:opacity-80 disabled:cursor-not-allowed`}
                            >
                                {status === "loading" ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Sending...</span>
                                    </>
                                ) : status === "success" ? (
                                    <>
                                        <span>Message Sent Successfully!</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Send Message</span>
                                        <Send className="w-5 h-5 ml-1" />
                                    </>
                                )}
                            </button>

                            {status === "success" && (
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center text-emerald-600 dark:text-emerald-400 text-sm mt-3 font-medium bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-xl border border-emerald-100 dark:border-emerald-800"
                                >
                                    Thank you for writing to us. We will get back to you shortly!
                                </motion.p>
                            )}
                        </form>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
