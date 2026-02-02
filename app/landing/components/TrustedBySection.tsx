"use client";

export function TrustedBySection() {
  return (
    <section className="py-fib-4 border-b border-emerald-500/10 dark:border-white/5 bg-transparent transition-colors duration-500">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm font-medium text-[var(--text-main)]/60 dark:text-slate-500 uppercase tracking-widest mb-fib-3">
          Integrado con las plataformas líderes
        </p>
        <div className="flex flex-wrap justify-center items-center gap-fib-4 md:gap-fib-5 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
           {/* Placeholders for Logos - Using Text for now */}
           {["Facebook", "Instagram", "TikTok", "Google", "YouTube"].map((brand) => (
             <span key={brand} className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-serif italic tracking-tight">
               {brand}
             </span>
           ))}
        </div>
      </div>
    </section>
  );
}
