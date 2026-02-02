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
    ? ["#efefea", "#f5f5f0", "#efefea", "#f5f5f0", "#efefea"]
    : ["#101318", "#0d0f13", "#101318", "#0d0f13", "#101318"];

  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.15, 0.5, 0.85, 1],
    bgColors
  );

  return (
    <motion.div
      ref={containerRef}
      style={{ backgroundColor }}
      className="relative w-full text-[var(--text-main)] dark:text-slate-100 transition-colors duration-500"
    >
      <div className="fixed top-fib-2 right-fib-3 z-50 flex items-center gap-fib-1">
        <ThemeToggle />
        {/* <button 
          onClick={() => router.push('/login')}
          className="px-fib-2 py-[8px] rounded-full border border-white/20 bg-[var(--primary)] text-white hover:bg-[var(--accent)] transition-all duration-300 shadow-lg"
        >
          Iniciar Sesión
        </button> */}
      </div>
      <StickyNavigation />
      <HeroSection />
      <TrustedBySection />
      <CompaniesSection />
      <SmartSelector />
      <InfluencersSection />
      <UnifiedFooter />
    </motion.div>
  );
}

