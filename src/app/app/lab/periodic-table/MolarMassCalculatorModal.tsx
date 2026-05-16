import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Type, Receipt, Trash2, Printer, X } from "lucide-react";

interface ElementData {
    name: string;
    symbol: string;
    atomic_mass: number;
    category: string;
}

const PREDEFINED = [
    { formula: "H2O", name: "Water" },
    { formula: "NaCl", name: "Salt" },
    { formula: "CO2", name: "Carbon Dioxide" },
    { formula: "C6H12O6", name: "Glucose" },
];

interface MolarMassCalculatorModalProps {
    isOpen: boolean;
    onClose: () => void;
    elements: any[];
}

export default function MolarMassCalculatorModal({ isOpen, onClose, elements }: MolarMassCalculatorModalProps) {
    const [elementsMap, setElementsMap] = useState<Record<string, ElementData>>({});
    const [formula, setFormula] = useState("H2O");
    const [showTicket, setShowTicket] = useState(false);
    const [isPrinting, setIsPrinting] = useState(false);
    const [useExactDecimals, setUseExactDecimals] = useState(false);

    useEffect(() => {
        if (elements && elements.length > 0) {
            const map: Record<string, ElementData> = {};
            elements.forEach((el: any) => {
                map[el.symbol] = el;
            });
            setElementsMap(map);
        }
    }, [elements]);

    // Reset state whenever the modal is opened
    useEffect(() => {
        if (isOpen) {
            setFormula("H2O");
            setShowTicket(false);
            setIsPrinting(false);
            setUseExactDecimals(false);
        }
    }, [isOpen]);

    const parsedFormula = useMemo(() => {
        if (!formula) return { parsed: {}, error: null };
        try {
            const stack: Record<string, number>[] = [{}];
            let i = 0;
            let isValid = true;

            while (i < formula.length) {
                const char = formula[i];
                if (char === ' ') {
                    i++;
                    continue;
                }

                if (char === '(') {
                    stack.push({});
                    i++;
                } else if (char === ')') {
                    i++;
                    let mult = '';
                    while (i < formula.length && /[0-9]/.test(formula[i])) {
                        mult += formula[i];
                        i++;
                    }
                    const m = mult ? parseInt(mult) : 1;
                    if (stack.length <= 1) { isValid = false; break; }
                    const top = stack.pop()!;
                    const current = stack[stack.length - 1];
                    for (const [sym, count] of Object.entries(top)) {
                        current[sym] = (current[sym] || 0) + count * m;
                    }
                } else if (/[A-Z]/.test(char)) {
                    let sym = char;
                    i++;
                    if (i < formula.length && /[a-z]/.test(formula[i])) {
                        sym += formula[i];
                        i++;
                    }
                    let count = '';
                    while (i < formula.length && /[0-9]/.test(formula[i])) {
                        count += formula[i];
                        i++;
                    }
                    const c = count ? parseInt(count) : 1;
                    const current = stack[stack.length - 1];
                    current[sym] = (current[sym] || 0) + c;
                } else {
                    isValid = false;
                    break;
                }
            }
            if (!isValid || stack.length > 1) {
                return { parsed: {}, error: "Invalid formula structure" };
            }

            for (const sym of Object.keys(stack[0])) {
                if (!elementsMap[sym]) {
                    return { parsed: {}, error: `Unknown element: ${sym}` };
                }
            }

            return { parsed: stack[0], error: null };
        } catch (e) {
            return { parsed: {}, error: "Parsing error" };
        }
    }, [formula, elementsMap]);

    const handlePrintTicket = () => {
        if (parsedFormula.error || Object.keys(parsedFormula.parsed).length === 0) return;
        setIsPrinting(true);
        setShowTicket(false);
        setTimeout(() => {
            setIsPrinting(false);
            setShowTicket(true);
        }, 600);
    };

    const getFormattedHTML = (form: string) => {
        return form.replace(/([A-Za-z])([0-9]+)/g, '$1<sub>$2</sub>');
    };

    let totalMass = 0;
    const breakdown = Object.entries(parsedFormula.parsed).map(([sym, count]) => {
        const el = elementsMap[sym];
        const mass = el ? el.atomic_mass : 0;
        const total = mass * count;
        totalMass += total;
        return { sym, count, mass, total };
    });

    const formatMass = (val: number) => {
        return useExactDecimals ? val.toFixed(3) : Math.round(val).toString();
    };

    const isFormulaValid = !parsedFormula.error && Object.keys(parsedFormula.parsed).length > 0;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
                        className="bg-white dark:bg-[#121214] w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors z-20"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Molar Mass Calculator</h1>

                            <div className="flex flex-col lg:flex-row gap-12">
                                {/* Left Controls */}
                                <div className="w-full lg:w-[400px] shrink-0">
                                    <div className="bg-slate-50 dark:bg-[#1A1A1E] rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-5 h-5 rounded bg-indigo-500 text-white flex items-center justify-center font-bold text-[10px]">
                                                <Type className="w-3 h-3" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Chemical Formula</span>
                                        </div>

                                        <input
                                            type="text"
                                            value={formula}
                                            onChange={(e) => {
                                                setFormula(e.target.value);
                                                setShowTicket(false);
                                            }}
                                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-lg font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 mb-4 transition-all"
                                            placeholder="e.g. H2O, CaCO3..."
                                        />

                                        <div className="flex items-center justify-between mb-4 px-1">
                                            <span className="text-sm font-medium text-slate-500">Formula:</span>
                                            <span
                                                className="text-xl font-black text-slate-800 dark:text-slate-200"
                                                dangerouslySetInnerHTML={{ __html: getFormattedHTML(formula || '?') }}
                                            />
                                        </div>

                                        <div className={`w-full py-2.5 rounded-lg text-center font-bold text-sm transition-colors ${!formula ? 'bg-slate-200 dark:bg-slate-800 text-slate-500' :
                                            parsedFormula.error ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                                                'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                                            }`}>
                                            {!formula ? 'Enter a formula' : parsedFormula.error ? parsedFormula.error : 'Looks good'}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-3 mt-5">
                                        <button
                                            onClick={() => { setFormula(""); setShowTicket(false); }}
                                            className="px-6 py-4 bg-slate-50 dark:bg-[#1A1A1E] border border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            <Trash2 className="w-4 h-4" /> Clear
                                        </button>

                                        <button
                                            onClick={handlePrintTicket}
                                            disabled={!isFormulaValid || isPrinting}
                                            className="flex-1 py-4 bg-[#334155] hover:bg-[#1E293B] disabled:opacity-50 disabled:hover:bg-[#334155] text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95"
                                        >
                                            <Printer className="w-4 h-4" /> Print Ticket
                                        </button>

                                        <button
                                            onClick={() => setUseExactDecimals(!useExactDecimals)}
                                            className={`w-14 h-14 rounded-2xl border font-bold transition-all shadow-sm flex items-center justify-center ${useExactDecimals ? 'bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-400' : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-[#1A1A1E] dark:border-slate-800'}`}
                                            title="Toggle Exact Decimals"
                                        >
                                            .00
                                        </button>
                                    </div>

                                    {/* Predefined Chips */}
                                    <div className="flex flex-wrap gap-2 mt-6">
                                        {PREDEFINED.map(pre => (
                                            <button
                                                key={pre.formula}
                                                onClick={() => { setFormula(pre.formula); setShowTicket(false); }}
                                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${formula === pre.formula ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800/50 dark:text-indigo-300 ring-1 ring-indigo-500/20' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 dark:bg-[#1A1A1E] dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 shadow-sm'
                                                    }`}
                                            >
                                                <span dangerouslySetInnerHTML={{ __html: getFormattedHTML(pre.formula) }} className="font-black" />
                                                <span className="text-slate-400 font-medium">{pre.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Right Visuals */}
                                <div className="flex-1 min-h-[350px] flex items-start justify-center pt-8 relative perspective-1000">
                                    <div className="relative w-full max-w-sm flex flex-col items-center">

                                        {/* Flying Blocks (Elements) */}
                                        <div className="absolute -top-16 left-0 w-full flex justify-center gap-3 z-20 pointer-events-none h-16">
                                            <AnimatePresence>
                                                {isFormulaValid && Object.keys(parsedFormula.parsed).slice(0, 3).map((sym, idx) => (
                                                    <motion.div
                                                        key={sym + formula}
                                                        initial={{ y: -80, opacity: 0, rotate: -20 }}
                                                        animate={{ y: 0, opacity: 1, rotate: 0 }}
                                                        transition={{ type: "spring", bounce: 0.6, duration: 0.8, delay: idx * 0.1 }}
                                                        className={`w-12 h-12 rounded-2xl shadow-lg flex items-center justify-center font-black text-lg text-white ${idx === 0 ? 'bg-rose-500' : idx === 1 ? 'bg-emerald-500' : 'bg-blue-500'
                                                            }`}
                                                        style={{ transformStyle: 'preserve-3d', zIndex: 10 - idx }}
                                                    >
                                                        {sym}
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>

                                        {/* Device / Scale */}
                                        <div className="w-full h-20 bg-gradient-to-b from-[#E2E8F0] to-[#CBD5E1] dark:from-[#334155] dark:to-[#1E293B] rounded-3xl shadow-2xl relative z-10 border-b-8 border-[#94A3B8] dark:border-[#0F172A] flex items-center justify-center p-3 transform-gpu rotate-x-12">
                                            {/* Device Screen */}
                                            <div className="w-3/4 h-10 bg-[#0F172A] rounded-lg border-[3px] border-[#334155] dark:border-[#475569] shadow-inner flex items-center justify-center overflow-hidden relative">
                                                <div className="font-mono text-xl font-bold text-emerald-400 tracking-widest flex items-baseline gap-2 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]">
                                                    {isFormulaValid ? formatMass(totalMass) : '0'}
                                                    <span className="text-[10px] text-emerald-600/70">g/mol</span>
                                                </div>
                                            </div>

                                            {/* Slot */}
                                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-1.5 bg-black/40 rounded-full blur-[1px]" />
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-black rounded-b-xl overflow-hidden" />
                                        </div>

                                        {/* Drop shadow of device */}
                                        <div className="w-[110%] h-6 bg-black/10 dark:bg-black/40 blur-xl rounded-full absolute top-16 z-0" />

                                        {/* Ticket */}
                                        <AnimatePresence>
                                            {showTicket && (
                                                <motion.div
                                                    key="receipt-ticket"
                                                    initial={{ y: -100, opacity: 0, rotateX: 60 }}
                                                    animate={{ y: 24, opacity: 1, rotateX: 0 }}
                                                    exit={{ y: -50, opacity: 0 }}
                                                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                                    className="absolute top-16 z-0 w-[85%] bg-[#F8FAFC] dark:bg-[#F1F5F9] rounded-b-sm shadow-xl border border-slate-200 overflow-hidden text-slate-800"
                                                    style={{ transformOrigin: "top center" }}
                                                >
                                                    <div className="w-full h-4 flex items-end justify-between px-2 overflow-hidden opacity-30 mt-1">
                                                        {Array.from({ length: 30 }).map((_, i) => (
                                                            <div key={i} className="w-1 h-2 bg-slate-800 transform rotate-12" />
                                                        ))}
                                                    </div>

                                                    <div className="p-5 pb-6 font-mono flex flex-col">
                                                        <h2 className="text-center font-black tracking-[0.2em] mb-1 text-slate-700 text-xs">WEIGHT TICKET</h2>
                                                        <div className="text-center text-[9px] text-slate-400 mb-3">{new Date().toLocaleTimeString()}</div>

                                                        <div className="space-y-1.5 mb-3">
                                                            {breakdown.map(({ sym, count, mass, total }) => (
                                                                <div key={sym} className="flex justify-between items-end border-b border-slate-200 border-dashed pb-0.5">
                                                                    <div className="flex gap-2 items-baseline">
                                                                        <span className="font-bold text-sm">{sym}</span>
                                                                        <span className="text-[10px] text-slate-500">x{count}</span>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <div className="text-xs font-bold">{formatMass(total)}</div>
                                                                        <div className="text-[8px] text-slate-400">({formatMass(mass)} ea)</div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className="flex justify-between items-center pt-2 border-t-2 border-slate-800 mt-auto">
                                                            <span className="font-black text-base tracking-wider">Total</span>
                                                            <div className="flex items-baseline gap-1">
                                                                <span className="font-black text-base">{formatMass(totalMass)}</span>
                                                                <span className="text-[9px] text-slate-500">g/mol</span>
                                                            </div>
                                                        </div>

                                                        <div className="text-center text-[8px] text-slate-300 mt-4 uppercase tracking-widest font-bold">
                                                            Thank you!
                                                        </div>
                                                    </div>

                                                    <div className="absolute bottom-0 left-0 w-full h-1.5 flex">
                                                        {Array.from({ length: 40 }).map((_, i) => (
                                                            <div key={i} className="flex-1 h-full bg-white dark:bg-[#121214]" style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }} />
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
