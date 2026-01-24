"use client";

import { motion } from "framer-motion";

export function UnifiedFooter() {
  return (
    <footer
      id="footer"
      className="relative py-fib-5 bg-transparent border-t border-[var(--primary)]/10 dark:border-white/10 transition-colors duration-500"
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-[var(--primary)] dark:text-white mb-fib-3 tracking-tight">
          AND Ecosystem
        </h2>
        <p className="text-[var(--text-main)] dark:text-slate-400 max-w-xl mx-auto mb-fib-4 text-lg">
          La forma inteligente de trabajar con influencers en Latinoamérica.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-fib-3 mb-fib-4">
          <a href="#" className="text-sm text-[var(--text-main)]/70 dark:text-slate-400 hover:text-[var(--accent)] dark:hover:text-white transition-colors">Términos y Condiciones</a>
          <a href="#" className="text-sm text-[var(--text-main)]/70 dark:text-slate-400 hover:text-[var(--accent)] dark:hover:text-white transition-colors">Política de Privacidad</a>
          <a href="#" className="text-sm text-[var(--text-main)]/70 dark:text-slate-400 hover:text-[var(--accent)] dark:hover:text-white transition-colors">Soporte Empresas</a>
          <a href="#" className="text-sm text-[var(--text-main)]/70 dark:text-slate-400 hover:text-[var(--accent)] dark:hover:text-white transition-colors">Soporte Creadores</a>
        </div>

        <div className="text-xs text-[var(--text-main)]/50 dark:text-slate-600">
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
