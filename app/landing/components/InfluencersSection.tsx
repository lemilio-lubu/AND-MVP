"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BrandRadar } from "./BrandRadar";
import { CareerPath } from "./CareerPath";

export function InfluencersSection() {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  return (
    <section
      id="influencers"
      ref={ref}
      className="relative min-h-screen py-fib-6 bg-transparent transition-colors duration-500"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-fib-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-5xl md:text-7xl font-bold text-[var(--text-main)] dark:text-white tracking-tight">
              Tu Talento. <span className="text-[var(--accent)]">Tu Negocio.</span>
            </h2>
            <p className="text-xl text-[var(--text-main)]/80 dark:text-slate-300 mt-fib-2 max-w-2xl mx-auto">
              Deja de ser un amateur. Te damos las herramientas para que cobres y trabajes como una empresa.
            </p>
          </motion.div>
        </div>

        {/* Brand Radar */}
        <BrandRadar />

        {/* Career Path */}
        <CareerPath />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-center mt-fib-6"
        >
          <motion.button
            onClick={() => router.push('/registro/influencer')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-fib-3 py-fib-2 text-lg font-medium rounded-full bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 shadow-lg shadow-green-900/20 transition-all"
          >
            Quiero empezar ya
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
