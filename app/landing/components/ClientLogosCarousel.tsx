"use client";

import { useRef, useState } from "react";

const CLIENT_LOGOS = [
  { src: "/logos-empresas/LOGO_CLIENTES-04.png", alt: "Cliente 1" },
  { src: "/logos-empresas/LOGO_CLIENTES-05.png", alt: "Cliente 2" },
  { src: "/logos-empresas/LOGO_CLIENTES-06.png", alt: "Cliente 3" },
  { src: "/logos-empresas/LOGO_CLIENTES-07.png", alt: "Cliente 4" },
  { src: "/logos-empresas/LOGO_CLIENTES-08.png", alt: "Cliente 5" },
  { src: "/logos-empresas/LOGO_CLIENTES-09.png", alt: "Cliente 6" },
  { src: "/logos-empresas/LOGO_CLIENTES-10.png", alt: "Cliente 7" },
  { src: "/logos-empresas/LOGO_CLIENTES-11.png", alt: "Cliente 8" },
  {
    src: "/logos-empresas/LOGO_CLIENTES_Mesa de trabajo 1 copia 2.png",
    alt: "Cliente 9",
  },
];

export function ClientLogosCarousel() {
  const [isHovered, setIsHovered] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Duplicate logos 3x for seamless infinite loop
  const logos = [...CLIENT_LOGOS, ...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <section className="py-fib-4 bg-transparent transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto px-4 mb-fib-3">
        <p className="text-center text-sm font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] mb-3">
          Ellos ya optimizan con AND
        </p>
        <h3 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--text-main)] dark:text-white/90 max-w-2xl mx-auto leading-tight">
          +50 empresas confían en nosotros
        </h3>
      </div>

      {/* Carousel container */}
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-28 sm:w-40 md:w-52 bg-gradient-to-r from-[var(--background)] via-[var(--background)]/80 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-28 sm:w-40 md:w-52 bg-gradient-to-l from-[var(--background)] via-[var(--background)]/80 to-transparent" />

        {/* Scrolling track */}
        <div
          ref={trackRef}
          className="flex items-center gap-8 sm:gap-12 md:gap-14 py-6"
          style={{
            width: "max-content",
            animation: "clientMarquee 40s linear infinite",
            animationPlayState: isHovered ? "paused" : "running",
          }}
        >
          {logos.map((logo, i) => (
            <div
              key={`${logo.src}-${i}`}
              className="flex-shrink-0 group relative"
            >
              {/* Glow effect on hover */}
              <div className="absolute -inset-2 rounded-2xl bg-emerald-500/0 group-hover:bg-emerald-500/8 blur-2xl transition-all duration-700" />
              <div className="relative flex items-center justify-center h-16 sm:h-20 md:h-24 w-32 sm:w-36 md:w-44 rounded-2xl border border-white/5 group-hover:border-emerald-500/25 dark:group-hover:border-emerald-400/20 bg-white/[0.02] group-hover:bg-white/[0.06] dark:group-hover:bg-white/[0.04] backdrop-blur-sm transition-all duration-500 ease-out group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-emerald-500/5">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="h-9 sm:h-11 md:h-14 w-auto max-w-[85%] object-contain opacity-40 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all duration-500 ease-out select-none"
                  draggable={false}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS animation keyframes */}
      <style jsx>{`
        @keyframes clientMarquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </section>
  );
}
