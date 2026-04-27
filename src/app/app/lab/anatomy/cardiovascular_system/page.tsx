"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Info, Activity } from "lucide-react";
import Link from "next/link";

const HEART_IMAGES = [
    { id: 'heart', src: '/lab/heart/heart.png', title: 'External Heart', desc: 'A comprehensive view of the exterior of the human heart, showing the major vessels and surface anatomy.' },
    { id: 'anatomy', src: '/lab/heart/heart_anatomy.png', title: 'Internal Anatomy', desc: 'Detailed internal view revealing the four chambers: right and left atria, right and left ventricles.' },
    { id: 'cardiac_cycle1', src: '/lab/heart/heart_cardiac_cycle1.png', title: 'Cardiac Cycle: Diastole', desc: 'Phase where the heart muscle relaxes and allows the chambers to fill with blood.' },
    { id: 'cardiac_cycle2', src: '/lab/heart/heart_cardiac_cycle2.png', title: 'Cardiac Cycle: Systole', desc: 'Phase where the heart muscle contracts and pumps blood from the chambers into the arteries.' },
    { id: 'cardiac_cycle3', src: '/lab/heart/heart_cardiac_cycle3.png', title: 'Cardiac Cycle: Ejection', desc: 'Blood is forcefully ejected from the ventricles into the pulmonary trunk and aorta.' },
    { id: 'cardiac_cycle4', src: '/lab/heart/heart_cardiac_cycle4.png', title: 'Cardiac Cycle: Relaxation', desc: 'The ventricles relax, preparing for the next cycle of filling.' },
    { id: 'conduction', src: '/lab/heart/heart_conduction.png', title: 'Conduction System', desc: 'The electrical wiring of the heart, starting from the SA node to the Purkinje fibers.' },
    { id: 'left_ventricular', src: '/lab/heart/heart_left_ventricular.png', title: 'Left Ventricle', desc: 'The thickest of the hearts chambers, responsible for pumping oxygenated blood to tissues all over the body.' },
    { id: 'mitrale_valve', src: '/lab/heart/heart_mitrale_valve.png', title: 'Mitral Valve', desc: 'Also known as the bicuspid valve, it regulates blood flow from the left atrium into the left ventricle.' },
    { id: 'pacemaker', src: '/lab/heart/heart_pacemaker.png', title: 'Sinoatrial Node', desc: 'The natural pacemaker of the heart, responsible for initiating the heartbeat.' },
    { id: 'pulmonary', src: '/lab/heart/heart_pulmonary_circulation.png', title: 'Pulmonary Circulation', desc: 'The circuit through the lungs where blood is oxygenated.' },
    { id: 'sections', src: '/lab/heart/heart_sections.png', title: 'Cross Sections', desc: 'Cross-sectional planes showing the relative thickness of the myocardial walls.' },
    { id: 'sideview', src: '/lab/heart/heart_sideview.png', title: 'Lateral View', desc: 'A side perspective highlighting the coronary sulcus and descending vessels.' },
    { id: 'vascularisation', src: '/lab/heart/heart_vascularisation.png', title: 'Coronary Circulation', desc: 'The network of blood vessels that supply oxygen and nutrients directly to the heart muscle.' }
];

export default function CardiovascularSystem() {
    const [selectedImage, setSelectedImage] = useState(HEART_IMAGES[0]);

    return (
        <div className="h-[calc(100vh-64px)] overflow-hidden bg-slate-50 dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 font-sans flex flex-col">
            {/* Header */}
            <div className="max-w-7xl w-full mx-auto px-6 pt-3 pb-2 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <Link
                        href="/app/lab/anatomy"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    </Link>
                    <h1 className="text-xl font-bold tracking-tight">Cardiovascular System</h1>
                </div>
                <div className="flex items-center gap-2 text-sm font-semibold px-4 py-2 bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 rounded-full">
                    <Activity className="w-4 h-4" /> Heart Anatomy Lab
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 max-w-7xl w-full mx-auto px-6 pt-2 pb-6 flex flex-col md:flex-row gap-6 overflow-hidden">
                
                {/* Floating Thumbnails Left */}
                <div className="w-full md:w-[200px] lg:w-[224px] shrink-0 flex flex-col h-full overflow-hidden">
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-3 px-2 uppercase tracking-widest flex items-center justify-between gap-2">
                        <span>Image Gallery</span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 whitespace-nowrap text-center shrink-0">
                            {HEART_IMAGES.length} views
                        </span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 hide-scrollbar pb-10">
                        {HEART_IMAGES.map((img) => (
                            <button
                                key={img.id}
                                onClick={() => setSelectedImage(img)}
                                className={`w-full text-left rounded-2xl overflow-hidden border-2 transition-all duration-300 relative group flex flex-col bg-white dark:bg-[#121826] ${
                                    selectedImage.id === img.id 
                                    ? 'border-rose-500 shadow-md ring-4 ring-rose-500/20' 
                                    : 'border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-500/50 hover:shadow-sm'
                                }`}
                            >
                                <div className="h-[100px] bg-[#0A101C] w-full overflow-hidden flex items-center justify-center p-3 relative">
                                    <img 
                                        src={img.src} 
                                        alt={img.title} 
                                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 relative z-0"
                                    />
                                </div>
                                <div className="p-2.5 bg-[#121826] border-t border-slate-800">
                                    <h3 className={`text-xs font-bold truncate text-center transition-colors ${
                                        selectedImage.id === img.id ? 'text-rose-400' : 'text-slate-300'
                                    }`}>
                                        {img.title}
                                    </h3>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Viewer */}
                <div className="flex-1 bg-[#121826] rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-lg relative overflow-hidden flex flex-col h-full">
                    {/* Toolbar */}
                    <div className="absolute top-6 left-6 right-6 z-20 flex justify-between pointer-events-none">
                        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-sm text-slate-200 text-sm font-semibold pointer-events-auto flex items-center gap-2">
                            <Info className="w-4 h-4 text-rose-400" />
                            {selectedImage.title}
                        </div>
                    </div>

                    <div className="flex-1 w-full h-full relative p-6 md:p-8 flex items-center justify-center min-h-0">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={selectedImage.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                src={selectedImage.src}
                                alt={selectedImage.title}
                                className="w-full h-full max-w-[800px] object-contain drop-shadow-2xl"
                            />
                        </AnimatePresence>
                    </div>

                    {/* Info Panel Bottom */}
                    <div className="w-full p-6 pt-0 shrink-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedImage.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white/5 border border-slate-800 px-6 py-4 rounded-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
                                <h2 className="text-lg font-bold text-white mb-1 tracking-tight">{selectedImage.title}</h2>
                                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                                    {selectedImage.desc}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </div>
    );
}
