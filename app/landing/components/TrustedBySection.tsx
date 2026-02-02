"use client";

import { FacebookLogo, InstagramLogo, TiktokLogo, GoogleLogo, YoutubeLogo } from "@phosphor-icons/react";

export function TrustedBySection() {
  return (
    <section className="py-fib-4 border-b border-emerald-500/10 dark:border-white/5 bg-transparent transition-colors duration-500">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm font-medium text-[var(--text-main)]/60 dark:text-slate-500 uppercase tracking-widest mb-fib-3">
          Integrado con las plataformas líderes
        </p>
        <div className="flex flex-wrap justify-center items-center gap-fib-5 md:gap-fib-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
           <FacebookLogo size={40} weight="fill" className="text-[var(--primary)] dark:text-white" />
           <InstagramLogo size={40} weight="fill" className="text-[var(--primary)] dark:text-white" />
           <TiktokLogo size={40} weight="fill" className="text-[var(--primary)] dark:text-white" />
           <GoogleLogo size={40} weight="fill" className="text-[var(--primary)] dark:text-white" />
           <YoutubeLogo size={40} weight="fill" className="text-[var(--primary)] dark:text-white" />
        </div>
      </div>
    </section>
  );
}
