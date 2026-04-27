"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, X, Tag, ZoomIn, ZoomOut, PanelRightClose, PanelRightOpen, RotateCw } from "lucide-react";
import Link from "next/link";

// ─── DATA ───
const BONES_DATA: Record<string, any> = {
    skull: {
        id: "skull",
        name: "Skull",
        subtitle: "Cranium & Face",
        type: "Axial skeleton",
        count: 22,
        about: "The skeletal structure of the head that supports the face and protects the brain.",
        includes: ["Cranium (8)", "Face (14)"],
        region: "Head & Neck"
    },
    sternum: {
        id: "sternum",
        name: "Sternum",
        subtitle: "Breastbone",
        type: "Axial skeleton",
        count: 1,
        about: "A long flat bone located in the central part of the chest. It connects to the ribs via cartilage and forms the front of the rib cage.",
        includes: ["Sternum"],
        region: "Thoracic cage"
    },
    ribs: {
        id: "ribs",
        name: "Ribs",
        subtitle: "Costae",
        type: "Axial skeleton",
        count: 24,
        about: "Long curved bones which form the rib cage, part of the axial skeleton. They protect the lungs, heart, and other internal organs of the thorax.",
        includes: ["True ribs", "False ribs", "Floating ribs"],
        region: "Thoracic cage"
    },
    humerus: {
        id: "humerus",
        name: "Humerus",
        subtitle: "Upper arm bone",
        type: "Appendicular skeleton",
        count: 2,
        about: "A long bone in the arm that runs from the shoulder to the elbow. It connects the scapula and the two bones of the lower arm.",
        includes: ["Left humerus", "Right humerus"],
        region: "Upper limbs"
    },
    radius: {
        id: "radius",
        name: "Radius",
        subtitle: "Radius",
        type: "Appendicular skeleton",
        count: 2,
        about: "The lateral forearm bone, rotating around the ulna. It extends from the lateral side of the elbow to the thumb side of the wrist.",
        includes: ["Left radius", "Right radius"],
        region: "Upper limbs"
    },
    ulna: {
        id: "ulna",
        name: "Ulna",
        subtitle: "Ulna",
        type: "Appendicular skeleton",
        count: 2,
        about: "The medial forearm bone, located on the opposite side of the forearm from the thumb. It joins with the humerus to form the elbow joint.",
        includes: ["Left ulna", "Right ulna"],
        region: "Upper limbs"
    },
    pelvis: {
        id: "pelvis",
        name: "Hip bone",
        subtitle: "Coxa",
        type: "Appendicular skeleton",
        count: 2,
        about: "A large, flattened, irregularly shaped bone, constricted in the center and expanded above and below. It forms the pelvic girdle.",
        includes: ["Ilium", "Ischium", "Pubis"],
        region: "Pelvic girdle"
    },
    femur: {
        id: "femur",
        name: "Femur",
        subtitle: "Thigh bone",
        type: "Appendicular skeleton",
        count: 2,
        about: "The longest and strongest bone in the human body, extending from the pelvis to the knee.",
        includes: ["Left femur", "Right femur"],
        region: "Lower limbs"
    },
    tibia: {
        id: "tibia",
        name: "Tibia",
        subtitle: "Shinbone",
        type: "Appendicular skeleton",
        count: 2,
        about: "The larger, stronger, and anterior of the two bones in the leg below the knee, connecting the knee with the ankle bones.",
        includes: ["Left tibia", "Right tibia"],
        region: "Lower limbs"
    },
    fibula: {
        id: "fibula",
        name: "Fibula",
        subtitle: "Calf bone",
        type: "Appendicular skeleton",
        count: 2,
        about: "A leg bone located on the lateral side of the tibia, with which it is connected above and below. It is the smaller of the two bones.",
        includes: ["Left fibula", "Right fibula"],
        region: "Lower limbs"
    }
};

export default function SkeletonExplorer() {
    const [selectedBone, setSelectedBone] = useState<string | null>(null);
    const [showLabels, setShowLabels] = useState<boolean>(false);
    const [scale, setScale] = useState<number>(1);
    const [isPanelCollapsed, setIsPanelCollapsed] = useState<boolean>(false);
    const [viewMode, setViewMode] = useState<'front' | 'back'>('front');

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.4, 3));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.4, 1));

    // Interactive SVG styling
    const getStroke = (id: string) => selectedBone === id ? "#f43f5e" : "#cbd5e1";
    const getStrokeWidth = (id: string) => selectedBone === id ? "12" : "10";
    const boneProps = (id: string) => ({
        onClick: () => setSelectedBone(id),
        onMouseEnter: (e: any) => { if (selectedBone !== id) e.target.style.stroke = "#94a3b8" },
        onMouseLeave: (e: any) => { if (selectedBone !== id) e.target.style.stroke = "#cbd5e1" },
        stroke: getStroke(id),
        strokeWidth: getStrokeWidth(id),
        strokeLinecap: "round" as any,
        className: "cursor-pointer transition-all duration-200 hover:drop-shadow-md",
        style: { zIndex: selectedBone === id ? 10 : 1 }
    });

    const activeBoneData = selectedBone ? BONES_DATA[selectedBone] : null;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 font-sans">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 pt-3 pb-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/app/lab/anatomy"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    </Link>
                    <h1 className="text-xl font-bold tracking-tight">Interactive Skeleton System</h1>
                </div>
                <div className="text-sm font-semibold px-4 py-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full">
                    206 Bones Total
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-6 pt-2 pb-4 flex flex-col md:flex-row gap-8 relative">

                {/* ─── LEFT: Interactive SVG Skeleton ─── */}
                <div className="flex-1 bg-[#121826] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center relative overflow-hidden min-h-[600px]">
                    
                    {/* Top Toolbar */}
                    <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20 pointer-events-none">
                        <div className="text-slate-300 text-xs font-medium bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-sm">
                            Select a bone to view details
                        </div>
                        
                        {/* Controls */}
                        <div className="flex items-center gap-1.5 bg-white backdrop-blur-sm p-1 rounded-full border border-slate-200 shadow-sm pointer-events-auto">
                            <button
                                onClick={() => setShowLabels(!showLabels)}
                                className={`px-4 py-1.5 rounded-full text-[11px] font-bold transition-colors flex items-center gap-1.5 ${
                                    showLabels 
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <Tag className="w-3.5 h-3.5" />
                                {showLabels ? 'Labels On' : 'Labels Off'}
                            </button>
                            <div className="w-px h-4 bg-slate-200 mx-0.5" />
                            <button onClick={handleZoomOut} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-full transition-colors" title="Zoom Out">
                                <ZoomOut className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={handleZoomIn} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-full transition-colors" title="Zoom In">
                                <ZoomIn className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* View Toggle */}
                    <div className="absolute top-20 right-6 z-20 pointer-events-auto">
                        <button
                            onClick={() => setViewMode(prev => prev === 'front' ? 'back' : 'front')}
                            className="flex flex-col items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl border border-white/10 shadow-sm transition-all text-slate-300"
                            title="Flip Skeleton"
                        >
                            <RotateCw className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Diagram with Interactive Hotspots */}
                    <motion.div 
                        drag={scale > 1}
                        dragConstraints={{ top: -400, left: -400, right: 400, bottom: 400 }}
                        dragElastic={0.1}
                        animate={{ 
                            scale,
                            x: scale === 1 ? 0 : undefined,
                            y: scale === 1 ? 0 : undefined
                        }} 
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={`relative w-full max-w-[800px] h-full mx-auto origin-center ${scale > 1 ? 'cursor-grab active:cursor-grabbing' : ''}`}
                    >
                        <img 
                            src={viewMode === 'front' 
                                ? (showLabels ? "/lab/human_skeleton_label.png" : "/lab/human_skeleton.png")
                                : "/lab/human_skeleton_back.png"
                            }
                            alt="Skeleton Diagram" 
                            className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-300"
                        />
                        {/* Hotspots mapped over the image text boxes */}
                        {[
                            { id: "skull", top: "20.5%", left: "18.5%", width: "13%", height: "4%" },
                            { id: "sternum", top: "45%", left: "18.5%", width: "13%", height: "4%" },
                            { id: "ribs", top: "51%", left: "18.5%", width: "13%", height: "4%" },
                            { id: "humerus", top: "31.5%", left: "54.5%", width: "13%", height: "4%" },
                            { id: "radius", top: "37%", left: "54.5%", width: "13%", height: "4%" },
                            { id: "ulna", top: "42%", left: "54.5%", width: "13%", height: "4%" },
                            { id: "pelvis", top: "63%", left: "51%", width: "19%", height: "4%" },
                            { id: "femur", top: "69.5%", left: "54.5%", width: "13%", height: "4%" },
                            { id: "tibia", top: "79%", left: "54.5%", width: "13%", height: "4%" },
                            { id: "fibula", top: "84%", left: "54.5%", width: "13%", height: "4%" }
                        ].map((spot) => (
                            <button
                                key={spot.id}
                                onClick={() => setSelectedBone(spot.id)}
                                className={`absolute rounded transition-all duration-200 
                                    ${selectedBone === spot.id
                                        ? 'bg-rose-500/30 border-2 border-rose-500 z-10 scale-[1.05] shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                                        : 'bg-transparent border border-transparent hover:bg-emerald-400/20 hover:border-emerald-400 z-0'
                                    }`}
                                style={{
                                    top: spot.top,
                                    left: spot.left,
                                    width: spot.width,
                                    height: spot.height
                                }}
                                title={`Click to view ${spot.id} details`}
                            />
                        ))}
                    </motion.div>
                </div>

                {/* ─── RIGHT: Bone Information Panel ─── */}
                {isPanelCollapsed && (
                    <button
                        onClick={() => setIsPanelCollapsed(false)}
                        className="absolute top-10 right-6 z-50 p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-xl shadow-lg transition-all"
                        title="Expand Panel"
                    >
                        <PanelRightOpen size={20} />
                    </button>
                )}
                
                <motion.div 
                    animate={{ 
                        width: isPanelCollapsed ? 0 : 400,
                        opacity: isPanelCollapsed ? 0 : 1,
                        marginLeft: isPanelCollapsed ? 0 : 32
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="flex-shrink-0 relative overflow-hidden"
                >
                    <div className="w-[400px]">
                        <AnimatePresence mode="wait">
                            {activeBoneData ? (
                                <motion.div
                                    key={activeBoneData.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-[#121826] text-slate-200 rounded-2xl shadow-2xl overflow-hidden border border-slate-800 relative"
                                >
                                    {/* Collapse Button */}
                                    <button 
                                        onClick={() => setIsPanelCollapsed(true)}
                                        className="absolute top-5 left-5 text-slate-500 hover:text-white transition-colors z-10"
                                        title="Collapse Panel"
                                    >
                                        <PanelRightClose size={20} />
                                    </button>

                                    {/* Modal Header */}
                                    <div className="p-6 pb-4 relative border-b border-slate-800/50 pl-16">
                                        <button
                                            onClick={() => setSelectedBone(null)}
                                            className="absolute top-5 right-5 text-slate-500 hover:text-rose-500 transition-colors"
                                            title="Close Detail"
                                        >
                                            <X size={20} />
                                        </button>

                                        <div className="inline-block px-3 py-1 mb-4 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400 text-[11px] font-bold tracking-wide">
                                            {activeBoneData.type}
                                        </div>
                                    <h2 className="text-3xl font-bold text-white mb-1 tracking-tight">{activeBoneData.name}</h2>
                                    <p className="text-slate-400 italic font-serif text-lg">{activeBoneData.subtitle}</p>
                                </div>

                                {/* Modal Body */}
                                <div className="p-6 space-y-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-bold text-rose-500">{activeBoneData.count}</span>
                                        <span className="text-slate-400 font-medium text-sm">bones in this group</span>
                                    </div>

                                    <div>
                                        <h3 className="text-[11px] font-black text-slate-500 tracking-widest uppercase mb-2">About</h3>
                                        <p className="text-slate-300 leading-relaxed text-[15px] font-medium">
                                            {activeBoneData.about}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-[11px] font-black text-slate-500 tracking-widest uppercase mb-3">Includes</h3>
                                        <ul className="space-y-2">
                                            {activeBoneData.includes.map((inc: string, idx: number) => (
                                                <li key={idx} className="flex items-center gap-3 text-slate-300 text-[15px] font-medium">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                                    {inc}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="p-6 pt-4 border-t border-slate-800/50">
                                    <p className="text-sm font-medium text-slate-400">
                                        Region: <span className="text-slate-300">{activeBoneData.region}</span>
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-slate-100/50 dark:bg-slate-800/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 relative"
                            >
                                {/* Collapse Button */}
                                <button 
                                    onClick={() => setIsPanelCollapsed(true)}
                                    className="absolute top-5 left-5 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors z-10"
                                    title="Collapse Panel"
                                >
                                    <PanelRightClose size={20} />
                                </button>

                                <div className="w-16 h-16 mb-4 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-300 mb-2">No Bone Selected</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-500">
                                    Click on any highlighted bone in the skeleton model to view its detailed information, classification, and anatomy.
                                </p>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
