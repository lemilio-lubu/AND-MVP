"use client";

import { motion, useScroll, useTransform, useInView, MotionValue } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Warning, ShieldCheck, CheckCircle, FileText, Check, ArrowRight, Buildings, VideoCamera, CreditCard, Wallet, RocketLaunch, Play, CurrencyDollar, Receipt, HandTap, Lightning } from "@phosphor-icons/react";
import { ThemeToggle } from "@/app/components/ui/ThemeToggle";

export default function LandingPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Background color transitions based on scroll
  const bgColors = (mounted && theme === 'light') 
    ? ["#ffffff", "#f0f9ff", "#eef2ff", "#f8fafc", "#ffffff"]
    : ["#0f172a", "#0c4a6e", "#1e1b4b", "#0f172a", "#0f172a"];

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.15, 0.5, 0.85, 1],
    bgColors
  );

  return (
    <motion.div
      ref={containerRef}
      style={{ backgroundColor }}
      className="relative w-full text-slate-900 dark:text-slate-100 transition-colors duration-500"
    >
      <div className="fixed top-fib-2 right-fib-3 z-50 flex items-center gap-fib-1 mix-blend-difference">
        <ThemeToggle />
        <button 
          onClick={() => router.push('/login')}
          className="px-fib-2 py-[8px] rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-sm font-medium text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300"
        >
          Iniciar Sesión
        </button>
      </div>
      <StickyNavigation />
      <HeroSection />
      <TrustedBySection />
      <SmartSelector />
      <CompaniesSection />
      <InfluencersSection />
      <UnifiedFooter />
    </motion.div>
  );
}

// Sticky Navigation Indicator
function StickyNavigation() {
  const [currentZone, setCurrentZone] = useState("intro");

  useEffect(() => {
    // 1. Main sections (center of viewport)
    const mainObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === "hero") setCurrentZone("intro");
            if (entry.target.id === "companies") setCurrentZone("companies");
            if (entry.target.id === "influencers") setCurrentZone("influencers");
          }
        });
      },
      {
        rootMargin: "-50% 0px -50% 0px",
        threshold: 0
      }
    );

    // 2. Footer (bottom of viewport)
    const footerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentZone("footer");
          } else {
             // When footer leaves (scrolling up), revert to influencers
             if (entry.boundingClientRect.top > 0) {
                 setCurrentZone("influencers");
             }
          }
        });
      },
      {
        rootMargin: "0px", // Trigger as soon as it enters
        threshold: 0.3 // 10% visible
      }
    );

    const sections = ["hero", "companies", "influencers"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) mainObserver.observe(el);
    });

    const footer = document.getElementById("footer");
    if (footer) footerObserver.observe(footer);

    return () => {
      mainObserver.disconnect();
      footerObserver.disconnect();
    };
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed right-fib-3 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-fib-2 items-end mix-blend-difference">
      <NavDot active={currentZone === "intro"} label="Inicio" onClick={() => scrollTo('hero')} />
      <NavDot active={currentZone === "companies"} label="Empresas" onClick={() => scrollTo('companies')} />
      <NavDot active={currentZone === "influencers"} label="Creadores" onClick={() => scrollTo('influencers')} />
      <NavDot active={currentZone === "footer"} label="Contacto" onClick={() => scrollTo('footer')} />
    </div>
  );
}

function NavDot({
  active,
  label,
  onClick
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button 
      onClick={onClick}
      className="group flex items-center gap-fib-1 flex-row-reverse focus:outline-none"
    >
      <div className={`relative flex items-center justify-center transition-all duration-500 ${active ? 'w-4 h-4' : 'w-2 h-2'}`}>
        {/* Active Ring */}
        <span className={`absolute inset-0 rounded-full border border-white transition-all duration-500 ${active ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
        
        {/* Core Dot */}
        <span className={`rounded-full transition-all duration-500 ${active ? 'w-1.5 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-slate-600 group-hover:bg-slate-400'}`} />
      </div>
      
      <span className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 ${active ? "opacity-100 translate-x-0 text-white" : "opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 text-slate-500"}`}>
        {label}
      </span>
    </button>
  );
}

// Hero Section: The Reveal
function HeroSection() {
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
      className="relative h-screen flex items-center justify-center overflow-hidden dark:bg-black transition-colors duration-500"
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

// Trusted By Section
function TrustedBySection() {
  return (
    <section className="py-fib-4 border-b border-slate-200 dark:border-white/5 dark:bg-black transition-colors duration-500">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm font-medium text-slate-500 uppercase tracking-widest mb-fib-3">
          Integrado con las plataformas líderes
        </p>
        <div className="flex flex-wrap justify-center items-center gap-fib-4 md:gap-fib-5 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
           {/* Placeholders for Logos - Using Text for now */}
           {["Facebook", "Instagram", "TikTok", "Google", "YouTube"].map((brand) => (
             <span key={brand} className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white font-serif italic tracking-tight">
               {brand}
             </span>
           ))}
        </div>
      </div>
    </section>
  );
}

// Smart Selector: Bento Grid Style
function SmartSelector() {
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

// CompaniesSection
function CompaniesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  return (
    <section
      id="companies"
      ref={ref}
      className="relative min-h-screen py-fib-6 dark:bg-black overflow-hidden transition-colors duration-500"
    >
      {/* Titanium Texture - Image 2 */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
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
            <h2 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tight">
              Ahorra más. <span className="text-slate-500">Legalmente.</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mt-fib-2 max-w-2xl mx-auto">
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
            className="px-fib-3 py-fib-2 text-lg font-medium rounded-full bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors"
          >
            Optimizar mi gestión
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

// ROI Calculator Component
function ROICalculator() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false });
  const [investment, setInvestment] = useState(1000);

  // Calculate scenarios
  const calculateScenarios = (amount: number) => {
    // Scenario BAD: Direct payment to influencer
    const directISD = amount * 0.05; // 5% ISD
    const directIVA = amount * 0.15; // 15% IVA
    const directTotal = amount + directISD + directIVA;
    // const directNonDeductible = directTotal; // Non-deductible

    // Scenario GOOD: Through LocalAds
    const localAdsIVA = amount * 0.15; // 15% IVA
    const localAdsTotal = amount + localAdsIVA;
    // const localAdsDeductible = localAdsTotal; // Fully deductible

    // Savings
    const savings = directTotal - localAdsTotal;
    const savingsPercent = (savings / directTotal) * 100;

    return {
      direct: {
        base: amount,
        isd: directISD,
        iva: directIVA,
        total: directTotal,
      },
      localAds: {
        base: amount,
        iva: localAdsIVA,
        total: localAdsTotal,
      },
      savings,
      savingsPercent,
    };
  };

  const scenarios = calculateScenarios(investment);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      className="max-w-5xl mx-auto mb-32"
    >
      <div className="bg-glass-apple rounded-fib-3 p-8 md:p-fib-4 border border-slate-200 dark:border-white/10 shadow-2xl">
        
        {/* Input Section */}
        <div className="mb-fib-3 max-w-xl mx-auto">
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-fib-1 uppercase tracking-wider text-center">
              Presupuesto Mensual ($)
            </label>
            <div className="relative">
              <span className="absolute left-fib-2 top-1/2 -translate-y-1/2 text-slate-400 text-xl">$</span>
              <input
                type="number"
                min="0"
                value={investment}
                onChange={(e) => setInvestment(Number(e.target.value))}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-fib-2 py-fib-1 pl-[40px] pr-fib-2 text-3xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-center"
              />
            </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-fib-2 mb-fib-3">
          {/* BAD Scenario */}
          <div className="bg-slate-100 dark:bg-black/40 rounded-fib-2 p-fib-2 border border-red-200 dark:border-red-900/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-red-500">
              <Warning size={64} weight="fill" />
            </div>
            <h4 className="text-lg font-semibold text-red-500 dark:text-red-400 mb-6 flex items-center gap-2">
              Pagando por fuera / Informal
            </h4>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Costo Base</span>
                <span>${scenarios.direct.base.toLocaleString("en-US")}</span>
              </div>
              <div className="flex justify-between text-red-500/80 dark:text-red-400/80">
                <span>ISD (5%)</span>
                <span>+${scenarios.direct.isd.toLocaleString("en-US")}</span>
              </div>
              <div className="flex justify-between text-red-500/80 dark:text-red-400/80">
                <span>IVA No Deducible</span>
                <span>+${scenarios.direct.iva.toLocaleString("en-US")}</span>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-white/5 flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Costo Real</span>
                <span className="text-2xl font-bold text-red-500 dark:text-red-400">${scenarios.direct.total.toLocaleString("en-US")}</span>
              </div>
              <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-300 px-3 py-2 rounded-fib-1 text-xs text-center">
                Dinero que pierdes en impuestos
              </div>
            </div>
          </div>

          {/* GOOD Scenario */}
          <div className="bg-white dark:bg-sky-900/10 rounded-fib-2 p-fib-2 border border-sky-200 dark:border-sky-500/30 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 text-sky-400">
              <ShieldCheck size={64} weight="fill" />
            </div>
            <h4 className="text-lg font-semibold text-sky-600 dark:text-sky-400 mb-6 flex items-center gap-2">
              Usando AND
            </h4>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Costo Base</span>
                <span>${scenarios.localAds.base.toLocaleString("en-US")}</span>
              </div>
              <div className="flex justify-between text-emerald-600/80 dark:text-emerald-400/80">
                <span>ISD (0%)</span>
                <span>$0</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>IVA (Crédito Fiscal)</span>
                <span>+${scenarios.localAds.iva.toLocaleString("en-US")}</span>
              </div>
              <div className="pt-4 border-t border-sky-200 dark:border-sky-900/30 flex justify-between items-center">
                <span className="text-slate-700 dark:text-slate-300">Inversión Neta</span>
                <span className="text-2xl font-bold text-sky-600 dark:text-sky-400">${scenarios.localAds.total.toLocaleString("en-US")}</span>
              </div>
              <div className="bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-3 py-2 rounded-fib-1 text-xs text-center border border-emerald-200 dark:border-emerald-900/30 flex items-center justify-center gap-2">
                <CheckCircle size={16} weight="fill" />
                100% Deducible y sin dolores de cabeza
              </div>
            </div>
          </div>
        </div>

        {/* Result Section - Green Translucent */}
        <div className="bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 rounded-fib-3 p-fib-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[233px] h-[233px] bg-emerald-500/20 rounded-full blur-fib-5 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-fib-2">
                <div className="text-center md:text-left">
                    <h4 className="text-emerald-600 dark:text-emerald-400 text-lg font-medium mb-[8px]">Lo que te ahorras</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md">
                        Deja de perder dinero y evita problemas legales con nuestra plataforma.
                    </p>
                </div>

                <div className="flex flex-col items-center md:items-end gap-[8px]">
                    <div className="flex items-baseline gap-fib-1">
                        <span className="text-sm text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-wider font-semibold">Ahorro Mensual</span>
                        <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                            ${scenarios.savings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                         <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-fib-1 py-[5px] rounded-full text-xs font-bold">
                            +{scenarios.savingsPercent.toFixed(1)}% Eficiencia
                         </span>
                         <span className="text-lg font-medium text-slate-600 dark:text-slate-300">
                            Anual: <span className="font-bold text-emerald-600 dark:text-emerald-400">${(scenarios.savings * 12).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                         </span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
}

// Process Timeline
function ProcessTimeline() {
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
            <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Así funciona el proceso
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-xl max-w-2xl mx-auto">
                Desde la calculadora hasta tu primera campaña en 5 pasos simples.
            </p>
        </div>
        
        {/* Connecting Line (Desktop only) */}
        <div className="absolute left-4 md:left-1/2 top-40 bottom-20 w-0.5 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 -translate-x-1/2 hidden md:block" />

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
                <div className={`w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 shadow-lg transition-all duration-500 ${isInView ? 'bg-blue-500 scale-150 shadow-blue-500/50' : 'bg-slate-300 dark:bg-slate-700'}`} />
            </div>

            <div className="flex-1 w-full">
                <div className="bg-white dark:bg-slate-900/50 rounded-3xl p-2 border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden relative h-80 flex items-center justify-center group">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 -z-10" />
                    {step.component}
                </div>
            </div>
            <div className="flex-1 text-center md:text-left">
                <div className="inline-block px-3 py-1 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold text-sm uppercase tracking-wider">
                    Paso {index + 1}
                </div>
                <h4 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{step.title.split('. ')[1]}</h4>
                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">{step.description}</p>
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
                    className="h-8 w-full bg-blue-600 rounded-lg flex items-center justify-center text-white font-medium text-sm"
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
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white p-3 rounded-full shadow-xl z-30"
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
                className="relative z-10 w-20 h-28 bg-gradient-to-b from-blue-600 to-blue-800 rounded-lg shadow-xl flex flex-col items-center justify-center border border-blue-400"
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
                    className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1 rounded-full shadow-lg border border-white dark:border-slate-900"
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
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Wallet size={16} weight="fill" className="text-blue-500" />
                    </div>
                    <div className="w-10 h-1.5 bg-slate-600 rounded-full" />
                    <motion.div 
                        animate={isInView ? { scale: [1, 0.9, 1], backgroundColor: ["#2563eb", "#1d4ed8", "#2563eb"] } : {}}
                        transition={{ delay: 1, duration: 0.3, repeat: Infinity, repeatDelay: 3 }}
                        className="w-12 h-4 bg-blue-600 rounded-full mt-2" 
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
                    className="relative z-20 bg-green-500 text-white p-2 rounded-full shadow-lg shadow-green-500/30"
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
                        color: ["#94a3b8", "#10b981", "#94a3b8"] // slate-400 to emerald-500
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
                    className="absolute -top-2 -right-2 bg-green-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white dark:border-slate-900"
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
                    <div className="w-1 h-8 bg-green-500/50 rounded-full blur-sm" />
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
                    <span className="text-2xl text-green-500 font-bold">$</span>
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
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    />
                </div>

                {/* Success Flash */}
                <motion.div
                    animate={isInView ? { opacity: [0, 0, 0.5, 0] } : {}}
                    transition={{ duration: 3, times: [0, 0.6, 0.7, 1], repeat: Infinity }}
                    className="absolute inset-0 bg-green-500 mix-blend-overlay"
                />
            </motion.div>

            {/* Floating Battery/Wallet Icon */}
            <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={isInView ? { scale: 1, rotate: 10 } : {}}
                transition={{ delay: 0.2, type: "spring" }}
                className="absolute -top-6 -right-6 bg-green-500 text-white p-3 rounded-xl shadow-lg z-20 border-4 border-white dark:border-slate-900"
            >
                <Wallet size={28} weight="fill" />
            </motion.div>

             {/* Status Indicator */}
             <motion.div
                animate={isInView ? { opacity: [0, 0, 1, 1, 0], y: [10, 10, 0, 0, 10] } : {}}
                transition={{ duration: 3, times: [0, 0.6, 0.7, 0.9, 1], repeat: Infinity }}
                className="absolute -bottom-12 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
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
                        className="w-4 md:w-6 bg-blue-500 rounded-t-md"
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
                    <RocketLaunch size={80} weight="fill" className="text-blue-600 dark:text-blue-400 drop-shadow-2xl" />
                    
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
                className="absolute bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-xl hover:bg-green-600 transition-colors cursor-pointer z-30 group"
            >
                <Play size={24} weight="fill" className="group-hover:scale-110 transition-transform" />
                <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
            </motion.div>
        </div>
    );
}

// Influencers Section
function InfluencersSection() {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  return (
    <section
      id="influencers"
      ref={ref}
      className="relative min-h-screen py-fib-6 dark:bg-black transition-colors duration-500"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-fib-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tight">
              Tu Talento. <span className="text-amber-500/80">Tu Negocio.</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mt-fib-2 max-w-2xl mx-auto">
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
            className="px-fib-3 py-fib-2 text-lg font-medium rounded-full bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors"
          >
            Quiero empezar ya
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

// Brand Radar Component (Refined)
function BrandRadar() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      className="max-w-5xl mx-auto mb-fib-6"
    >
      <div className="bg-white dark:bg-white/10 rounded-3xl p-fib-3 border border-slate-200 dark:border-white/10 flex flex-col md:flex-row items-center gap-fib-4">
        <div className="flex-1">
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-fib-2">
            Hazte Notar
          </h3>
          <p className="text-slate-600 dark:text-slate-300 mb-fib-3 text-lg leading-relaxed">
            Te conectamos con marcas que buscan gente seria como tú. Consigue mejores campañas sin intermediarios.
          </p>
          <ul className="space-y-fib-1 text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-fib-1">
              <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-900 dark:text-white">
                <Check size={12} weight="bold" />
              </span>
              Tu identidad y números verificados
            </li>
            <li className="flex items-center gap-fib-1">
              <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-900 dark:text-white">
                <Check size={12} weight="bold" />
              </span>
              Contratos digitales claros
            </li>
            <li className="flex items-center gap-fib-1">
              <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-900 dark:text-white">
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
              className="absolute inset-0 rounded-full border border-slate-300 dark:border-white/20"
              style={{
                margin: `${ring * 15}%`,
              }}
            />
          ))}
          
          {/* Scanning Line */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-slate-400/20 dark:via-white/20 to-transparent"
            style={{ clipPath: "polygon(50% 50%, 100% 0, 100% 50%)" }}
          />

          {/* Center */}
          <div className="absolute inset-0 m-auto w-3 h-3 bg-slate-900 dark:bg-white rounded-full shadow-[0_0_20px_rgba(0,0,0,0.2)] dark:shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
          
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
              className="absolute w-1.5 h-1.5 bg-amber-500 dark:bg-amber-200 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]"
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

// Career Path (Formerly Gamification)
function CareerPath() {
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
      <h3 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-fib-4">
        Tu camino al éxito
      </h3>

      <div className="grid md:grid-cols-3 gap-fib-3">
        {steps.map((step, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            className="bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 p-fib-3 rounded-3xl relative overflow-hidden group hover:bg-slate-50 dark:hover:bg-white/20 transition-colors"
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-slate-200/50 dark:bg-white/5 rounded-full blur-2xl group-hover:bg-slate-300/50 dark:group-hover:bg-white/10 transition-colors" />
            
            <div className="w-10 h-10 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-bold text-sm mb-fib-2">
              {i + 1}
            </div>
            <h4 className="text-xl font-semibold text-slate-900 dark:text-white mt-[8px] mb-fib-1">{step.title}</h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Unified Footer
function UnifiedFooter() {
  return (
    <footer
      id="footer"
      className="relative py-fib-5 dark:bg-black border-t border-slate-200 dark:border-white/10 transition-colors duration-500"
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-fib-3 tracking-tight">
          AND Ecosystem
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-fib-4 text-lg">
          La forma inteligente de trabajar con influencers en Latinoamérica.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-fib-3 mb-fib-4">
          <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Términos y Condiciones</a>
          <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Política de Privacidad</a>
          <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Soporte Empresas</a>
          <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Soporte Creadores</a>
        </div>

        <div className="text-xs text-slate-400 dark:text-slate-600">
          © 2025 AND Technologies. Todos los derechos reservados.
        </div>

        {/* Developer Signature */}
        <div className="mt-12 flex flex-col items-center justify-center gap-2 opacity-50 hover:opacity-100 transition-opacity duration-500">
            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em]">Desarrollado por</span>
            <motion.a 
                href="#" 
                whileHover={{ scale: 1.05 }}
                className="relative block"
            >
                {/* Light Mode: Show Dark Logo (Black text) */}
                <img 
                    src="/images/Exodo_logo_dark.svg" 
                    alt="EXODO" 
                    className="h-20 w-auto dark:hidden opacity-80 hover:opacity-100 transition-opacity" 
                />
                {/* Dark Mode: Show Light Logo (White text) */}
                <img 
                    src="/images/Exodo_logo_light.svg" 
                    alt="EXODO" 
                    className="h-20 w-auto hidden dark:block opacity-80 hover:opacity-100 transition-opacity drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" 
                />
            </motion.a>
        </div>
      </div>
    </footer>
  );
}

