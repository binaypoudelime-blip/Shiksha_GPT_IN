"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator, Globe, Timer, DollarSign, RefreshCw, Play, Pause, Square, ArrowRightLeft, Search, Edit2, ChevronLeft, ChevronDown, CloudRain, TreePine, Headphones, Sparkles } from "lucide-react";
import Link from "next/link";

const Pomodoro = ({ onActiveChange }: { onActiveChange?: (active: boolean) => void }) => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState(25);

    const [countdown, setCountdown] = useState<number | null>(null);
    const isDimmed = isActive || countdown !== null;

    const [activeSound, setActiveSound] = useState<string | null>(null);
    const audioRef = React.useRef<HTMLAudioElement>(null);

    const playBeep = (freq: number, type: OscillatorType = 'sine') => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
        } catch (e) {}
    };

    const focusSounds = [
        { id: 'forest', icon: TreePine, url: '/music/forest.mp3', label: 'Forest' },
        { id: 'rain', icon: CloudRain, url: '/music/rain.mp3', label: 'Rain' },
        { id: 'lofi', icon: Headphones, url: '/music/lofi.mp3', label: 'Lo-Fi' },
        { id: 'inspiring', icon: Sparkles, url: '/music/inspiring.mp3', label: 'Inspiring' },
    ];

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (activeSound) {
                setActiveSound(null);
                if (audioRef.current) audioRef.current.pause();
            }
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, activeSound]);

    useEffect(() => {
        if (countdown !== null) {
            if (countdown > 0) {
                const timer = setTimeout(() => {
                    setCountdown(countdown - 1);
                    playBeep(440 + (3 - countdown) * 100);
                }, 1000);
                return () => clearTimeout(timer);
            } else {
                const timer = setTimeout(() => {
                    setCountdown(null);
                    setIsActive(true);
                    playBeep(880, 'square');
                }, 1000);
                return () => clearTimeout(timer);
            }
        }
    }, [countdown]);

    useEffect(() => {
        if (onActiveChange) onActiveChange(isDimmed);
    }, [isDimmed, onActiveChange]);

    const toggleSound = (id: string) => {
        if (activeSound === id) {
            setActiveSound(null);
            if (audioRef.current) audioRef.current.pause();
        } else {
            setActiveSound(id);
            if (audioRef.current) {
                audioRef.current.src = focusSounds.find(s => s.id === id)?.url || '';
                audioRef.current.play().catch(() => { /* Handle silently to prevent dev overlay */ });
            }
        }
    };

    const toggleTimer = () => {
        if (!isActive && countdown === null) {
            setCountdown(3);
            playBeep(440);
        } else {
            setIsActive(false);
            setCountdown(null);
        }
    };
    
    const resetTimer = () => {
        setIsActive(false);
        setCountdown(null);
        setTimeLeft(mode * 60);
    };

    const setTimerMode = (m: number) => {
        setMode(m);
        setIsActive(false);
        setCountdown(null);
        setTimeLeft(m * 60);
    };

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const progress = ((mode * 60 - timeLeft) / (mode * 60)) * 100;

    // SVG Circle Math
    const radius = 76;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className={`bg-white dark:bg-[#121214] rounded-2xl p-6 shadow-sm border border-orange-200 dark:border-orange-900/30 flex flex-col h-full transition-all duration-500 ${isDimmed ? 'scale-[1.02] shadow-2xl ring-4 ring-orange-500/20 shadow-orange-500/10 bg-white/95 dark:bg-[#121214]/95' : ''}`}>
            <div className="flex items-center gap-2 mb-6 text-orange-600 dark:text-orange-400 font-bold text-xl">
                <Timer className="w-6 h-6" />
                Pomodoro
            </div>

            <div className="flex-1 flex flex-col items-center justify-center py-2">
                {/* Circular Timer */}
                <div className="relative w-48 h-48 flex flex-col items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle cx="96" cy="96" r={radius} className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="6" fill="none" />
                        <circle
                            cx="96" cy="96" r={radius}
                            className="stroke-orange-500 dark:stroke-orange-400 transition-all duration-1000"
                            strokeWidth="6" fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                        />
                    </svg>
                    {countdown !== null ? (
                        <motion.div 
                            key={countdown}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-5xl font-black text-orange-500 z-10"
                        >
                            {countdown > 0 ? countdown : "GO!"}
                        </motion.div>
                    ) : (
                        <>
                            <div className="text-4xl font-light text-slate-800 dark:text-white tracking-tight z-10 mb-1">
                                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                            </div>
                            <div className="text-[10px] font-medium text-slate-500 uppercase tracking-widest z-10">Focus Mode</div>
                        </>
                    )}
                </div>

                {/* Modes */}
                <div className="flex gap-2 mt-8">
                    {[25, 5, 15].map(m => (
                        <button
                            key={m}
                            onClick={() => setTimerMode(m)}
                            className={`w-10 h-10 rounded-full text-sm font-bold transition-colors ${mode === m ? 'bg-orange-200 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            {/* Focus Sounds */}
            <div className="flex gap-2 mt-6 w-full">
                {focusSounds.map(s => {
                    const Icon = s.icon;
                    const isSelected = activeSound === s.id;
                    return (
                        <button
                            key={s.id}
                            onClick={() => toggleSound(s.id)}
                            title={`${s.label} Sound`}
                            className={`flex-1 h-11 rounded-xl flex items-center justify-center transition-all duration-300 border-2 ${isSelected ? 'bg-orange-100 border-orange-400 text-orange-600 dark:bg-orange-500/20 dark:border-orange-500/50 dark:text-orange-400' : 'bg-transparent border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200 dark:hover:border-slate-700 hover:text-slate-600 dark:hover:text-slate-300'}`}
                        >
                            <Icon className={`w-5 h-5 ${isSelected ? 'animate-pulse' : ''}`} />
                        </button>
                    );
                })}
            </div>

            <audio ref={audioRef} loop />

            <div className="flex gap-3 mt-3">
                <button onClick={toggleTimer} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-3 flex items-center justify-center gap-2 font-bold transition-colors shadow-sm">
                    {isDimmed ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                    {isDimmed ? "Pause" : "Start"}
                </button>
                <button onClick={resetTimer} className="w-12 h-12 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 transition-colors">
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

const UnitConverter = () => {
    const [value, setValue] = useState<string>("1");
    const [type, setType] = useState("Length");
    const [fromUnit, setFromUnit] = useState("Meter (m)");
    const [toUnit, setToUnit] = useState("Foot (ft)");

    const types: any = {
        "Length": {
            "Millimeter (mm)": 1000,
            "Centimeter (cm)": 100,
            "Meter (m)": 1,
            "Kilometer (km)": 0.001,
            "Inch (in)": 39.3701,
            "Foot (ft)": 3.28084,
            "Yard (yd)": 1.09361,
            "Mile (mi)": 0.000621371,
            "Nautical Mile (nm)": 0.000539957
        },
        "Weight / Mass": {
            "Milligram (mg)": 1000000,
            "Gram (g)": 1000,
            "Kilogram (kg)": 1,
            "Tonne (t)": 0.001,
            "Ounce (oz)": 35.274,
            "Pound (lb)": 2.20462,
            "Stone (st)": 0.157473
        },
        "Temperature": { "Celsius (°C)": 'C', "Fahrenheit (°F)": 'F', "Kelvin (K)": 'K' },
        "Area": {
            "Square Meter (m²)": 1,
            "Square Kilometer (km²)": 0.000001,
            "Square Centimeter (cm²)": 10000,
            "Square Millimeter (mm²)": 1000000,
            "Acre (ac)": 0.000247105,
            "Hectare (ha)": 0.0001,
            "Square Mile (mi²)": 0.0000003861,
            "Square Yard (yd²)": 1.19599,
            "Square Foot (ft²)": 10.7639,
            "Square Inch (in²)": 1550
        },
        "Volume": {
            "Cubic Meter (m³)": 1,
            "Liter (L)": 1000,
            "Milliliter (mL)": 1000000,
            "Gallon (US gal)": 264.172,
            "Quart (US qt)": 1056.69,
            "Pint (US pt)": 2113.38,
            "Cup (US cup)": 4226.75,
            "Fluid Ounce (US fl oz)": 33814,
            "Cubic Foot (ft³)": 35.3147,
            "Cubic Inch (in³)": 61023.7
        },
        "Speed": {
            "Meter per second (m/s)": 1,
            "Kilometer per hour (km/h)": 3.6,
            "Mile per hour (mph)": 2.23694,
            "Foot per second (ft/s)": 3.28084,
            "Knot (kn)": 1.94384
        },
        "Data Storage": {
            "Bit (b)": 8589934592,
            "Byte (B)": 1073741824,
            "Kilobyte (KB)": 1048576,
            "Megabyte (MB)": 1024,
            "Gigabyte (GB)": 1,
            "Terabyte (TB)": 0.0009765625,
            "Petabyte (PB)": 0.00000095367432
        },
        "Time": {
            "Millisecond (ms)": 86400000,
            "Second (s)": 86400,
            "Minute (min)": 1440,
            "Hour (h)": 24,
            "Day (d)": 1,
            "Week (wk)": 0.142857,
            "Month (mo)": 0.0328767,
            "Year (yr)": 0.00273973
        },
        "Energy": {
            "Joule (J)": 1,
            "Kilojoule (kJ)": 0.001,
            "Gram calorie (cal)": 0.239006,
            "Kilocalorie (kcal)": 0.000239006,
            "Watt hour (Wh)": 0.000277778,
            "Kilowatt hour (kWh)": 0.000000277778,
            "Electronvolt (eV)": 6.242e18,
            "British thermal unit (Btu)": 0.000947817
        },
        "Pressure": {
            "Pascal (Pa)": 1,
            "Kilopascal (kPa)": 0.001,
            "Bar (bar)": 0.00001,
            "Atmosphere (atm)": 0.00000986923,
            "Torr (Torr)": 0.00750062,
            "Pound per square inch (psi)": 0.000145038
        }
    };

    const convert = () => {
        const val = parseFloat(value) || 0;
        if (type === 'Temperature') {
            const f = types['Temperature'][fromUnit];
            const t = types['Temperature'][toUnit];
            if (f === 'C' && t === 'F') return (val * 9 / 5) + 32;
            if (f === 'F' && t === 'C') return (val - 32) * 5 / 9;
            if (f === 'C' && t === 'K') return val + 273.15;
            if (f === 'K' && t === 'C') return val - 273.15;
            if (f === 'F' && t === 'K') return (val - 32) * 5 / 9 + 273.15;
            if (f === 'K' && t === 'F') return (val - 273.15) * 9 / 5 + 32;
            return val;
        }
        const base = val / types[type][fromUnit];
        return base * types[type][toUnit];
    };

    return (
        <div className="bg-white dark:bg-[#121214] rounded-2xl p-6 shadow-sm border border-indigo-100 dark:border-indigo-900/30">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                    <Calculator className="w-5 h-5" />
                    Unit Converter
                </div>
                <select
                    value={type}
                    onChange={(e) => {
                        setType(e.target.value);
                        setFromUnit(Object.keys(types[e.target.value])[0]);
                        setToUnit(Object.keys(types[e.target.value])[1]);
                    }}
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                >
                    {Object.keys(types).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                {/* Left Column (From) */}
                <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">From</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                        <select
                            value={fromUnit}
                            onChange={e => setFromUnit(e.target.value)}
                            className="w-24 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                        >
                            {Object.keys(types[type]).map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                </div>

                {/* Swap Arrow */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => { const temp = fromUnit; setFromUnit(toUnit); setToUnit(temp); }}
                        className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-full flex items-center justify-center transition-colors shadow-sm"
                    >
                        <ArrowRightLeft className="w-4 h-4" />
                    </button>
                </div>

                {/* Right Column (To) */}
                <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">To</label>
                    <div className="flex gap-2">
                        <div className="w-full bg-indigo-50/50 dark:bg-indigo-900/10 text-indigo-600 dark:text-indigo-400 border border-indigo-50 dark:border-indigo-800/30 rounded-lg px-4 py-3 text-sm font-medium flex items-center overflow-hidden">
                            {convert().toFixed(3).replace(/\.?0+$/, '')}
                        </div>
                        <select
                            value={toUnit}
                            onChange={e => setToUnit(e.target.value)}
                            className="w-24 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 dark:text-slate-300 outline-none cursor-pointer"
                        >
                            {Object.keys(types[type]).map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

const currencyNames: Record<string, string> = {
    AED: "United Arab Emirates Dirham", AFN: "Afghan Afghani", ALL: "Albanian Lek", AMD: "Armenian Dram", ANG: "Netherlands Antillean Guilder", AOA: "Angolan Kwanza", ARS: "Argentine Peso", AUD: "Australian Dollar", AWG: "Aruban Florin", AZN: "Azerbaijani Manat", BAM: "Bosnia-Herzegovina Convertible Mark", BBD: "Barbadian Dollar", BDT: "Bangladeshi Taka", BGN: "Bulgarian Lev", BHD: "Bahraini Dinar", BIF: "Burundian Franc", BMD: "Bermudan Dollar", BND: "Brunei Dollar", BOB: "Bolivian Boliviano", BRL: "Brazilian Real", BSD: "Bahamian Dollar", BTN: "Bhutanese Ngultrum", BWP: "Botswanan Pula", BYN: "New Belarusian Ruble", BZD: "Belize Dollar", CAD: "Canadian Dollar", CDF: "Congolese Franc", CHF: "Swiss Franc", CLP: "Chilean Peso", CNY: "Chinese Yuan", COP: "Colombian Peso", CRC: "Costa Rican Colón", CUP: "Cuban Peso", CVE: "Cape Verdean Escudo", CZK: "Czech Republic Koruna", DJF: "Djiboutian Franc", DKK: "Danish Krone", DOP: "Dominican Peso", DZD: "Algerian Dinar", EGP: "Egyptian Pound", ERN: "Eritrean Nakfa", ETB: "Ethiopian Birr", EUR: "Euro", FJD: "Fijian Dollar", FKP: "Falkland Islands Pound", GBP: "British Pound", GEL: "Georgian Lari", GHS: "Ghanaian Cedi", GIP: "Gibraltar Pound", GMD: "Gambian Dalasi", GNF: "Guinean Franc", GTQ: "Guatemalan Quetzal", GYD: "Guyanaese Dollar", HKD: "Hong Kong Dollar", HNL: "Honduran Lempira", HRK: "Croatian Kuna", HTG: "Haitian Gourde", HUF: "Hungarian Forint", IDR: "Indonesian Rupiah", ILS: "Israeli New Sheqel", INR: "Indian Rupee", IQD: "Iraqi Dinar", IRR: "Iranian Rial", ISK: "Icelandic Króna", JMD: "Jamaican Dollar", JOD: "Jordanian Dinar", JPY: "Japanese Yen", KES: "Kenyan Shilling", KGS: "Kyrgystani Som", KHR: "Cambodian Riel", KMF: "Comorian Franc", KPW: "North Korean Won", KRW: "South Korean Won", KWD: "Kuwaiti Dinar", KYD: "Cayman Islands Dollar", KZT: "Kazakhstani Tenge", LAK: "Laotian Kip", LBP: "Lebanese Pound", LKR: "Sri Lankan Rupee", LRD: "Liberian Dollar", LSL: "Lesotho Loti", LYD: "Libyan Dinar", MAD: "Moroccan Dirham", MDL: "Moldovan Leu", MGA: "Malagasy Ariary", MKD: "Macedonian Denar", MMK: "Myanma Kyat", MNT: "Mongolian Tugrik", MOP: "Macanese Pataca", MRU: "Mauritanian Ouguiya", MUR: "Mauritian Rupee", MVR: "Maldivian Rufiyaa", MWK: "Malawian Kwacha", MXN: "Mexican Peso", MYR: "Malaysian Ringgit", MZN: "Mozambican Metical", NAD: "Namibian Dollar", NGN: "Nigerian Naira", NIO: "Nicaraguan Córdoba", NOK: "Norwegian Krone", NPR: "Nepalese Rupee", NZD: "New Zealand Dollar", OMR: "Omani Rial", PAB: "Panamanian Balboa", PEN: "Peruvian Nuevo Sol", PGK: "Papua New Guinean Kina", PHP: "Philippine Peso", PKR: "Pakistani Rupee", PLN: "Polish Zloty", PYG: "Paraguayan Guarani", QAR: "Qatari Rial", RON: "Romanian Leu", RSD: "Serbian Dinar", RUB: "Russian Ruble", RWF: "Rwandan Franc", SAR: "Saudi Riyal", SBD: "Solomon Islands Dollar", SCR: "Seychellois Rupee", SDG: "Sudanese Pound", SEK: "Swedish Krona", SGD: "Singapore Dollar", SHP: "Saint Helena Pound", SLL: "Sierra Leonean Leone", SOS: "Somali Shilling", SRD: "Surinamese Dollar", SSP: "South Sudanese Pound", STN: "São Tomé and Príncipe Dobra", SYP: "Syrian Pound", SZL: "Swazi Lilangeni", THB: "Thai Baht", TJS: "Tajikistani Somoni", TMT: "Turkmenistani Manat", TND: "Tunisian Dinar", TOP: "Tongan Pa'anga", TRY: "Turkish Lira", TTD: "Trinidad and Tobago Dollar", TWD: "New Taiwan Dollar", TZS: "Tanzanian Shilling", UAH: "Ukrainian Hryvnia", UGX: "Ugandan Shilling", USD: "US Dollar", UYU: "Uruguayan Peso", UZS: "Uzbekistan Som", VES: "Venezuelan Bolívar", VND: "Vietnamese Dong", VUV: "Vanuatu Vatu", WST: "Samoan Tala", XAF: "CFA Franc BEAC", XCD: "East Caribbean Dollar", XDR: "Special Drawing Rights", XOF: "CFA Franc BCEAO", XPF: "CFP Franc", YER: "Yemeni Rial", ZAR: "South African Rand", ZMW: "Zambian Kwacha", ZWL: "Zimbabwean Dollar"
};

const CurrencySelect = ({ value, onChange, rates, isTo }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openUpwards, setOpenUpwards] = useState(isTo);
    const ref = React.useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect();
                const spaceBelow = window.innerHeight - rect.bottom;
                // If there's less than ~320px below, but more space above, open upwards
                if (spaceBelow < 320 && rect.top > spaceBelow) {
                    setOpenUpwards(true);
                } else {
                    setOpenUpwards(false);
                }
            }
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <div className="relative" ref={ref}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className={`text-xs font-bold bg-transparent outline-none cursor-pointer flex items-center gap-1 ${isTo ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-1 rounded' : 'text-slate-600 dark:text-slate-300'}`}
            >
                {value} <ChevronDown className="w-3 h-3"/>
            </div>
            {isOpen && (
                <div className={`absolute ${openUpwards ? 'bottom-full mb-2' : 'top-full mt-2'} left-0 w-64 max-h-80 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg shadow-2xl z-[100] p-1`}>
                    {Object.keys(rates).map(c => (
                        <div 
                            key={c} 
                            onClick={() => { onChange(c); setIsOpen(false); }}
                            className={`px-3 py-2.5 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer rounded-md flex items-center gap-2 ${value === c ? 'font-bold bg-slate-50 dark:bg-slate-700 text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'}`}
                        >
                            <span className="w-8 shrink-0">{c}</span>
                            <span className="opacity-70 truncate">{currencyNames[c] || c}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const CurrencyConverter = () => {
    const [amount, setAmount] = useState<string>("1250");
    const [fromCur, setFromCur] = useState("USD");
    const [toCur, setToCur] = useState("EUR");
    const [rates, setRates] = useState<Record<string, number>>({});

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const res = await fetch('https://open.er-api.com/v6/latest/USD');
                const data = await res.json();
                if (data && data.rates) {
                    setRates(data.rates);
                }
            } catch (err) {
                console.error("Failed to fetch rates", err);
            }
        };
        fetchRates();
    }, []);

    const convert = () => {
        const val = parseFloat(amount) || 0;
        if (!rates[fromCur] || !rates[toCur]) return 0;
        const baseUSD = val / rates[fromCur];
        return baseUSD * rates[toCur];
    };

    return (
        <div className="bg-white dark:bg-[#121214] rounded-2xl p-6 shadow-sm border border-emerald-200 dark:border-emerald-900/30 flex flex-col h-full relative">
            <div className="flex items-center gap-2 mb-6 text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                <DollarSign className="w-5 h-5" />
                Currency
            </div>

            <div className="relative">
                {/* From Box */}
                <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between relative">
                    <div className="flex items-center gap-3 w-full">
                        <CurrencySelect value={fromCur} onChange={setFromCur} rates={rates} isTo={false} />
                        <input
                            type="number"
                            className="bg-transparent font-medium text-slate-800 dark:text-white outline-none w-full ml-2"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                        />
                    </div>
                    <Edit2 className="w-4 h-4 text-slate-400 shrink-0" />
                </div>

                {/* Swap Button */}
                <button
                    onClick={() => { const temp = fromCur; setFromCur(toCur); setToCur(temp); }}
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center shadow-sm border-2 border-white dark:border-[#121214] z-10 transition-transform active:scale-95"
                >
                    <ArrowRightLeft className="w-3 h-3 rotate-90" />
                </button>

                {/* To Box */}
                <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100/50 dark:border-emerald-800/30 rounded-xl p-4 flex items-center justify-between mt-2 relative">
                    <div className="flex items-center gap-3 w-full">
                        <CurrencySelect value={toCur} onChange={setToCur} rates={rates} isTo={true} />
                        <span className="font-bold text-emerald-800 dark:text-emerald-300 overflow-hidden text-ellipsis whitespace-nowrap ml-2">
                            {convert().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">+0.12%</span>
                </div>
            </div>

            <div className="flex gap-2 mt-auto pt-6 relative z-0">
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-800 flex-1 text-center truncate">
                    {rates['GBP'] ? `GBP/USD: ${(1/rates['GBP']).toFixed(2)}` : 'GBP/USD: 1.27'}
                </div>
                <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-800 flex-1 text-center truncate">
                    {rates['JPY'] ? `JPY/USD: ${(1/rates['JPY']).toFixed(3)}` : 'JPY/USD: 0.006'}
                </div>
            </div>
        </div>
    );
};

const WorldTime = () => {
    const [time, setTime] = useState(new Date());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    const zones = [
        { name: "New York", tz: "America/New_York", offset: "-5h" },
        { name: "London", tz: "Europe/London", offset: "+0h" },
        { name: "Tokyo", tz: "Asia/Tokyo", offset: "+9h" }
    ];

    if (!mounted) return null;

    return (
        <div className="bg-white dark:bg-[#121214] rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                    <Globe className="w-5 h-5" />
                    World Time
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-800 flex flex-col items-end">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Local Time</span>
                    <span className="text-sm font-black text-slate-700 dark:text-slate-200">
                        {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>

            <div className="relative mb-5">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                    type="text"
                    placeholder="Add city..."
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2.5 text-sm outline-none placeholder:text-slate-400 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500/20"
                />
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-3 custom-scrollbar">
                {zones.map((z, i) => (
                    <div key={i} className="flex justify-between items-center pb-4 border-b border-slate-50 dark:border-slate-800/50 last:border-0 last:pb-0">
                        <div>
                            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{z.name}</div>
                            <div className="text-[11px] text-slate-500 mt-0.5">Today, {z.offset}</div>
                        </div>
                        <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
                            {time.toLocaleTimeString('en-US', { timeZone: z.tz, hour: '2-digit', minute: '2-digit', hour12: true })}
                        </div>
                    </div>
                ))}
            </div>
            {/* Scrollbar styling */}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 4px;
                }
                :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #334155;
                }
            `}</style>
        </div>
    );
};

export default function UtilityVersePage() {
    const [pomodoroActive, setPomodoroActive] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-[#0c0c0e] px-8 pb-8 pt-6 relative">
            {/* Dim Overlay when Pomodoro is active */}
            {pomodoroActive && (
                <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-[2px] z-50 transition-opacity duration-500 pointer-events-none" />
            )}

            {/* Top Navigation / Header */}
            <div className={`flex items-start justify-between w-full mb-8 relative ${pomodoroActive ? 'z-0' : 'z-10'}`}>
                {/* Left */}
                <div className="w-1/4 pt-2">
                    <Link href="/app/dashboard" className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 font-bold text-sm transition-colors group w-max">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Dashboard
                    </Link>
                </div>

                {/* Center - Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex-1 flex flex-col items-center text-center"
                >
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white relative">
                            <Calculator className="w-5 h-5 absolute opacity-50 blur-[1px]" />
                            <Globe className="w-5 h-5 relative z-10" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">UtilityVerse</h1>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">
                        Student power tools, all in one place.
                    </p>
                </motion.div>

                {/* Right */}
                <div className="w-1/4 flex justify-end pt-1">
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text" 
                            placeholder="Search tools..." 
                            className="w-64 bg-white dark:bg-[#121214] border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm outline-none placeholder:text-slate-400 text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500/20 shadow-sm transition-shadow"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto">

                {/* Grid Layout based on Mockup */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left & Middle columns wrapper */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        {/* Unit Converter spans top */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                            <UnitConverter />
                        </motion.div>

                        {/* Currency & World Time side-by-side */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="h-full">
                                <CurrencyConverter />
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="h-full">
                                <WorldTime />
                            </motion.div>
                        </div>
                    </div>

                    {/* Right column: Pomodoro (full height) */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className={`lg:col-span-1 transition-all duration-500 ${pomodoroActive ? 'relative z-[100]' : 'relative z-10'}`}
                    >
                        <Pomodoro onActiveChange={setPomodoroActive} />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
