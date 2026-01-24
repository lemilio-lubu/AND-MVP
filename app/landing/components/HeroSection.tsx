"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 0.5, 1], [0, 50, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

  return (
    <section
      id="hero"
      ref={ref}
      className="relative py-24 md:py-32 flex items-center justify-center overflow-hidden dark:bg-black transition-colors duration-500"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Background Video - UHD Flow */}
        <div className="absolute inset-0 z-0 opacity-75">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover"
          >
            <source src="/images/uhd_30fps.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Abstract Sphere - Image 1 */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[800px] md:h-[800px] opacity-100 z-10"
        >
            <motion.img 
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 8, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                src="/images/hero-sphere.svg" 
                alt="Abstract Sphere" 
                className="w-full h-full object-contain"
            />
        </motion.div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-[120px] z-0" />
      </div>

      <div className="relative z-20 text-center px-4 max-w-5xl">
        <motion.div style={{ y: textY, opacity }}>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-xl md:text-2xl font-medium text-slate-400 mb-fib-2 tracking-widest uppercase"
          >
            AND Ecosystem
          </motion.h2>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-5xl md:text-8xl font-bold mb-fib-3 leading-tight tracking-tight"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400">Gestión.</span>
            <br />
            <span className="text-slate-900 dark:text-white">Inteligente.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto font-light leading-relaxed"
          >
            La forma más fácil de conectar Marcas y Creadores. Automatizamos pagos, contratos y facturas para que tú solo te preocupes por <span className="text-slate-900 dark:text-white font-medium">crear</span> y <span className="text-slate-900 dark:text-white font-medium">crecer</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-fib-4 flex flex-col md:flex-row gap-fib-2 justify-center"
          >
            <button 
              onClick={() => document.getElementById('companies')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-fib-3 py-fib-1 rounded-full bg-white text-black font-semibold text-lg hover:bg-slate-200 transition-colors min-w-[200px]"
            >
              Soy Empresa
            </button>
            <button 
              onClick={() => document.getElementById('influencers')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-fib-3 py-fib-1 rounded-full border border-slate-700 text-white font-semibold text-lg hover:bg-slate-900 transition-colors min-w-[200px]"
            >
              Soy Creador
            </button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Abstract Background - Subtle Titanium Flow */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-slate-700 via-slate-500 to-transparent rounded-full blur-[120px] opacity-30 animate-pulse" />
      </div>
    </section>
  );
}
