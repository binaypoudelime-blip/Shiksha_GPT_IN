"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/constants";
import {
    Play, Pause, Volume2, VolumeX, Maximize,
    PictureInPicture, Settings, ChevronLeft, Eye, Loader2, Video as VideoIcon, Mic2, ThumbsUp, ThumbsDown, Share2
} from "lucide-react";

interface Explainer {
    _id: string;
    name: string;
    description: string;
    tags: string[];
    is_active: boolean;
    duration: number | null;
    views_count: number;
    video_url: string;
    thumbnail_url: string | null;
    status?: string;
    error_message?: string | null;
}

const formatDuration = (seconds?: number | null) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

function formatTime(seconds: number) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function ExplainerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [explainer, setExplainer] = useState<Explainer | null>(null);
    const [recommended, setRecommended] = useState<Explainer[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Video Player State
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isControlsVisible, setIsControlsVisible] = useState(true);
    
    let controlsTimeout: NodeJS.Timeout;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const token = localStorage.getItem("access_token");
                const [explainerRes, allRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/explainer/${params.id}`, { headers: { "Authorization": `Bearer ${token}` } }),
                    fetch(`${API_BASE_URL}/api/explainer/`, { headers: { "Authorization": `Bearer ${token}` } })
                ]);
                
                if (explainerRes.ok) {
                    setExplainer(await explainerRes.json());
                }
                
                if (allRes.ok) {
                    const allData: Explainer[] = await allRes.json();
                    setRecommended(allData.filter(e => e._id !== params.id && (!e.status || e.status === 'completed')));
                }
            } catch (error) {
                console.error("Failed to fetch explainer data", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (params?.id) {
            fetchData();
        }
    }, [params.id]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        if (videoRef.current) {
            const time = (val / 100) * videoRef.current.duration;
            videoRef.current.currentTime = time;
            setCurrentTime(time);
            setProgress(val);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        if (videoRef.current) {
            videoRef.current.volume = val;
            videoRef.current.muted = val === 0;
            setIsMuted(val === 0);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            const newMuted = !isMuted;
            videoRef.current.muted = newMuted;
            setIsMuted(newMuted);
            if (!newMuted && volume === 0) {
                setVolume(0.5);
                videoRef.current.volume = 0.5;
            }
        }
    };

    const toggleFullscreen = async () => {
        if (!containerRef.current) return;
        
        if (!document.fullscreenElement) {
            await containerRef.current.requestFullscreen();
            setIsFullscreen(true);
        } else {
            await document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const togglePiP = async () => {
        if (!videoRef.current) return;
        
        try {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            } else if (document.pictureInPictureEnabled) {
                await videoRef.current.requestPictureInPicture();
            }
        } catch (error) {
            console.error("PiP failed", error);
        }
    };

    const changePlaybackRate = (rate: number) => {
        if (videoRef.current) {
            videoRef.current.playbackRate = rate;
            setPlaybackRate(rate);
            setShowSettings(false);
        }
    };

    const handleMouseMove = () => {
        setIsControlsVisible(true);
        clearTimeout(controlsTimeout);
        controlsTimeout = setTimeout(() => {
            if (isPlaying) setIsControlsVisible(false);
        }, 3000);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-slate-500 font-medium">Loading explainer...</p>
            </div>
        );
    }

    if (!explainer) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center">
                <h2 className="text-2xl font-bold dark:text-white">Explainer not found</h2>
                <button onClick={() => router.back()} className="mt-4 text-primary hover:underline">
                    Go back
                </button>
            </div>
        );
    }

    const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

    return (
        <div className="max-w-[1400px] mx-auto px-4 py-2 space-y-4">
            <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors dark:text-slate-400 group"
            >
                <div className="w-8 h-8 rounded-full bg-white dark:bg-[#1A1A1E] shadow-sm flex items-center justify-center group-hover:-translate-x-1 transition-transform border border-slate-200 dark:border-white/5">
                    <ChevronLeft className="w-4 h-4" />
                </div>
                Back to Library
            </button>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                {/* Main Content - Video Player */}
                <div className="flex-1 w-full lg:max-w-[70%]">
                    <div 
                        ref={containerRef} 
                        className="relative w-full bg-black rounded-2xl md:rounded-3xl overflow-hidden aspect-video shadow-2xl flex flex-col group"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => { if(isPlaying) setIsControlsVisible(false) }}
                    >
                        <video
                            ref={videoRef}
                            src={explainer.video_url}
                            className="w-full h-full object-contain cursor-pointer"
                            autoPlay
                            onClick={togglePlay}
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                            onEnded={() => setIsPlaying(false)}
                        />

                        {/* Custom Controls */}
                        <div className={`absolute bottom-0 left-0 right-0 p-4 pt-16 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${isControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
                            
                            {/* Progress Bar */}
                            <div className="relative w-full h-1.5 bg-white/20 rounded-full mb-4 cursor-pointer group/progress">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={progress}
                                    onChange={handleProgressChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div 
                                    className="absolute left-0 top-0 bottom-0 bg-primary rounded-full"
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full scale-0 group-hover/progress:scale-100 transition-transform shadow" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-white">
                                <div className="flex items-center gap-4">
                                    <button onClick={togglePlay} className="hover:text-primary transition-colors focus:outline-none">
                                        {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                                    </button>
                                    
                                    <div className="flex items-center gap-2 group/volume">
                                        <button onClick={toggleMute} className="hover:text-primary transition-colors focus:outline-none">
                                            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                        </button>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.05"
                                            value={isMuted ? 0 : volume}
                                            onChange={handleVolumeChange}
                                            className="w-0 opacity-0 group-hover/volume:w-20 group-hover/volume:opacity-100 transition-all duration-300 accent-primary cursor-pointer"
                                        />
                                    </div>

                                    <div className="text-xs font-medium text-white/90 font-mono tracking-wide">
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 relative">
                                    {/* Settings Menu */}
                                    <div className="relative">
                                        <button 
                                            onClick={() => setShowSettings(!showSettings)}
                                            className="hover:text-primary transition-colors focus:outline-none"
                                        >
                                            <Settings className={`w-5 h-5 ${showSettings ? "text-primary" : ""}`} />
                                        </button>
                                        
                                        {showSettings && (
                                            <div className="absolute bottom-10 right-0 bg-black/90 backdrop-blur border border-white/10 rounded-xl p-2 w-48 shadow-2xl space-y-1 z-50">
                                                <div className="text-xs text-white/50 px-3 py-1.5 font-bold uppercase tracking-wider border-b border-white/10 mb-2">
                                                    Playback Speed
                                                </div>
                                                {speeds.map(s => (
                                                    <button
                                                        key={s}
                                                        onClick={() => changePlaybackRate(s)}
                                                        className={`w-full text-left px-3 py-1.5 text-sm rounded-lg hover:bg-white/10 transition-colors flex items-center justify-between ${playbackRate === s ? "text-primary font-bold bg-white/5" : "text-white"}`}
                                                    >
                                                        {s === 1 ? "Normal" : `${s}x`}
                                                        {playbackRate === s && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <button onClick={togglePiP} className="hover:text-primary transition-colors focus:outline-none">
                                        <PictureInPicture className="w-5 h-5" />
                                    </button>

                                    <button onClick={toggleFullscreen} className="hover:text-primary transition-colors focus:outline-none">
                                        <Maximize className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Explainer Meta Details */}
                    <div className="mt-4 flex flex-col items-start gap-3 pb-6 border-b border-slate-200 dark:border-slate-800">
                        <h1 className="text-xl md:text-2xl font-bold dark:text-white leading-snug">
                            {explainer.name}
                        </h1>
                        
                        <div className="flex flex-wrap items-center justify-between w-full gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                                    SG
                                </div>
                                <div>
                                    <h3 className="font-bold dark:text-white text-[15px]">Shiksha GPT</h3>
                                    <p className="text-xs text-slate-500">AI Powered Guide</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center bg-slate-100 dark:bg-[#1A1A1E] rounded-full overflow-hidden border border-slate-200 dark:border-white/5">
                                    <button className="flex items-center gap-1.5 px-4 py-2 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors font-bold text-sm dark:text-white">
                                        <ThumbsUp className="w-4 h-4" /> 0
                                    </button>
                                    <div className="w-[1px] h-6 bg-slate-300 dark:bg-white/10" />
                                    <button className="flex items-center gap-1.5 px-4 py-2 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors font-bold text-sm dark:text-white">
                                        <ThumbsDown className="w-4 h-4" /> 0
                                    </button>
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-[#1A1A1E] border border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors rounded-full font-bold text-sm dark:text-white">
                                    <Share2 className="w-4 h-4" /> Share
                                </button>
                            </div>
                        </div>

                        <div className="w-full bg-slate-50 dark:bg-[#1A1A1E] border border-slate-200 dark:border-slate-800 rounded-2xl p-3 md:p-4 mt-1">
                            <div className="flex items-center gap-3 text-sm font-bold text-slate-800 dark:text-white mb-3">
                                <span className="flex items-center gap-1">
                                    <Eye className="w-4 h-4 text-slate-500" /> {explainer.views_count} views
                                </span>
                                <span className="text-slate-400">•</span>
                                <span className="text-slate-500">Just now</span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                                {explainer.description || "No description provided."}
                            </p>
                            
                            {explainer.tags && explainer.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-white/5">
                                    {explainer.tags.map(tag => (
                                        <span key={tag} className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar - Recommended Videos */}
                <div className="flex-1 w-full lg:max-w-[30%] flex flex-col gap-4">
                    <h3 className="font-bold text-lg dark:text-white px-1">Up Next</h3>
                    
                    <div className="flex flex-col gap-3">
                        {recommended.length > 0 ? (
                            recommended.map((exp) => (
                                <div 
                                    key={exp._id}
                                    onClick={() => router.push(`/app/explainers/${exp._id}`)}
                                    className="flex gap-3 cursor-pointer group items-start"
                                >
                                    <div className="w-40 h-24 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden relative shrink-0">
                                        {exp.thumbnail_url ? (
                                            <img
                                                src={exp.thumbnail_url}
                                                alt={exp.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-800">
                                                <VideoIcon className="w-6 h-6 text-slate-400" />
                                            </div>
                                        )}
                                        <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-black/80 font-bold text-white text-[10px] rounded backdrop-blur">
                                            {formatDuration(exp.duration)}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col flex-1 min-w-0 pt-0.5">
                                        <h4 className="font-bold text-sm dark:text-white line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                                            {exp.name}
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">Shiksha GPT</p>
                                        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                            <span>{exp.views_count} views</span>
                                            <span className="w-0.5 h-0.5 rounded-full bg-slate-400" />
                                            <span>Just now</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center p-8 bg-slate-50 dark:bg-[#1A1A1E] rounded-2xl border border-slate-200 dark:border-slate-800">
                                <p className="text-sm font-bold text-slate-500">No other videos found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
