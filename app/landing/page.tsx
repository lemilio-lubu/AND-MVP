"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/app/components/ui/ThemeToggle";

// Import components
import { StickyNavigation } from "./components/StickyNavigation";
import { HeroSection } from "./components/HeroSection";
import { TrustedBySection } from "./components/TrustedBySection";
import { SmartSelector } from "./components/SmartSelector";
import { CompaniesSection } from "./components/CompaniesSection";
import { InfluencersSection } from "./components/InfluencersSection";
import { UnifiedFooter } from "./components/UnifiedFooter";

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
      <CompaniesSection />
      <TrustedBySection />
      <HeroSection />
      <SmartSelector />
      <InfluencersSection />
      <UnifiedFooter />
    </motion.div>
  );
}

