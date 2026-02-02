"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function CareerPath() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  const steps = [
    { title: "Verificación", desc: "Demuestra que eres real y confiable." },
    { title: "Profesionalización", desc: "Todo legal, nada de sorpresas." },
    { title: "Crecimiento", desc: "Trabaja con las mejores marcas." },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-5xl mx-auto"
    >
      <h3 className="text-3xl font-bold text-center text-[var(--text-main)] dark:text-white mb-fib-4">
        Tu camino al éxito
      </h3>

      <div className="grid md:grid-cols-3 gap-fib-3">
        {steps.map((step, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            className="bg-[var(--surface)] dark:bg-white/10 border border-emerald-500/10 dark:border-white/10 p-fib-3 rounded-3xl relative overflow-hidden group hover:bg-emerald-500/5 dark:hover:bg-white/20 transition-colors"
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-500/10 dark:bg-white/5 rounded-full blur-2xl group-hover:bg-emerald-500/20 dark:group-hover:bg-white/10 transition-colors" />
            
            <div className="w-10 h-10 bg-emerald-600 dark:bg-emerald-500 text-white dark:text-white rounded-full flex items-center justify-center font-bold text-sm mb-fib-2">
              {i + 1}
            </div>
            <h4 className="text-xl font-semibold text-[var(--text-main)] dark:text-white mt-[8px] mb-fib-1">{step.title}</h4>
            <p className="text-[var(--text-main)]/70 dark:text-slate-400 leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
