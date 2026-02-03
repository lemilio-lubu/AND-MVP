"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CaretRight } from "@phosphor-icons/react";

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
      className="relative py-24 md:py-32 flex items-center justify-center overflow-hidden dark:bg-[var(--background)] transition-colors duration-500"
    >
      {/* Brand Logo - Top Left */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="absolute top-4 left-4 md:top-10 md:left-10 z-30 flex items-center gap-2"
      >
        <img src="/assets/logos-01.png" alt="AND Logo" className="h-24 sm:h-32 md:h-48 w-auto dark:hidden transition-all duration-300" />
        <img src="/assets/logos-02.png" alt="AND Logo" className="h-24 sm:h-32 md:h-48 w-auto hidden dark:block transition-all duration-300" />
      </motion.div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none dark:hidden">
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
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold mb-fib-3 leading-tight tracking-tight"
          >
            <span className="text-[var(--primary)] dark:text-white">Factura local,</span>
            <br />
            <span className="text-[var(--hero-inteligente)] dark:text-white">sin complicaciones.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-xl md:text-2xl text-[var(--text-main)] dark:text-slate-300 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Nacionaliza tus facturas de publicidad digital y paga menos impuestos
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-fib-4 flex flex-col md:flex-row gap-fib-2 justify-center"
          >
            <button 
              onClick={() => document.getElementById('companies')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-fib-3 py-fib-1 rounded-full bg-[var(--accent)] text-white font-semibold text-lg hover:bg-[var(--primary)] transition-colors min-w-[200px] shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 group"
            >
              Soy Empresa
              <CaretRight weight="bold" className="group-hover:translate-x-1 transition-transform" />
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
