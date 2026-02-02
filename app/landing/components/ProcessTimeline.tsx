"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { HandTap, Check, ArrowRight, FileText, Wallet, CurrencyDollar, CheckCircle, RocketLaunch, Play } from "@phosphor-icons/react";

export function ProcessTimeline() {
  const steps = [
    {
      title: "1. Confirmas monto",
      description: "Define tu presupuesto total para la campaña en nuestra calculadora.",
      component: <StepConfirmAmount />
    },
    {
      title: "2. Te facturamos localmente",
      description: "Recibe una única factura válida fiscalmente, sin complicaciones internacionales.",
      component: <StepBilling />
    },
    {
      title: "3. Pagas",
      description: "Realiza un único pago a nuestra cuenta local.",
      component: <StepPayment />
    },
    {
      title: "4. Recargamos tu pauta",
      description: "Tu saldo se acredita inmediatamente en tu cuenta publicitaria.",
      component: <StepRecharge />
    },
    {
      title: "5. Empiezas a pautar",
      description: "Tus campañas se activan al instante y empiezas a ver resultados.",
      component: <StepStartAds />
    }
  ];

  return (
    <div className="max-w-5xl mx-auto mb-fib-6 relative">
        <div className="text-center mb-24 relative z-10">
            <h3 className="text-4xl font-bold text-[var(--text-main)] dark:text-white mb-4">
                Así funciona el proceso
            </h3>
            <p className="text-[var(--text-main)]/70 dark:text-slate-400 text-xl max-w-2xl mx-auto">
                Desde la calculadora hasta tu primera campaña en 5 pasos simples.
            </p>
        </div>
        
        {/* Connecting Line (Desktop only) */}
        <div className="absolute left-4 md:left-1/2 top-40 bottom-20 w-0.5 bg-gradient-to-b from-emerald-500/10 via-emerald-500/30 to-emerald-500/10 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 -translate-x-1/2 hidden md:block" />

        <div className="space-y-24 relative z-10">
            {steps.map((step, index) => (
                <TimelineStep key={index} step={step} index={index} />
            ))}
        </div>
    </div>
  );
}

function TimelineStep({ step, index }: { step: any, index: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, margin: "-20% 0px -20% 0px" });
    
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
        >
            {/* Timeline Dot */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center w-8 h-8 z-10">
                <div className={`w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 shadow-lg transition-all duration-500 ${isInView ? 'bg-emerald-500 scale-150 shadow-emerald-500/50' : 'bg-slate-300 dark:bg-slate-700'}`} />
            </div>

            <div className="flex-1 w-full">
                <div className="bg-white dark:bg-slate-900/50 rounded-3xl p-2 border border-emerald-500/10 dark:border-white/10 shadow-2xl overflow-hidden relative h-80 flex items-center justify-center group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 dark:from-slate-800/50 dark:to-slate-900/50 -z-10" />
                    {step.component}
                </div>
            </div>
            <div className="flex-1 text-center md:text-left">
                <div className="inline-block px-3 py-1 mb-4 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold text-sm uppercase tracking-wider">
                    Paso {index + 1}
                </div>
                <h4 className="text-3xl font-bold text-[var(--text-main)] dark:text-white mb-4">{step.title.split('. ')[1]}</h4>
                <p className="text-[var(--text-main)]/80 dark:text-slate-300 text-lg leading-relaxed">{step.description}</p>
            </div>
        </motion.div>
    )
}

// Step 1: Confirm Amount
function StepConfirmAmount() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false });

    return (
        <div className="relative w-full h-full flex items-center justify-center" ref={ref}>
            {/* Calculator UI Mockup */}
            <motion.div 
                className="w-64 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 flex flex-col gap-3"
            >
                <div className="h-2 w-20 bg-slate-200 dark:bg-slate-600 rounded-full" />
                <div className="h-8 w-full bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center px-3 text-slate-400 font-mono">
                    $ 1,000
                </div>
                <motion.div 
                    className="h-8 w-full bg-emerald-500 rounded-lg flex items-center justify-center text-white font-medium text-sm"
                    animate={isInView ? { scale: [1, 0.95, 1, 1] } : {}}
                    transition={{ 
                        duration: 4,  
                        times: [0, 0.1, 0.2, 1],
                        repeat: Infinity,
                        repeatDelay: 0
                    }}
                >
                    Confirmar
                </motion.div>
            </motion.div>

            {/* Cursor Animation */}
            <motion.div
                initial={{ x: 50, y: 50, opacity: 0 }}
                animate={isInView ? { 
                    x: [50, 0, 0, 50], 
                    y: [50, 30, 30, 50],
                    opacity: [0, 1, 1, 0],
                    scale: [1, 0.9, 1, 1]
                } : {}}
                transition={{ 
                    duration: 4,
                    times: [0, 0.2, 0.3, 1],
                    repeat: Infinity,
                    repeatDelay: 0
                }}
                className="absolute z-20"
            >
                <HandTap size={32} weight="fill" className="text-slate-900 dark:text-white drop-shadow-lg" />
            </motion.div>

            {/* Success Check */}
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { 
                    scale: [0, 1, 1, 0], 
                    opacity: [0, 1, 1, 0] 
                } : {}}
                transition={{ 
                    duration: 4,
                    times: [0.3, 0.4, 0.8, 1],
                    repeat: Infinity,
                    repeatDelay: 0
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white p-3 rounded-full shadow-xl z-30"
            >
                <Check size={32} weight="bold" />
            </motion.div>
        </div>
    );
}

// Step 2: Billing (Adapted from original)
function StepBilling() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false });

    return (
        <div className="relative w-full h-full flex items-center justify-center gap-8" ref={ref}>
             {/* Left Side: Chaos */}
            <div className="relative w-24 h-24 flex items-center justify-center">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        initial={{ x: 0, y: 0, rotate: i * 10 - 10, opacity: 1 }}
                        animate={isInView ? { 
                            x: 60, 
                            y: 0, 
                            opacity: 0,
                            scale: 0.2,
                            rotate: 0
                        } : {}}
                        transition={{ 
                            duration: 0.8, 
                            delay: i * 0.3, 
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatDelay: 2
                        }}
                        className="absolute w-12 h-16 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded shadow-md flex flex-col gap-1 p-1"
                        style={{ zIndex: 10 - i }}
                    >
                        <div className="w-full h-1 bg-slate-200 dark:bg-slate-500 rounded-full" />
                        <div className="w-2/3 h-1 bg-slate-200 dark:bg-slate-500 rounded-full" />
                    </motion.div>
                ))}
            </div>

            <ArrowRight size={24} className="text-slate-300 dark:text-slate-600" />

            {/* Right Side: Order */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={isInView ? { scale: [1, 1.05, 1], opacity: 1 } : {}}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative z-10 w-20 h-28 bg-gradient-to-b from-emerald-600 to-emerald-600/80 rounded-lg shadow-xl flex flex-col items-center justify-center border border-emerald-500/50"
            >
                <FileText size={32} weight="fill" className="text-white mb-1" />
                <div className="w-12 h-1 bg-white/20 rounded-full mb-1" />
                <div className="w-8 h-1 bg-white/20 rounded-full" />
                
                <motion.div
                    animate={isInView ? { scale: [0, 1, 1, 0] } : {}}
                    transition={{ 
                        duration: 3,
                        times: [0.2, 0.3, 0.8, 1],
                        repeat: Infinity,
                        repeatDelay: 0
                    }}
                    className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-lg border border-white dark:border-slate-900"
                >
                    <Check size={12} weight="bold" />
                </motion.div>
            </motion.div>
        </div>
    );
}

// Step 3: Payment
function StepPayment() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false });

    return (
        <div className="relative w-full h-full flex items-center justify-center gap-4 md:gap-8" ref={ref}>
            
            {/* User Phone */}
            <motion.div
                initial={{ x: -30, opacity: 0 }}
                animate={isInView ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-20 h-36 bg-slate-900 dark:bg-slate-800 rounded-2xl border-4 border-slate-200 dark:border-slate-700 shadow-xl flex flex-col items-center p-2"
            >
                <div className="w-8 h-1 bg-slate-600 rounded-full mb-4" />
                {/* Screen Content */}
                <div className="w-full flex-1 bg-slate-800 dark:bg-slate-900 rounded-lg flex flex-col items-center justify-center gap-2 p-1">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                        <Wallet size={16} weight="fill" className="text-emerald-500" />
                    </div>
                    <div className="w-10 h-1.5 bg-slate-600 rounded-full" />
                    <motion.div 
                        animate={isInView ? { scale: [1, 0.9, 1] } : {}}
                        transition={{ delay: 1, duration: 0.3, repeat: Infinity, repeatDelay: 3 }}
                        className="w-12 h-4 bg-emerald-500 rounded-full mt-2" 
                    />
                </div>
            </motion.div>

            {/* Transfer Animation */}
            <div className="relative w-24 md:w-32 h-12 flex items-center justify-center">
                {/* Path Line */}
                <div className="absolute inset-x-0 h-0.5 bg-slate-200 dark:bg-slate-700 border-t border-dashed border-slate-400 dark:border-slate-500" />
                
                {/* Moving Money */}
                <motion.div
                    initial={{ x: -40, opacity: 0, scale: 0 }}
                    animate={isInView ? { 
                        x: [ -40, 40 ], 
                        opacity: [0, 1, 1, 0],
                        scale: 1
                    } : {}}
                    transition={{ 
                        delay: 1.3, 
                        duration: 1, 
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 3
                    }}
                    className="relative z-20 bg-emerald-500 text-white p-2 rounded-full shadow-lg shadow-emerald-500/30"
                >
                    <CurrencyDollar size={20} weight="bold" />
                </motion.div>
            </div>

            {/* Bank Building */}
            <motion.div
                initial={{ x: 30, opacity: 0 }}
                animate={isInView ? { x: 0, opacity: 1 } : {}}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-24 h-24 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl flex flex-col items-center justify-center group"
            >
                <motion.div
                    animate={isInView ? { 
                        y: [0, -5, 0],
                        color: ["#94a3b8", "var(--primary)", "#94a3b8"] // slate-400 to primary
                    } : {}}
                    transition={{ 
                        delay: 2.3,  
                        duration: 0.5,
                        repeat: Infinity,
                        repeatDelay: 3
                    }}
                    className="font-black text-3xl tracking-tighter text-slate-400 dark:text-slate-500"
                >
                    AND
                </motion.div>
                
                {/* Success Badge */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: [0, 1.2, 1], opacity: [0, 1, 0] } : {}}
                    transition={{ 
                        delay: 2.3, 
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 2.5
                    }}
                    className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white dark:border-slate-900"
                >
                    <Check size={14} weight="bold" />
                </motion.div>
            </motion.div>

        </div>
    );
}

// Step 4: Recharge
function StepRecharge() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false });

    return (
        <div className="relative w-full h-full flex items-center justify-center" ref={ref}>
            
            {/* Energy Particles Flowing In */}
            {isInView && [0, 1, 2, 3, 4].map((i) => (
                <motion.div
                    key={i}
                    initial={{ y: -100, x: (Math.random() - 0.5) * 100, opacity: 0 }}
                    animate={{ 
                        y: 0, 
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0]
                    }}
                    transition={{ 
                        duration: 1.5, 
                        delay: i * 0.3,
                        repeat: Infinity,
                        ease: "easeIn"
                    }}
                    className="absolute z-0"
                >
                    <div className="w-1 h-8 bg-emerald-500/50 rounded-full blur-sm" />
                </motion.div>
            ))}

            {/* Main Balance Card */}
            <motion.div 
                initial={{ scale: 0.9 }}
                animate={isInView ? { scale: 1 } : {}}
                className="relative z-10 w-64 h-40 bg-slate-900 dark:bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl flex flex-col items-center justify-center overflow-hidden"
            >
                {/* Background Grid/Tech effect */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500/20 via-transparent to-transparent" />
                
                <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-2 z-10">Saldo Publicitario</p>
                
                <div className="flex items-baseline gap-1 z-10">
                    <span className="text-2xl text-emerald-400 font-bold">$</span>
                    <motion.span 
                        className="text-5xl font-bold text-white tracking-tight"
                    >
                        <LoopingCounter end={1000} duration={3} />
                    </motion.span>
                </div>

                {/* Charging Bar */}
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-800">
                    <motion.div 
                        animate={isInView ? { width: ["0%", "100%", "100%", "0%"] } : {}}
                        transition={{ 
                            duration: 3, 
                            times: [0, 0.6, 0.9, 1],
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    />
                </div>

                {/* Success Flash */}
                <motion.div
                    animate={isInView ? { opacity: [0, 0, 0.5, 0] } : {}}
                    transition={{ duration: 3, times: [0, 0.6, 0.7, 1], repeat: Infinity }}
                    className="absolute inset-0 bg-emerald-500 mix-blend-overlay"
                />
            </motion.div>

            {/* Floating Battery/Wallet Icon */}
            <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={isInView ? { scale: 1, rotate: 10 } : {}}
                transition={{ delay: 0.2, type: "spring" }}
                className="absolute -top-6 -right-6 bg-emerald-500 text-white p-3 rounded-xl shadow-lg z-20 border-4 border-white dark:border-slate-900"
            >
                <Wallet size={28} weight="fill" />
            </motion.div>

             {/* Status Indicator */}
             <motion.div
                animate={isInView ? { opacity: [0, 0, 1, 1, 0], y: [10, 10, 0, 0, 10] } : {}}
                transition={{ duration: 3, times: [0, 0.6, 0.7, 0.9, 1], repeat: Infinity }}
                className="absolute -bottom-12 bg-emerald-500/10 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
            >
                <CheckCircle size={16} weight="fill" />
                Acreditado
            </motion.div>

        </div>
    );
}

// Helper for looping counter
function LoopingCounter({ end, duration }: { end: number, duration: number }) {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        let startTimestamp: number | null = null;
        let animationFrameId: number;

        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = timestamp - startTimestamp;
            
            // Cycle duration in ms
            const cycleDuration = duration * 1000;
            const relativeProgress = (progress % cycleDuration) / cycleDuration;
            
            // Animate from 0 to end in first 60% of cycle, then hold
            let value = 0;
            if (relativeProgress < 0.6) {
                value = Math.min(end, (relativeProgress / 0.6) * end);
            } else if (relativeProgress < 0.9) {
                value = end;
            } else {
                value = 0; // Reset or fade out logic
            }

            setCount(Math.floor(value));
            animationFrameId = requestAnimationFrame(step);
        };

        animationFrameId = requestAnimationFrame(step);
        return () => cancelAnimationFrame(animationFrameId);
    }, [end, duration]);

    return <>{count.toLocaleString()}</>;
}

// Step 5: Start Ads
function StepStartAds() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false });

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden" ref={ref}>
            {/* Graph Background */}
            <div className="absolute inset-0 flex items-end justify-between px-8 pb-8 opacity-30">
                {[20, 35, 30, 50, 45, 70, 65, 90].map((h, i) => (
                    <motion.div
                        key={i}
                        initial={{ height: "10%" }}
                        animate={isInView ? { height: [`${h}%`, `${h + 5}%`, `${h}%`] } : {}}
                        transition={{ 
                            duration: 2, 
                            delay: i * 0.1,
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                        className="w-4 md:w-6 bg-emerald-500 rounded-t-md"
                    />
                ))}
            </div>

            {/* Rocket Container - Flying Path */}
            <motion.div
                initial={{ x: -150, y: 150, opacity: 0 }}
                animate={isInView ? { 
                    x: [ -150, 150 ], 
                    y: [ 150, -150 ],
                    opacity: [0, 1, 1, 0]
                } : {}}
                transition={{ 
                    duration: 3, 
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 0.5
                }}
                className="absolute z-20"
            >
                <div className="relative transform rotate-45">
                    <RocketLaunch size={80} weight="fill" className="text-emerald-500 drop-shadow-2xl" />
                    
                    {/* Engine Fire */}
                    <motion.div
                        animate={{ scale: [1, 1.5, 0.8], opacity: [0.8, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 0.1 }}
                        className="absolute -bottom-4 -left-4 w-10 h-10 bg-orange-500 rounded-full blur-md"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.3, 0.9], opacity: [0.6, 0.9, 0.4] }}
                        transition={{ repeat: Infinity, duration: 0.15, delay: 0.05 }}
                        className="absolute -bottom-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full blur-sm"
                    />
                </div>
            </motion.div>

            {/* Play Button Pulse */}
            <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute bottom-6 right-6 bg-emerald-500 text-white p-4 rounded-full shadow-xl hover:bg-emerald-600 transition-colors cursor-pointer z-30 group"
            >
                <Play size={24} weight="fill" className="group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20" />
            </motion.div>
        </div>
    );
}
