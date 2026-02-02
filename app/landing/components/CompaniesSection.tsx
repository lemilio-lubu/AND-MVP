"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ROICalculator } from "./ROICalculator";
import { ProcessTimeline } from "./ProcessTimeline";

export function CompaniesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  return (
    <section
      id="companies"
      ref={ref}
      className="relative pt-32 pb-fib-6 dark:bg-[var(--background)] overflow-hidden transition-colors duration-500"
    >
      {/* Titanium Texture - Image 2 */}
      <div className="absolute inset-0 opacity-20 pointer-events-none dark:hidden">
          <img 
              src="/images/abstract_build.jpg" 
              alt="Titanium Texture" 
              className="w-full h-full object-cover grayscale contrast-125"
          />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white dark:from-black dark:via-transparent dark:to-black pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-fib-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-5xl md:text-7xl font-bold text-[var(--text-main)] dark:text-white tracking-tight">
              Ahorra más. <span className="text-[var(--primary)]">Legalmente.</span>
            </h2>
            <p className="text-xl text-[var(--text-main)]/80 dark:text-slate-300 mt-fib-2 max-w-2xl mx-auto">
              Haz que tu presupuesto rinda más deduciendo impuestos correctamente y sin complicaciones.
            </p>
          </motion.div>
        </div>

        {/* ROI Calculator - Glassmorphism Style */}
        <ROICalculator />

        {/* Process Timeline */}
        <ProcessTimeline />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-center mt-fib-6"
        >
          <motion.button
            onClick={() => router.push('/registro/empresa')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-fib-3 py-fib-2 text-lg font-medium rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 shadow-lg shadow-green-900/20 transition-all"
          >
            Optimizar mi gestión
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
