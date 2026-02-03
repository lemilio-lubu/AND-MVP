"use client";

import { motion } from "framer-motion";

export function UnifiedFooter() {
  return (
    <footer
      id="footer"
      className="relative py-fib-5 bg-transparent border-t border-emerald-500/10 dark:border-white/10 transition-colors duration-500"
    >
      <div className="container mx-auto px-4 text-center">
        {/* <div className="mb-fib-3 flex justify-center">
          <img src="/assets/logos-01.png" alt="AND Logo" className="h-14 w-auto dark:hidden" />
          <img src="/assets/logos-02.png" alt="AND Logo" className="h-14 w-auto hidden dark:block" />
        </div> */}
        <p className="text-[var(--text-main)] dark:text-slate-400 max-w-xl mx-auto mb-fib-4 text-lg">
          Factura local, sin complicaciones. Nacionaliza tus facturas de publicidad digital y paga menos impuestos.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-fib-3 mb-fib-4">
          <a href="#" className="text-sm text-[var(--text-main)]/70 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Términos y Condiciones</a>
          <a href="#" className="text-sm text-[var(--text-main)]/70 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Política de Privacidad</a>
          <a href="#" className="text-sm text-[var(--text-main)]/70 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Soporte Empresas</a>
          <a href="#" className="text-sm text-[var(--text-main)]/70 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Soporte Creadores</a>
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
                    className="h-12 md:h-16 lg:h-20 w-auto dark:hidden opacity-80 hover:opacity-100 transition-opacity" 
                />
                {/* Dark Mode: Show Light Logo (White text) */}
                <img 
                    src="/images/Exodo_logo_light.svg" 
                    alt="EXODO" 
                    className="h-12 md:h-16 lg:h-20 w-auto hidden dark:block opacity-80 hover:opacity-100 transition-opacity drop-shadow-xl" 
                />
            </motion.a>
        </div>
      </div>
    </footer>
  );
}
