"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Buildings, VideoCamera } from "@phosphor-icons/react";

export function SmartSelector() {
  const router = useRouter();

  return (
    <section className="py-fib-6 dark:bg-black transition-colors duration-500">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-fib-3 max-w-6xl mx-auto">
          {/* Company Card */}
          <motion.div 
            onClick={() => router.push('/registro/empresa')}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="cursor-pointer group relative h-[600px] rounded-[40px] overflow-hidden bg-white dark:bg-slate-900/50 border border-blue-200 dark:border-blue-500/20 shadow-[0_0_40px_rgba(56,189,248,0.1)] hover:shadow-[0_0_60px_rgba(56,189,248,0.2)] transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative h-full flex flex-col justify-between p-fib-4">
              <div>
                <div className="mb-fib-2 inline-flex p-fib-1 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(56,189,248,0.1)]">
                  <Buildings size={32} weight="duotone" />
                </div>
                <h3 className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-fib-1">Para Empresas</h3>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-fib-2">Todo bajo control.</h2>
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  Un solo lugar para pagar a todos, deducir impuestos y eliminar los riesgos de la informalidad.
                </p>
              </div>
              
              <div className="mt-fib-3">
                <div 
                  className="inline-flex items-center gap-[8px] text-blue-600 dark:text-blue-400 font-medium border-b border-blue-500/30 pb-1 group-hover:border-blue-600 dark:group-hover:border-blue-400 transition-colors"
                >
                  Soluciones Corporativas <span className="text-xl">→</span>
                </div>
              </div>
            </div>
            
            {/* Abstract Visual */}
            <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-tl-[100px] blur-2xl" />
          </motion.div>

          {/* Creator Card */}
          <motion.div 
            onClick={() => router.push('/registro/influencer')}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="cursor-pointer group relative h-[600px] rounded-[40px] overflow-hidden bg-white dark:bg-slate-900/50 border border-purple-200 dark:border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.1)] hover:shadow-[0_0_60px_rgba(168,85,247,0.2)] transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative h-full flex flex-col justify-between p-fib-4">
              <div>
                <div className="mb-fib-2 inline-flex p-fib-1 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                  <VideoCamera size={32} weight="duotone" />
                </div>
                <h3 className="text-sm font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-fib-1">Para Creadores</h3>
                <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-fib-2">Sube de nivel.</h2>
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
                  Trabaja con grandes marcas, asegura tu pago siempre y construye tu futuro financiero.
                </p>
              </div>
              
              <div className="mt-fib-3">
                <div 
                  className="inline-flex items-center gap-[8px] text-purple-600 dark:text-purple-400 font-medium border-b border-purple-500/30 pb-1 group-hover:border-purple-600 dark:group-hover:border-purple-400 transition-colors"
                >
                  Unirse al Ecosystem <span className="text-xl">→</span>
                </div>
              </div>
            </div>

            {/* Abstract Visual */}
            <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-tl-[100px] blur-2xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
