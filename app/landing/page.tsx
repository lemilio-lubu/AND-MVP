"use client";

import { motion, useScroll, useTransform, useInView, MotionValue } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Warning, ShieldCheck, CheckCircle, FileText, Check, ArrowRight, Buildings, VideoCamera } from "@phosphor-icons/react";

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Background color transitions based on scroll
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.15, 0.5, 0.85, 1],
    ["#0f172a", "#0c4a6e", "#1e1b4b", "#0f172a", "#0f172a"]
  );

  return (
    <motion.div
      ref={containerRef}
      style={{ backgroundColor }}
      className="relative w-full text-slate-100"
    >
      <StickyNavigation scrollProgress={scrollYProgress} />
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
function StickyNavigation({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const zone = useTransform(scrollProgress, (latest: number) => {
    if (latest < 0.1) return "intro";
    if (latest < 0.6) return "companies";
    if (latest < 0.9) return "influencers";
    return "footer";
  });

  const [currentZone, setCurrentZone] = useState("intro");

  useEffect(() => {
    return zone.on("change", setCurrentZone);
  }, [zone]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-6 items-end mix-blend-difference">
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
      className="group flex items-center gap-4 flex-row-reverse focus:outline-none"
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
      className="relative h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Background Video - UHD Flow */}
        <div className="absolute inset-0 z-0 opacity-80">
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
            className="text-xl md:text-2xl font-medium text-slate-400 mb-6 tracking-widest uppercase"
          >
            AND Ecosystem
          </motion.h2>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-5xl md:text-8xl font-bold mb-8 leading-tight tracking-tight"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400">Infraestructura.</span>
            <br />
            <span className="text-white">Financiera.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto font-light leading-relaxed"
          >
            La plataforma que automatiza pagos, contratos y facturación entre Marcas y Creadores. <span className="text-white font-medium">Eficiencia fiscal</span> y <span className="text-white font-medium">cumplimiento normativo</span> en un solo lugar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-12 flex flex-col md:flex-row gap-6 justify-center"
          >
            <button 
              onClick={() => document.getElementById('companies')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 rounded-full bg-white text-black font-semibold text-lg hover:bg-slate-200 transition-colors min-w-[200px]"
            >
              Soy Empresa
            </button>
            <button 
              onClick={() => document.getElementById('influencers')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 rounded-full border border-slate-700 text-white font-semibold text-lg hover:bg-slate-900 transition-colors min-w-[200px]"
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
    <section className="py-12 border-b border-white/5 bg-black">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm font-medium text-slate-500 uppercase tracking-widest mb-8">
          Empresas que confían en AND Ecosystem
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
           {/* Placeholders for Logos - Using Text for now */}
           {["TechCorp", "MediaHouse", "CreatorFund", "GlobalBrand", "FutureNet"].map((brand) => (
             <span key={brand} className="text-xl md:text-2xl font-bold text-white font-serif italic">
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
    <section className="py-32 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Company Card */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="group relative h-[600px] rounded-[40px] overflow-hidden bg-slate-900/50 border border-blue-500/20 shadow-[0_0_40px_rgba(56,189,248,0.1)] hover:shadow-[0_0_60px_rgba(56,189,248,0.2)] transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative h-full flex flex-col justify-between p-12">
              <div>
                <div className="mb-6 inline-flex p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(56,189,248,0.1)]">
                  <Buildings size={32} weight="duotone" />
                </div>
                <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-4">Para Empresas</h3>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Control Total.</h2>
                <p className="text-xl text-slate-300 leading-relaxed">
                  Centraliza pagos, deduce impuestos y elimina el riesgo operativo de trabajar con múltiples proveedores informales.
                </p>
              </div>
              
              <div className="mt-8">
                <button 
                  onClick={() => router.push('/registro/empresa')}
                  className="inline-flex items-center gap-2 text-blue-400 font-medium border-b border-blue-500/30 pb-1 group-hover:border-blue-400 transition-colors"
                >
                  Soluciones Corporativas <span className="text-xl">→</span>
                </button>
              </div>
            </div>
            
            {/* Abstract Visual */}
            <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-tl-[100px] blur-2xl" />
          </motion.div>

          {/* Creator Card */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="group relative h-[600px] rounded-[40px] overflow-hidden bg-slate-900/50 border border-purple-500/20 shadow-[0_0_40px_rgba(168,85,247,0.1)] hover:shadow-[0_0_60px_rgba(168,85,247,0.2)] transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative h-full flex flex-col justify-between p-12">
              <div>
                <div className="mb-6 inline-flex p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                  <VideoCamera size={32} weight="duotone" />
                </div>
                <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-widest mb-4">Para Creadores</h3>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Carrera Pro.</h2>
                <p className="text-xl text-slate-300 leading-relaxed">
                  Accede a contratos de grandes marcas, garantiza tus pagos y construye un historial financiero sólido.
                </p>
              </div>
              
              <div className="mt-8">
                <button 
                  onClick={() => router.push('/registro/influencer')}
                  className="inline-flex items-center gap-2 text-purple-400 font-medium border-b border-purple-500/30 pb-1 group-hover:border-purple-400 transition-colors"
                >
                  Unirse al Ecosystem <span className="text-xl">→</span>
                </button>
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

// Companies Section
function CompaniesSection() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section
      id="companies"
      ref={ref}
      className="relative min-h-screen py-32 bg-black overflow-hidden"
    >
      {/* Titanium Texture - Image 2 */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img 
              src="/images/abstract_build.jpg" 
              alt="Titanium Texture" 
              className="w-full h-full object-cover grayscale contrast-125"
          />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
              Eficiencia. <span className="text-slate-500">Fiscal.</span>
            </h2>
            <p className="text-xl text-slate-300 mt-6 max-w-2xl mx-auto">
              Maximiza el ROI de tu pauta publicitaria con una estructura diseñada para la deducibilidad total.
            </p>
          </motion.div>
        </div>

        {/* ROI Calculator - Glassmorphism Style */}
        <ROICalculator />

        {/* Billing Flow Animation */}
        <BillingFlowAnimation />
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
      <div className="bg-glass-apple rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
          <div className="w-full md:w-2/3">
            <label className="block text-lg font-medium text-slate-300 mb-6">
              Presupuesto Mensual para Influencers
            </label>
            <input
              type="range"
              min="500"
              max="20000"
              step="500"
              value={investment}
              onChange={(e) => setInvestment(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>$500</span>
              <span>$20,000+</span>
            </div>
          </div>
          <div className="text-right">
            <label htmlFor="investment-input" className="block text-sm text-slate-400 mb-1">Inversión Seleccionada</label>
            <div className="flex items-center justify-end">
              <span className="text-4xl font-bold text-white mr-1">$</span>
              <input
                id="investment-input"
                type="number"
                value={investment}
                onChange={(e) => setInvestment(Number(e.target.value))}
                className="bg-transparent text-4xl font-bold text-white w-48 text-right border-b border-white/20 focus:border-white outline-none transition-colors [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* BAD Scenario */}
          <div className="bg-black/40 rounded-2xl p-8 border border-red-900/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-red-500">
              <Warning size={64} weight="fill" />
            </div>
            <h4 className="text-lg font-semibold text-red-400 mb-6 flex items-center gap-2">
              Pago Directo / Informal
            </h4>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Costo Base</span>
                <span>${scenarios.direct.base.toLocaleString("en-US")}</span>
              </div>
              <div className="flex justify-between text-red-400/80">
                <span>ISD (5%)</span>
                <span>+${scenarios.direct.isd.toLocaleString("en-US")}</span>
              </div>
              <div className="flex justify-between text-red-400/80">
                <span>IVA No Deducible</span>
                <span>+${scenarios.direct.iva.toLocaleString("en-US")}</span>
              </div>
              <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                <span className="text-slate-400">Costo Real</span>
                <span className="text-2xl font-bold text-red-400">${scenarios.direct.total.toLocaleString("en-US")}</span>
              </div>
              <div className="bg-red-900/20 text-red-300 px-3 py-2 rounded text-xs text-center">
                Gasto NO Deducible de Impuestos
              </div>
            </div>
          </div>

          {/* GOOD Scenario */}
          <div className="bg-sky-900/10 rounded-2xl p-8 border border-sky-500/30 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 text-sky-400">
              <ShieldCheck size={64} weight="fill" />
            </div>
            <h4 className="text-lg font-semibold text-sky-400 mb-6 flex items-center gap-2">
              Vía AND Ecosystem
            </h4>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Costo Base</span>
                <span>${scenarios.localAds.base.toLocaleString("en-US")}</span>
              </div>
              <div className="flex justify-between text-emerald-400/80">
                <span>ISD (0%)</span>
                <span>$0</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>IVA (Crédito Fiscal)</span>
                <span>+${scenarios.localAds.iva.toLocaleString("en-US")}</span>
              </div>
              <div className="pt-4 border-t border-sky-900/30 flex justify-between items-center">
                <span className="text-slate-300">Inversión Neta</span>
                <span className="text-2xl font-bold text-sky-400">${scenarios.localAds.total.toLocaleString("en-US")}</span>
              </div>
              <div className="bg-emerald-900/20 text-emerald-300 px-3 py-2 rounded text-xs text-center border border-emerald-900/30 flex items-center justify-center gap-2">
                <CheckCircle size={16} weight="fill" />
                100% Deducible + Ahorro Operativo
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// BillingFlowAnimation
function BillingFlowAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      className="max-w-5xl mx-auto mb-32"
    >
      <div className="text-center mb-20">
        <h3 className="text-3xl font-bold text-white mb-6">
          Gestión Administrativa Centralizada
        </h3>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Olvídate de perseguir facturas individuales. Recibe una única factura fiscal válida por toda tu campaña.
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 md:gap-16 relative h-64">
        
        {/* Left Side: Chaos */}
        <div className="relative w-40 h-40 flex items-center justify-center">
            <p className="absolute -top-12 text-sm font-medium text-slate-500">Múltiples Proveedores</p>
            {[0, 1, 2, 3].map((i) => (
                <motion.div
                    key={i}
                    initial={{ x: 0, y: 0, rotate: i * 10 - 15, opacity: 1 }}
                    animate={isInView ? { 
                        x: 150, // Move right
                        y: 0, 
                        opacity: 0,
                        scale: 0.2,
                        rotate: 0
                    } : {}}
                    transition={{ 
                        duration: 0.8, 
                        delay: i * 0.4, // Sequential
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 2
                    }}
                    className="absolute w-20 h-24 bg-slate-800 border border-slate-600 rounded-lg shadow-xl flex flex-col gap-2 p-2"
                    style={{ zIndex: 10 - i }}
                >
                    <div className="w-8 h-1 bg-slate-600 rounded-full" />
                    <div className="w-12 h-1 bg-slate-700 rounded-full" />
                    <div className="w-10 h-1 bg-slate-700 rounded-full" />
                </motion.div>
            ))}
        </div>

        {/* Arrow Indicator */}
        <div className="text-slate-700">
            <ArrowRight size={32} weight="bold" />
        </div>

        {/* Right Side: Order */}
        <div className="relative w-40 h-40 flex items-center justify-center">
            <p className="absolute -top-12 text-sm font-bold text-white">Una Factura Consolidada</p>
            
            {/* The Main Invoice */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={isInView ? { 
                    scale: [1, 1.05, 1], // Gentle pulse
                    opacity: 1 
                } : {}}
                transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="relative z-10 w-28 h-36 bg-gradient-to-b from-blue-600 to-blue-900 rounded-xl border border-blue-400 shadow-[0_0_50px_rgba(37,99,235,0.4)] flex flex-col items-center justify-center"
            >
                <FileText size={48} weight="fill" className="text-white mb-2" />
                <div className="w-16 h-2 bg-white/20 rounded-full mb-1" />
                <div className="w-10 h-2 bg-white/20 rounded-full" />
                
                {/* Success Badge */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute -bottom-3 -right-3 bg-green-500 text-white p-1.5 rounded-full shadow-lg border-2 border-black"
                >
                    <Check size={20} weight="bold" />
                </motion.div>
            </motion.div>

            {/* Background Glow */}
            <motion.div 
                animate={isInView ? { opacity: [0.2, 0.6, 0.2] } : {}}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full -z-10"
            />
        </div>

      </div>
    </motion.div>
  );
}

// Influencers Section
function InfluencersSection() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section
      id="influencers"
      ref={ref}
      className="relative min-h-screen py-32 bg-black"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
              Tu Talento. <span className="text-amber-500/80">Tu Empresa.</span>
            </h2>
            <p className="text-xl text-slate-300 mt-6 max-w-2xl mx-auto">
              Profesionaliza tu carrera con herramientas financieras de nivel corporativo.
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
          className="text-center mt-32"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-10 py-5 text-lg font-medium rounded-full bg-white text-black hover:bg-slate-200 transition-colors"
          >
            Profesionalizar mi Perfil
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
      className="max-w-5xl mx-auto mb-32"
    >
      <div className="bg-white/10 rounded-3xl p-10 border border-white/10 flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1">
          <h3 className="text-3xl font-bold text-white mb-6">
            Visibilidad Premium
          </h3>
          <p className="text-slate-300 mb-8 text-lg leading-relaxed">
            Nuestro algoritmo te conecta con marcas que buscan perfiles verificados. Accede a oportunidades exclusivas sin intermediarios innecesarios.
          </p>
          <ul className="space-y-4 text-slate-300">
            <li className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white">
                <Check size={12} weight="bold" />
              </span>
              Verificación de identidad y métricas
            </li>
            <li className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white">
                <Check size={12} weight="bold" />
              </span>
              Contratos digitales estandarizados
            </li>
            <li className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white">
                <Check size={12} weight="bold" />
              </span>
              Garantía de pago
            </li>
          </ul>
        </div>

        <div className="flex-1 relative w-full aspect-square max-w-sm">
          {/* Radar Circles */}
          {[1, 2, 3].map((ring) => (
            <div
              key={ring}
              className="absolute inset-0 rounded-full border border-white/20"
              style={{
                margin: `${ring * 15}%`,
              }}
            />
          ))}
          
          {/* Scanning Line */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent"
            style={{ clipPath: "polygon(50% 50%, 100% 0, 100% 50%)" }}
          />

          {/* Center */}
          <div className="absolute inset-0 m-auto w-3 h-3 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
          
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
              className="absolute w-1.5 h-1.5 bg-amber-200 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]"
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
    { title: "Verificación", desc: "Validación de identidad y audiencia" },
    { title: "Profesionalización", desc: "Facturación y contratos legales" },
    { title: "Escalabilidad", desc: "Acceso a campañas Tier-1" },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-5xl mx-auto"
    >
      <h3 className="text-3xl font-bold text-center text-white mb-16">
        Plan de Carrera
      </h3>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.2 }}
            className="bg-white/10 border border-white/10 p-8 rounded-3xl relative overflow-hidden group hover:bg-white/20 transition-colors"
          >
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
            
            <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center font-bold text-sm mb-6">
              {i + 1}
            </div>
            <h4 className="text-xl font-semibold text-white mt-2 mb-3">{step.title}</h4>
            <p className="text-slate-400 leading-relaxed">{step.desc}</p>
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
      className="relative py-24 bg-black border-t border-white/10"
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">
          AND Ecosystem
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto mb-12 text-lg">
          La plataforma estándar para la gestión profesional de campañas de influencia en Latinoamérica.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-8 mb-16">
          <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Términos y Condiciones</a>
          <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Política de Privacidad</a>
          <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Soporte Empresas</a>
          <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Soporte Creadores</a>
        </div>

        <div className="text-xs text-slate-600">
          © 2025 AND Technologies. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
