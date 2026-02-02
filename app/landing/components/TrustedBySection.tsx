"use client";

export function TrustedBySection() {
  return (
    <section className="py-fib-4 border-b border-emerald-500/10 dark:border-white/5 bg-transparent transition-colors duration-500">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm font-medium text-[var(--text-main)]/60 dark:text-slate-500 uppercase tracking-widest mb-fib-3">
          Integrado con las plataformas líderes
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 transition-all duration-500">
           <img src="/assets/metaads.png" alt="Meta Ads" className="h-8 md:h-10 w-auto object-contain hover:scale-105 transition-transform" />
           <img src="/assets/googleads.png" alt="Google Ads" className="h-8 md:h-10 w-auto object-contain hover:scale-105 transition-transform" />
           <img src="/assets/tiktokads.png" alt="TikTok Ads" className="h-8 md:h-10 w-auto object-contain hover:scale-105 transition-transform" />
           <img src="/assets/xads.png" alt="X Ads" className="h-8 md:h-10 w-auto object-contain hover:scale-105 transition-transform" />
        </div>
      </div>
    </section>
  );
}
