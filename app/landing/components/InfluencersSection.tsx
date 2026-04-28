"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export function InfluencersSection() {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  return (
    <section
      id="billing-start"
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
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold text-[var(--text-main)] dark:text-white tracking-tight">
              Da el paso para <span className="text-[var(--primary)] dark:text-emerald-800">comenzar a facturar.</span>
            </h2>
            <p className="text-lg md:text-xl text-[var(--text-main)]/80 dark:text-slate-300 mt-fib-2 max-w-3xl mx-auto">
              Activa tu operación formal en minutos, centraliza tu información y empieza a emitir comprobantes con una estructura corporativa clara.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="rounded-3xl border border-emerald-700/20 dark:border-emerald-500/30 bg-white/80 dark:bg-white/5 backdrop-blur-sm p-6 md:p-8"
          >
            <h3 className="text-xl md:text-2xl font-semibold text-[var(--text-main)] dark:text-white">1. Configura tu base fiscal</h3>
            <p className="mt-3 text-[var(--text-main)]/80 dark:text-slate-300 leading-relaxed">
              Registra tus datos corporativos y deja lista tu estructura para operar de forma ordenada desde el primer día.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.12, duration: 0.6, ease: "easeOut" }}
            className="rounded-3xl border border-emerald-700/20 dark:border-emerald-500/30 bg-white/80 dark:bg-white/5 backdrop-blur-sm p-6 md:p-8"
          >
            <h3 className="text-xl md:text-2xl font-semibold text-[var(--text-main)] dark:text-white">2. Empieza a facturar</h3>
            <p className="mt-3 text-[var(--text-main)]/80 dark:text-slate-300 leading-relaxed">
              Una vez registrado, tendrás el flujo listo para emitir facturas y gestionar tu operación en un solo lugar.
            </p>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-fib-6"
        >
          <motion.button
            onClick={() => router.push('/login')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-fib-3 py-fib-2 text-lg font-medium rounded-full bg-transparent border-2 border-emerald-600 text-[var(--text-main)] hover:bg-emerald-50 dark:border-emerald-500 dark:text-slate-200 dark:hover:bg-emerald-900/30 transition-all w-full sm:w-auto"
          >
            Facturar
          </motion.button>

          <motion.button
            onClick={() => router.push('/registro/empresa')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-fib-3 py-fib-2 text-lg font-medium rounded-full bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all w-full sm:w-auto"
          >
            Comenzar
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
