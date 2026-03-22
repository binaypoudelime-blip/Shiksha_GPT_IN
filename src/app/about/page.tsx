"use client";

import { motion } from "framer-motion";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { GraduationCap, Users, UserCog, Target, Lightbulb, Zap, Server, Code, Shield } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-indigo-100 selection:text-primary transition-colors duration-300">
            <Navbar />

            <main className="pt-24 pb-16 md:pt-32 md:pb-24">
                {/* Hero Section */}
                <section className="max-w-[1440px] mx-auto px-4 md:px-10 mb-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto space-y-6 relative"
                    >
                        {/* Background Decor */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

                        <h1 className="text-4xl md:text-6xl font-bold font-heading tracking-tight text-slate-900 dark:text-white leading-tight">
                            About <span className="text-gradient">ShikshaGPT</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 font-medium pb-4">
                            A Unified Ecosystem for Academic Success
                        </p>
                    </motion.div>
                </section>

                {/* Introduction Section */}
                <section className="max-w-[1440px] mx-auto px-4 md:px-10 mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 md:p-12 relative overflow-hidden"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl text-primary">
                                <Zap className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold font-heading text-slate-900 dark:text-white">
                                Introduction
                            </h2>
                        </div>
                        <div className="space-y-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                            <p>
                                ShikshaGPT is an advanced AI-driven educational platform designed to bridge the gap between traditional learning and the digital future. Developed with the specific needs of modern students in mind, ShikshaGPT serves as a 24/7 intelligent tutor, providing personalized, instant, and accurate academic support across various disciplines.
                            </p>
                            <p>
                                ShikshaGPT is more than just an AI tutor; it is a holistic educational platform designed to empower the entire academic community. By integrating advanced AI with intuitive data analytics, we provide a centralized hub where students, teachers, parents, and administrators collaborate to achieve better learning outcomes.
                            </p>
                        </div>
                    </motion.div>
                </section>

                {/* Why We Built It */}
                <section className="max-w-[1440px] mx-auto px-4 md:px-10 mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 dark:text-white mb-6">
                            Why We Built It
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Education is a shared journey, yet communication and data are often fragmented between the classroom and the home. We built ShikshaGPT to solve this by:
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Students Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 hover:-translate-y-2 transition-transform duration-300"
                        >
                            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                                <GraduationCap className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">For Students</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Providing 24/7 personalized academic support to help you understand difficult concepts and master your subjects.
                            </p>
                        </motion.div>

                        {/* Teachers & Admins Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 hover:-translate-y-2 transition-transform duration-300"
                        >
                            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
                                <UserCog className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">For Teachers & Admins</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Offering deep insights into student performance, automating routine tasks, and identifying learning gaps in real-time.
                            </p>
                        </motion.div>

                        {/* Parents Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 hover:-translate-y-2 transition-transform duration-300"
                        >
                            <div className="w-14 h-14 bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 rounded-2xl flex items-center justify-center mb-6">
                                <Users className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">For Parents</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Creating a transparent window into their child's progress, allowing for informed guidance and support at every step.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Mission & Vision Section */}
                <section className="bg-slate-100 dark:bg-slate-900/50 py-20 mb-24 border-y border-slate-200 dark:border-slate-800">
                    <div className="max-w-[1440px] mx-auto px-4 md:px-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[32px] shadow-lg border border-slate-100 dark:border-slate-800"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400">
                                        <Target className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">Our Mission</h3>
                                </div>
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                    To unify the educational experience through AI, providing every stakeholder with the data and tools they need to foster student growth.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[32px] shadow-lg border border-slate-100 dark:border-slate-800"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-2xl text-amber-600 dark:text-amber-400">
                                        <Lightbulb className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">Our Vision</h3>
                                </div>
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                    To build a future where data-driven insights and AI assistance create a seamless, supportive, and successful path for every learner.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Leadership Team */}
                <section className="max-w-[1440px] mx-auto px-4 md:px-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold font-heading text-slate-900 dark:text-white mb-6">
                            Our Leadership Team
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            The technical backbone of ShikshaGPT is engineered by a team dedicated to scalable, data-driven educational solutions.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">


                        {/* Binay Poudel */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center hover:border-primary/50 transition-colors duration-300 group"
                        >
                            <div className="w-24 h-24 mb-6 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Code className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Binay Poudel</h3>
                            <p className="text-emerald-600 font-medium mb-4">Sr. Software Engineer</p>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                <strong>Focus:</strong> Building the multi-interface platform that ensures a smooth experience for teachers, parents, and students alike.
                            </p>
                        </motion.div>

                        {/* Sandesh Satyal */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center hover:border-primary/50 transition-colors duration-300 group"
                        >
                            <div className="w-24 h-24 mb-6 rounded-full bg-pink-50 dark:bg-pink-500/10 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Shield className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Sandesh Satyal</h3>
                            <p className="text-pink-600 font-medium mb-4">Principal Engineer</p>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                <strong>Focus:</strong> Overseeing the technical architecture to ensure data security, system integrity, and long-term scalability.
                            </p>
                        </motion.div>

                        {/* Kanhaiya Sharma */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white dark:bg-slate-900 p-8 rounded-[32px] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center hover:border-primary/50 transition-colors duration-300 group"
                        >
                            <div className="w-24 h-24 mb-6 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Server className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Kanhaiya Sharma</h3>
                            <p className="text-primary font-medium mb-4">AI Cloud Engineer</p>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                <strong>Focus:</strong> Designing the cloud infrastructure and AI models that handle complex data analytics for thousands of concurrent users.
                            </p>
                        </motion.div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
