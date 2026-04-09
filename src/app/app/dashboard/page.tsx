"use client";

import React from "react";
import {
    Play,
    Plus,
    MoreHorizontal,
    SearchCheck,
    BookOpen,
    Video,
    GraduationCap,
    Gamepad2,
    BrainCircuit,
    Upload,
    FileText,
    ChevronRight,
    Bookmark,
    Settings,
    Clock,
    SquareStack,
    Flame,
    StickyNote,
    X,
    Loader2,
    CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/constants";


export default function DashboardPage() {
    const [user, setUser] = React.useState<any>(null);
    const [greeting, setGreeting] = React.useState("Good Morning");

    React.useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user", e);
            }
        }

        const updateGreeting = () => {
            const hour = new Date().getHours();
            if (hour >= 5 && hour < 12) {
                setGreeting("Good morning");
            } else if (hour >= 12 && hour < 17) {
                setGreeting("Good afternoon");
            } else {
                setGreeting("Good evening");
            }
        };

        updateGreeting();
        // Update greeting every minute in case the hour changes while user is on page
        const interval = setInterval(updateGreeting, 60000);
        return () => clearInterval(interval);
    }, []);

    const firstName = user?.name ? user.name.split(' ')[0] : "";

    return (
        <div className="max-w-[1200px] mx-auto space-y-8">
            {/* Greeting */}
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center overflow-hidden grayscale brightness-110">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-12 h-12" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold dark:text-white tracking-tight">
                        {greeting}, {firstName || "student"}!
                    </h1>
                    <p className="text-slate-500 text-sm">Which study set are you working on today?</p>
                </div>
            </div>

            {/* Quick Access Sets */}
            <div className="flex flex-wrap gap-4">
                <BackpackProgress />

                <Link href="/app/notes?upload=true" className="bg-white dark:bg-[#121214] border border-slate-200 dark:border-slate-800 px-6 py-3 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                    <div className="p-1.5 border border-dashed border-slate-400 dark:border-slate-600 rounded-lg group-hover:bg-primary/10 group-hover:border-primary transition-all">
                        <Plus className="w-4 h-4 text-slate-400 group-hover:text-primary" />
                    </div>
                    <span className="font-bold text-sm text-slate-700 dark:text-slate-300">Upload Files</span>
                </Link>

                <div className="ml-auto hidden md:flex items-center gap-4">
                    <Link href="/app/notes?upload=true" className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                        <Plus className="w-4 h-4" /> Upload Files
                    </Link>
                    <Link href="/app/notes" className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                        <BookOpen className="w-4 h-4" /> See All Resources
                    </Link>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
                {/* Left Section: Active Set */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="bg-primary dark:bg-indigo-600 rounded-[32px] overflow-hidden shadow-2xl">
                        <div className="p-8 pb-12 space-y-8">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-6">
                                    <div className="p-4 bg-white/10 dark:bg-white/20 rounded-2xl">
                                        <SearchCheck className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="text-white">
                                        <h2 className="text-2xl font-bold">AI Digest</h2>
                                        <p className="text-white/60 text-sm">2 materials</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="p-2.5 bg-white/10 dark:bg-white/20 text-white rounded-xl hover:bg-white/20 transition-colors">
                                        <Bookmark className="w-5 h-5" />
                                    </button>
                                    <button className="p-2.5 bg-white/10 dark:bg-white/20 text-white rounded-xl hover:bg-white/20 transition-colors">
                                        <Settings className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Tool Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <ToolCard icon={FileText} label="1 Tests/Quizzes" />
                                <ToolCard icon={Video} label="0 Explainers" />
                                <ToolCard icon={GraduationCap} label="0 Tutor Me" />
                                <ToolCard icon={Gamepad2} label="0 Arcade" />
                                <ToolCard icon={SquareStack} label="1 Flashcards" />
                                <ToolCard icon={BrainCircuit} label="0 Audio Recap" />
                            </div>

                            <button className="w-full bg-white text-primary font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-lg active:scale-95">
                                <div className="p-1 bg-primary/10 rounded-full">
                                    <Play className="w-4 h-4 fill-primary" />
                                </div>
                                Continue Learning
                            </button>
                        </div>

                        {/* Lessons List */}
                        <div className="bg-[#050510] dark:bg-[#050510] p-8 space-y-4">
                            <LessonItem title="Understanding the Anthropic AI Report and AUI" progress={0} />
                            <LessonItem title="India's AI Performance: The 0.27 Score Explained" progress={0} />
                            <LessonItem title="Implications and Future of AI for India" progress={0} />

                            <button className="w-full text-white/50 text-sm font-bold pt-4 hover:text-white transition-colors">View All</button>
                        </div>
                    </div>
                </div>

                {/* Right Section: Widgets */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Streak Widget */}
                    <StreakWidget />

                    <StickyNotes />

                    {/* Materials Widget */}
                    <div className="bg-white dark:bg-[#121214] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold dark:text-white">Materials</h3>
                            <button className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 dark:text-white hover:bg-primary/10 hover:border-primary hover:text-primary transition-all">
                                <Plus className="w-3.5 h-3.5" /> Upload
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 group cursor-pointer">
                                <div className="w-10 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden grayscale opacity-50">
                                    <FileText className="w-5 h-5 text-slate-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold dark:text-white group-hover:text-primary transition-colors">Untitled Lecture</p>
                                    <p className="text-[10px] text-slate-400">Jan 5, 2026</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 group cursor-pointer">
                                <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                                    <Video className="w-5 h-5 text-red-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold dark:text-white group-hover:text-primary transition-colors line-clamp-1">Anthropic Report: India's Shocking AI Scor...</p>
                                    <p className="text-[10px] text-slate-400">Dec 31, 2025</p>
                                </div>
                            </div>
                        </div>

                        <button className="w-full text-center text-primary text-xs font-bold hover:underline">View All</button>
                    </div>

                    {/* Upcoming Widget */}
                    {/* <div className="bg-white dark:bg-[#121214] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                        <div className="flex items-center justify-between text-slate-400">
                            <div className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                <h3 className="font-bold dark:text-white">Upcoming</h3>
                            </div>
                            <button className="p-1 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg"><ChevronRight className="w-4 h-4 rotate-90" /></button>
                        </div>
                        <div className="py-8 text-center bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                            <p className="text-xs text-slate-400 font-medium">No upcoming events</p>
                        </div>
                        <button className="w-full text-center text-primary text-xs font-bold hover:underline">View All</button>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

function StreakWidget() {
    const [streakData, setStreakData] = React.useState<any>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isHovered, setIsHovered] = React.useState(false);

    React.useEffect(() => {
        const fetchStreak = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await fetch(`${API_BASE_URL}/api/streaks/`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStreakData(data);
                }
            } catch (error) {
                console.error("Failed to fetch streak", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStreak();
    }, []);

    return (
        <div
            className="bg-white dark:bg-[#121214] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        {/* Background glow when hovered */}
                        <AnimatePresence>
                            {isHovered && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1.5 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className="absolute inset-0 bg-orange-500/20 blur-xl rounded-full"
                                />
                            )}
                        </AnimatePresence>

                        <div className={`p-2 rounded-xl transition-all duration-300 z-10 relative bg-orange-50 dark:bg-orange-950/20 text-orange-600 ${isHovered ? "scale-110" : ""}`}>
                            <div className="relative flex items-center justify-center">
                                <motion.div
                                    animate={isHovered ? {
                                        scale: [1, 1.08, 1, 1.12, 1],
                                        rotate: [0, -3, 3, -2, 0],
                                        y: [0, -1, 0, -2, 0],
                                    } : {}}
                                    transition={{
                                        duration: 2.5, // Much slower pulsing
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="relative z-10"
                                >
                                    {/* Multi-layered Flame for depth */}
                                    <Flame className="w-7 h-7 fill-orange-500 text-orange-600" />

                                    {/* Inner Flame Core */}
                                    <motion.div
                                        animate={{
                                            opacity: [0.6, 1, 0.6],
                                            scale: [0.85, 0.95, 0.85],
                                        }}
                                        transition={{
                                            duration: 1.8,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                    >
                                        <Flame className="w-4 h-4 fill-yellow-400 text-yellow-500" />
                                    </motion.div>

                                    {/* Hot Center */}
                                    <motion.div
                                        animate={{
                                            opacity: [0.4, 0.8, 0.4],
                                            scale: [0.6, 0.7, 0.6],
                                        }}
                                        transition={{
                                            duration: 1.2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                    >
                                        <Flame className="w-2 h-2 fill-white text-yellow-100" />
                                    </motion.div>
                                </motion.div>
                            </div>

                            {/* Animated Embers with improved physics */}
                            <AnimatePresence>
                                {isHovered && [1, 2, 3, 4, 5].map((i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 0, x: 0, scale: 1 }}
                                        animate={{
                                            opacity: [0, 1, 1, 0],
                                            y: [-10, -35 - (i * 5)],
                                            x: [(i % 2 === 0 ? -15 : 15) * (i / 3), (i % 2 === 0 ? -25 : 25) * (i / 2)],
                                            scale: [1, 1.2, 0.4, 0],
                                            rotate: [0, 45, 90, 180]
                                        }}
                                        transition={{
                                            duration: 1 + (i * 0.2),
                                            repeat: Infinity,
                                            delay: i * 0.15,
                                            ease: "easeOut"
                                        }}
                                        className={`absolute top-0 left-1/2 -ml-1 w-1.5 h-1.5 ${i % 3 === 0 ? 'bg-yellow-300' : i % 2 === 0 ? 'bg-orange-400' : 'bg-red-500'} rounded-full blur-[0.6px]`}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className="font-bold text-lg dark:text-white">
                            {isLoading ? (
                                <div className="h-6 w-24 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-md" />
                            ) : (
                                `${streakData?.current_streak || 0} day streak!`
                            )}
                        </span>
                        {isHovered && streakData && (
                            <motion.span
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-[10px] text-orange-500 font-bold"
                            >
                                Keep it up! 🔥
                            </motion.span>
                        )}
                    </div>
                </div>
                <Link
                    href="/app/leaderboard"
                    className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider hover:text-primary transition-colors"
                >
                    View Leaderboard
                </Link>
            </div>
        </div>
    );
}

function ToolCard({ icon: Icon, label }: { icon: any, label: string }) {
    return (
        <div className="flex items-center justify-between p-4 bg-white/10 dark:bg-white/20 border border-white/10 dark:border-white/20 rounded-2xl group cursor-pointer hover:bg-white/20 transition-all">
            <div className="flex items-center gap-3 text-white">
                <Icon className="w-4 h-4" />
                <span className="text-xs font-bold">{label}</span>
            </div>
            <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors rotate-90" />
        </div>
    );
}

function StickyNotes() {
    const [notes, setNotes] = React.useState<any[]>([]);
    const [newNote, setNewNote] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [editingText, setEditingText] = React.useState("");

    const colors = [
        "bg-yellow-100 dark:bg-yellow-900/20",
        "bg-blue-100 dark:bg-blue-900/20",
        "bg-green-100 dark:bg-green-900/20",
        "bg-pink-100 dark:bg-pink-900/20",
        "bg-purple-100 dark:bg-purple-900/20"
    ];

    const fetchNotes = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_BASE_URL}/api/todos/`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setNotes(data);
            }
        } catch (error) {
            console.error("Failed to fetch notes", error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchNotes();
    }, []);

    const addNote = async () => {
        if (!newNote.trim()) return;

        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_BASE_URL}/api/todos/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ text: newNote })
            });

            if (response.ok) {
                setNewNote("");
                fetchNotes(); // Refresh list as requested
            }
        } catch (error) {
            console.error("Failed to add note", error);
        }
    };

    const deleteNote = async (id: string) => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                setNotes(notes.filter(n => n._id !== id));
            }
        } catch (error) {
            console.error("Failed to delete note", error);
        }
    };

    const updateNote = async (id: string, text: string, completed: boolean) => {
        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    text: text,
                    completed: completed
                })
            });

            if (response.ok) {
                const updated = await response.json();
                setNotes(notes.map(n => n._id === id ? updated : n));
                setEditingId(null);
            }
        } catch (error) {
            console.error("Failed to update note", error);
        }
    };

    const toggleComplete = async (note: any) => {
        updateNote(note._id, note.text, !note.completed);
    };

    const startEditing = (note: any) => {
        setEditingId(note._id);
        setEditingText(note.text);
    };

    return (
        <div className="bg-white dark:bg-[#121214] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <StickyNote className="w-4 h-4 text-primary" />
                    <h3 className="font-bold dark:text-white">Sticky Notes</h3>
                </div>
                <button
                    onClick={addNote}
                    disabled={!newNote.trim()}
                    className="p-1 px-2.5 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary hover:text-white transition-all flex items-center gap-1 disabled:opacity-50"
                >
                    <Plus className="w-3 h-3" /> Add
                </button>
            </div>

            <div className="relative">
                <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addNote()}
                    placeholder="Type a note and press enter..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary/30 dark:text-white transition-all"
                />
            </div>

            <div className="grid grid-cols-1 gap-3 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout" initial={false}>
                        {notes.map((note, index) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                transition={{
                                    layout: { duration: 0.2, ease: "easeOut" },
                                    opacity: { duration: 0.15 }
                                }}
                                key={note._id}
                                className={`${colors[index % colors.length]} p-3 rounded-2xl relative group border border-black/5 dark:border-white/5 shadow-sm ${note.completed ? 'opacity-60' : ''}`}
                            >
                                <AnimatePresence mode="wait">
                                    {editingId === note._id ? (
                                        <motion.div
                                            key="editing"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex flex-col gap-2"
                                            layout
                                        >
                                            <textarea
                                                value={editingText}
                                                onChange={(e) => setEditingText(e.target.value)}
                                                onFocus={(e) => {
                                                    const val = e.target.value;
                                                    e.target.value = "";
                                                    e.target.value = val;
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        updateNote(note._id, editingText, note.completed);
                                                    }
                                                    if (e.key === 'Escape') setEditingId(null);
                                                }}
                                                className="w-full bg-white/50 dark:bg-black/20 border border-black/10 dark:border-white/10 rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-primary/30 dark:text-white resize-none"
                                                rows={2}
                                                autoFocus
                                            />
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="text-[10px] text-slate-500 font-bold hover:text-slate-700"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => updateNote(note._id, editingText, note.completed)}
                                                    className="text-[10px] text-primary font-bold hover:underline"
                                                >
                                                    Save
                                                </button>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="viewing"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-start gap-3"
                                            layout
                                        >
                                            <button
                                                onClick={() => toggleComplete(note)}
                                                className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-md border-2 transition-colors flex items-center justify-center ${note.completed
                                                    ? 'bg-primary border-primary'
                                                    : 'border-black/10 dark:border-white/20'
                                                    }`}
                                            >
                                                {note.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                                            </button>
                                            <p
                                                onClick={() => startEditing(note)}
                                                className={`flex-1 text-xs font-medium dark:text-slate-200 pr-6 leading-relaxed cursor-text ${note.completed ? 'line-through text-slate-500' : ''}`}
                                            >
                                                {note.text}
                                            </p>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteNote(note._id);
                                                }}
                                                className="absolute top-3 right-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
                {!isLoading && notes.length === 0 && (
                    <div className="py-8 text-center bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                        <p className="text-[10px] text-slate-400 font-medium">No notes yet. Add one above!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function LessonItem({ title, progress }: { title: string, progress: number }) {
    return (
        <div className="flex items-center justify-between gap-6 py-2 group cursor-pointer">
            <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">{title}</span>
            <div className="flex items-center gap-4 min-w-[120px]">
                <div className="flex-1 h-2 bg-white/10 dark:bg-white/20 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white rounded-full transition-all duration-1000"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <span className="text-white font-bold text-xs min-w-[24px]">{progress}%</span>
            </div>
        </div>
    );
}


function BackpackProgress() {
    const [overallProgress, setOverallProgress] = React.useState(0);

    React.useEffect(() => {
        const fetchProgress = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const [progressResponse] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/roadmap/overall`, {
                        headers: { "Authorization": `Bearer ${token}` }
                    })
                ]);

                if (progressResponse.ok) {
                    const progressData = await progressResponse.json();
                    setOverallProgress(progressData.progress_percent || 0);
                }
            } catch (error) {
                console.error("Failed to fetch progress", error);
            }
        };

        fetchProgress();
    }, []);

    const fillY = overallProgress === 0 ? 130 : (overallProgress === 100 ? 18 : 112 - (overallProgress / 100) * 94);

    return (
        <Link href="/app/roadmap" className="group relative pr-4 flex items-center justify-center">
            <style>{`
                @keyframes wave-slide-svg-dashboard {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-100px); }
                }
                .animate-wave-slide-svg {
                    animation: wave-slide-svg-dashboard 2s linear infinite;
                }
                .animate-wave-slide-svg-slow {
                    animation: wave-slide-svg-dashboard 3s linear infinite;
                }
            `}</style>

            <div className="text-emerald-500 w-[54px] h-[54px] relative cursor-pointer hover:scale-105 transition-transform duration-300">
                <svg viewBox="-4 -4 108 124" className="w-full h-full overflow-visible drop-shadow-sm">
                    <defs>
                        <clipPath id="backpack-clip-dashboard">
                            <path d="
                                M 2 62 C 2 56 4 54 8 54 H 92 C 96 54 98 56 98 62 V 102 C 98 108 96 110 92 110 H 8 Z
                                M 16 32 C 16 22 24 18 34 18 H 66 C 76 18 84 22 84 32 V 102 C 84 107.5 79.5 112 74 112 H 26 C 20.5 112 16 107.5 16 102 Z
                            " />
                        </clipPath>
                    </defs>

                    {/* Fluid */}
                    <g clipPath="url(#backpack-clip-dashboard)" className="text-pink-500">
                        {overallProgress > 0 && (
                            <>
                                <rect x="0" y={fillY} width="100" height="130" fill="currentColor" fillOpacity="0.25" />
                                {overallProgress < 100 && (
                                    <>
                                        {/* Back wave */}
                                        <g className="animate-wave-slide-svg-slow">
                                            <path
                                                fill="currentColor"
                                                fillOpacity="0.3"
                                                d={`M 0 ${fillY} Q 25 ${fillY + 5}, 50 ${fillY} T 100 ${fillY} T 150 ${fillY} T 200 ${fillY} T 250 ${fillY} T 300 ${fillY} L 300 130 L 0 130 Z`}
                                            />
                                        </g>
                                        {/* Front wave */}
                                        <g className="animate-wave-slide-svg">
                                            <path
                                                fill="currentColor"
                                                fillOpacity="0.6"
                                                d={`M 0 ${fillY} Q 25 ${fillY - 4}, 50 ${fillY} T 100 ${fillY} T 150 ${fillY} T 200 ${fillY} T 250 ${fillY} T 300 ${fillY} L 300 130 L 0 130 Z`}
                                            />
                                        </g>
                                    </>
                                )}
                            </>
                        )}
                    </g>

                    {/* Icon Outline */}
                    <g fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M 36 24 V 10 C 36 4 42 2 50 2 C 58 2 64 4 64 10 V 24" />
                        <path d="M 16 54 H 8 C 4 54 2 56 2 62 V 102 C 2 108 4 110 8 110 H 16" />
                        <path d="M 84 54 H 92 C 96 54 98 56 98 62 V 102 C 98 108 96 110 92 110 H 84" />
                        <path d="M 16 40 V 102 C 16 107.5 20.5 112 26 112 H 74 C 79.5 112 84 107.5 84 102 V 40" />
                        <path d="M 16 40 C 16 54 30 58 50 58 C 70 58 84 54 84 40 V 32 C 84 22 76 18 66 18 H 34 C 24 18 16 22 16 32 Z" />
                        <path d="M 44 58 L 46 68 H 54 L 56 58" />
                        <rect x="28" y="68" width="44" height="22" rx="6" />
                        <path d="M 34 76 H 66" />
                        <path d="M 62 76 V 81" />
                    </g>
                </svg>
            </div>

            {/* Hover Tooltip */}
            <div className="absolute top-1/2 left-full -translate-y-1/2 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[100]">
                <div className="flex items-center">
                    <div className="w-2 h-2 bg-slate-800 dark:bg-slate-700 rotate-45 -mr-1.5 z-0 relative"></div>
                    <div className="bg-slate-800 dark:bg-slate-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap relative z-10">
                        Overall Progress: <span className="text-pink-400">{overallProgress}%</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
