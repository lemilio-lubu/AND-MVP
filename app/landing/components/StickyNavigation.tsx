"use client";

import { useState, useEffect } from "react";

export function StickyNavigation() {
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
        <span className={`absolute inset-0 rounded-full border border-emerald-600 dark:border-white transition-all duration-500 ${active ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
        
        {/* Core Dot */}
        <span className={`rounded-full transition-all duration-500 ${active ? 'w-1.5 h-1.5 bg-emerald-600 dark:bg-white' : 'w-1.5 h-1.5 bg-emerald-600/40 dark:bg-slate-600 group-hover:bg-emerald-500'}`} />
      </div>
      
      <span className={`text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-500 ${active ? "opacity-100 translate-x-0 text-emerald-600 dark:text-white" : "opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 text-emerald-600/60 dark:text-slate-500"}`}>
        {label}
      </span>
    </button>
  );
}
