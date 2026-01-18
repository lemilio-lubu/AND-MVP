"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check } from "@phosphor-icons/react";

export function BrandRadar() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      className="max-w-5xl mx-auto mb-fib-6"
    >
      <div className="bg-[var(--surface)] dark:bg-white/10 rounded-3xl p-fib-3 border border-[var(--primary)]/20 dark:border-white/10 flex flex-col md:flex-row items-center gap-fib-4">
        <div className="flex-1">
          <h3 className="text-3xl font-bold text-[var(--primary)] dark:text-white mb-fib-2">
            Hazte Notar
          </h3>
          <p className="text-[var(--text-main)]/80 dark:text-slate-300 mb-fib-3 text-lg leading-relaxed">
            Te conectamos con marcas que buscan gente seria como tú. Consigue mejores campañas sin intermediarios.
          </p>
          <ul className="space-y-fib-1 text-[var(--text-main)]/80 dark:text-slate-300">
            <li className="flex items-center gap-fib-1">
              <span className="w-5 h-5 rounded-full bg-[var(--primary)]/10 dark:bg-white/10 flex items-center justify-center text-[var(--primary)] dark:text-white">
                <Check size={12} weight="bold" />
              </span>
              Tu identidad y números verificados
            </li>
            <li className="flex items-center gap-fib-1">
              <span className="w-5 h-5 rounded-full bg-[var(--primary)]/10 dark:bg-white/10 flex items-center justify-center text-[var(--primary)] dark:text-white">
                <Check size={12} weight="bold" />
              </span>
              Contratos digitales claros
            </li>
            <li className="flex items-center gap-fib-1">
              <span className="w-5 h-5 rounded-full bg-[var(--primary)]/10 dark:bg-white/10 flex items-center justify-center text-[var(--primary)] dark:text-white">
                <Check size={12} weight="bold" />
              </span>
              Pagos garantizados
            </li>
          </ul>
        </div>

        <div className="flex-1 relative w-full aspect-square max-w-sm">
          {/* Radar Circles */}
          {[1, 2, 3].map((ring) => (
            <div
              key={ring}
              className="absolute inset-0 rounded-full border border-[var(--primary)]/20 dark:border-white/20"
              style={{
                margin: `${ring * 15}%`,
              }}
            />
          ))}
          
          {/* Scanning Line */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-[var(--primary)]/40 dark:via-white/20 to-transparent"
            style={{ clipPath: "polygon(50% 50%, 100% 0, 100% 50%)" }}
          />

          {/* Center */}
          <div className="absolute inset-0 m-auto w-3 h-3 bg-[var(--primary)] dark:bg-white rounded-full shadow-[0_0_20px_rgba(4,89,50,0.2)] dark:shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
          
          {/* Blips */}
          {[
            { top: "25%", left: "65%" },
            { top: "70%", left: "30%" },
            { top: "40%", left: "80%" },
            { top: "60%", left: "20%" }
          ].map((pos, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
              transition={{ repeat: Infinity, duration: 4, delay: i * 1 }}
              className="absolute w-1.5 h-1.5 bg-[var(--accent)] dark:bg-green-400 rounded-full shadow-[0_0_10px_rgba(3,166,74,0.5)]"
              style={{
                top: pos.top,
                left: pos.left,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
