"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Warning, ShieldCheck, CheckCircle } from "@phosphor-icons/react";

export function ROICalculator() {
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
      <div className="bg-glass-apple rounded-fib-3 p-8 md:p-fib-4 border border-slate-200 dark:border-white/10 shadow-2xl">
        
        {/* Input Section */}
        <div className="mb-fib-3 max-w-xl mx-auto">
            <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-fib-1 uppercase tracking-wider text-center">
              Presupuesto Mensual ($)
            </label>
            <div className="relative">
              <span className="absolute left-fib-2 top-1/2 -translate-y-1/2 text-slate-400 text-xl">$</span>
              <input
                type="number"
                min="0"
                value={investment}
                onChange={(e) => setInvestment(Number(e.target.value))}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-fib-2 py-fib-1 pl-[40px] pr-fib-2 text-3xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-center"
              />
            </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-fib-2 mb-fib-3">
          {/* BAD Scenario */}
          <div className="bg-slate-100 dark:bg-black/40 rounded-fib-2 p-fib-2 border border-red-200 dark:border-red-900/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-red-500">
              <Warning size={64} weight="fill" />
            </div>
            <h4 className="text-lg font-semibold text-red-500 dark:text-red-400 mb-6 flex items-center gap-2">
              Pagando por fuera / Informal
            </h4>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Costo Base</span>
                <span>${scenarios.direct.base.toLocaleString("en-US")}</span>
              </div>
              <div className="flex justify-between text-red-500/80 dark:text-red-400/80">
                <span>ISD (5%)</span>
                <span>+${scenarios.direct.isd.toLocaleString("en-US")}</span>
              </div>
              <div className="flex justify-between text-red-500/80 dark:text-red-400/80">
                <span>IVA No Deducible</span>
                <span>+${scenarios.direct.iva.toLocaleString("en-US")}</span>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-white/5 flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Costo Real</span>
                <span className="text-2xl font-bold text-red-500 dark:text-red-400">${scenarios.direct.total.toLocaleString("en-US")}</span>
              </div>
              <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-300 px-3 py-2 rounded-fib-1 text-xs text-center">
                Dinero que pierdes en impuestos
              </div>
            </div>
          </div>

          {/* GOOD Scenario */}
          <div className="bg-white dark:bg-sky-900/10 rounded-fib-2 p-fib-2 border border-sky-200 dark:border-sky-500/30 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 text-sky-400">
              <ShieldCheck size={64} weight="fill" />
            </div>
            <h4 className="text-lg font-semibold text-sky-600 dark:text-sky-400 mb-6 flex items-center gap-2">
              Usando AND
            </h4>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>Costo Base</span>
                <span>${scenarios.localAds.base.toLocaleString("en-US")}</span>
              </div>
              <div className="flex justify-between text-emerald-600/80 dark:text-emerald-400/80">
                <span>ISD (0%)</span>
                <span>$0</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>IVA (Crédito Fiscal)</span>
                <span>+${scenarios.localAds.iva.toLocaleString("en-US")}</span>
              </div>
              <div className="pt-4 border-t border-sky-200 dark:border-sky-900/30 flex justify-between items-center">
                <span className="text-slate-700 dark:text-slate-300">Inversión Neta</span>
                <span className="text-2xl font-bold text-sky-600 dark:text-sky-400">${scenarios.localAds.total.toLocaleString("en-US")}</span>
              </div>
              <div className="bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 px-3 py-2 rounded-fib-1 text-xs text-center border border-emerald-200 dark:border-emerald-900/30 flex items-center justify-center gap-2">
                <CheckCircle size={16} weight="fill" />
                100% Deducible y sin dolores de cabeza
              </div>
            </div>
          </div>
        </div>

        {/* Result Section - Green Translucent */}
        <div className="bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 rounded-fib-3 p-fib-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[233px] h-[233px] bg-emerald-500/20 rounded-full blur-fib-5 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-fib-2">
                <div className="text-center md:text-left">
                    <h4 className="text-emerald-600 dark:text-emerald-400 text-lg font-medium mb-[8px]">Lo que te ahorras</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md">
                        Deja de perder dinero y evita problemas legales con nuestra plataforma.
                    </p>
                </div>

                <div className="flex flex-col items-center md:items-end gap-[8px]">
                    <div className="flex items-baseline gap-fib-1">
                        <span className="text-sm text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-wider font-semibold">Ahorro Mensual</span>
                        <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                            ${scenarios.savings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                         <span className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-fib-1 py-[5px] rounded-full text-xs font-bold">
                            +{scenarios.savingsPercent.toFixed(1)}% Eficiencia
                         </span>
                         <span className="text-lg font-medium text-slate-600 dark:text-slate-300">
                            Anual: <span className="font-bold text-emerald-600 dark:text-emerald-400">${(scenarios.savings * 12).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                         </span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </motion.div>
  );
}
