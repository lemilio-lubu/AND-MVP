"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { 
  Warning, 
  ShieldCheck, 
  CheckCircle, 
  User, 
  Buildings, 
  Envelope, 
  Phone, 
  CurrencyDollar, 
  ArrowRight 
} from "@phosphor-icons/react";

export function ROICalculator() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false });
  const [investment, setInvestment] = useState(1000);
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    phone: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      // Reemplaza esta URL con tu Webview URL de Google Apps Script 
      // o tu endpoint de integración (Zapier/Make/Next API)
      const GOOGLE_SCRIPT_URL = "api/leads"; // Usaremos un API Route interna por seguridad

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          monthlyInvestment: investment,
          annualSavings: scenarios.savings * 12,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ fullName: "", companyName: "", email: "", phone: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("error");
    }
  };

  // Calculate scenarios
  const calculateScenarios = (amount: number) => {
    // Stage 1: Direct Charges
    const directISD = amount * 0.05; // 5% ISD
    const andCommission = amount * 0.10; // 10% Commission

    // Stage 2: Subtotal
    const directSubtotal = amount + directISD;
    const andSubtotal = amount + andCommission;

    // Stage 3: IVA (applied on subtotal)
    const directIVA = directSubtotal * 0.15;
    const andIVA = andSubtotal * 0.15;

    // Final Totals
    const directTotal = directSubtotal + directIVA;
    const andTotal = andSubtotal + andIVA;

    // Savings: Informal Total Cost vs AND Net Investment (Subtotal)
    const savings = directTotal - andSubtotal;
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
        commission: andCommission,
        iva: andIVA,
        subtotal: andSubtotal,
        total: andTotal,
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
      <div className="bg-glass-apple rounded-fib-3 p-8 md:p-fib-4 border border-[var(--primary)]/10 dark:border-white/10 shadow-2xl">
        
        {/* Input Section */}
        <div className="mb-fib-3 max-w-xl mx-auto">
            <label className="block text-sm font-medium text-[var(--text-main)]/60 dark:text-slate-400 mb-fib-1 uppercase tracking-wider text-center">
              Presupuesto Mensual ($)
            </label>
            <div className="relative">
              <span className="absolute left-fib-2 top-1/2 -translate-y-1/2 text-slate-400 text-xl">$</span>
              <input
                type="number"
                min="0"
                value={investment}
                onChange={(e) => setInvestment(Number(e.target.value))}
                className="w-full bg-white dark:bg-slate-900 border border-[var(--primary)]/20 dark:border-slate-700 rounded-fib-2 py-fib-1 pl-[40px] pr-fib-2 text-3xl font-bold text-[var(--text-main)] dark:text-white focus:ring-2 focus:ring-[var(--accent)] outline-none transition-all text-center"
              />
            </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-fib-2 mb-fib-3">
          {/* BAD Scenario */}
          <div className="bg-[var(--primary)]/5 dark:bg-black/40 rounded-fib-2 p-fib-2 border border-red-200 dark:border-red-900/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-red-500">
              <Warning size={64} weight="fill" />
            </div>
            <h4 className="text-lg font-semibold text-red-500 dark:text-red-400 mb-6 flex items-center gap-2">
              Pagando por fuera / Informal
            </h4>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-[var(--text-main)]/80 dark:text-slate-400">
                <span>Costo Base</span>
                <span>${scenarios.direct.base.toLocaleString("en-US")}</span>
              </div>
              <div className="flex justify-between text-red-500/80 dark:text-red-400/80">
                <span>ISD (5%)</span>
                <span>+${scenarios.direct.isd.toLocaleString("en-US")}</span>
              </div>
              <div className="flex justify-between text-red-500/80 dark:text-red-400/80">
                <span>IVA (15% sobre Base+ISD)</span>
                <span>+${scenarios.direct.iva.toLocaleString("en-US")}</span>
              </div>
              <div className="pt-4 border-t border-[var(--primary)]/10 dark:border-white/5 flex justify-between items-center">
                <span className="text-[var(--text-main)]/80 dark:text-slate-400">Costo Real</span>
                <span className="text-2xl font-bold text-red-500 dark:text-red-400">${scenarios.direct.total.toLocaleString("en-US")}</span>
              </div>
              <div className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-300 px-3 py-2 rounded-fib-1 text-xs text-center">
                Dinero que pierdes en impuestos
              </div>
            </div>
          </div>

          {/* GOOD Scenario */}
          <div className="bg-[var(--surface)] dark:bg-sky-900/10 rounded-fib-2 p-fib-2 border border-[var(--primary)]/20 dark:border-sky-500/30 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 text-[var(--primary)]">
              <ShieldCheck size={64} weight="fill" />
            </div>
            <h4 className="text-lg font-semibold text-[var(--primary)] dark:text-sky-400 mb-6 flex items-center gap-2">
              Usando AND
            </h4>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-[var(--text-main)]/90 dark:text-slate-300">
                <span>Costo Base</span>
                <span>${scenarios.localAds.base.toLocaleString("en-US")}</span>
              </div>
              <div className="flex justify-between text-sky-600/80 dark:text-sky-400/80">
                <span>Comisión Gestión (10%)</span>
                <span>+${scenarios.localAds.commission.toLocaleString("en-US")}</span>
              </div>
              <div className="flex justify-between text-emerald-600/80 dark:text-emerald-400/80">
                <span>ISD (0%)</span>
                <span>$0</span>
              </div>
              <div className="flex justify-between text-[var(--text-main)]/80 dark:text-slate-400">
                <span>IVA (Crédito Fiscal)</span>
                <span>+${scenarios.localAds.iva.toLocaleString("en-US")}</span>
              </div>
              <div className="pt-4 border-t border-sky-200 dark:border-sky-900/30 flex justify-between items-center">
                <span className="text-slate-700 dark:text-slate-300">Inversión Neta</span>
                <span className="text-2xl font-bold text-sky-600 dark:text-sky-400">${scenarios.localAds.subtotal.toLocaleString("en-US")}</span>
              </div>
              <div className="bg-[var(--accent)]/10 dark:bg-emerald-900/20 text-[var(--primary)] dark:text-emerald-300 px-3 py-2 rounded-fib-1 text-xs text-center border border-[var(--accent)]/20 dark:border-emerald-900/30 flex items-center justify-center gap-2">
                <CheckCircle size={16} weight="fill" className="text-[var(--accent)]" />
                100% Deducible y sin dolores de cabeza
              </div>
            </div>
          </div>
        </div>

        {/* Result Section - Green Translucent */}
        <div className="bg-[var(--primary)]/5 backdrop-blur-md border border-[var(--primary)]/20 rounded-fib-3 p-fib-3 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[233px] h-[233px] bg-[var(--primary)]/10 rounded-full blur-fib-5 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-fib-2">
                <div className="text-center md:text-left">
                    <h4 className="text-[var(--primary)] dark:text-emerald-400 text-lg font-medium mb-[8px]">Lo que te ahorras</h4>
                    <p className="text-[var(--text-main)]/80 dark:text-slate-300 text-sm max-w-md">
                        Deja de perder dinero y evita problemas legales con nuestra plataforma.
                    </p>
                </div>

                <div className="flex flex-col items-center md:items-end gap-[8px]">
                    <div className="flex items-baseline gap-fib-1">
                        <span className="text-sm text-emerald-600/80 dark:text-emerald-400/80 uppercase tracking-wider font-semibold">Ahorro Anual</span>
                        <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                            ${(scenarios.savings * 12).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                         <span className="bg-[var(--accent)]/10 dark:bg-emerald-500/20 text-[var(--accent)] dark:text-emerald-300 px-fib-1 py-[5px] rounded-full text-xs font-bold">
                            +{scenarios.savingsPercent.toFixed(1)}% Eficiencia
                         </span>
                         <span className="text-lg font-medium text-slate-600 dark:text-slate-300">
                            Mensual: <span className="font-bold text-emerald-600 dark:text-emerald-400">${scenarios.savings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                         </span>
                    </div>
                </div>
            </div>
        </div>

        {/* Lead Form Section */}
        <div className="mt-12 pt-12 border-t border-slate-100 dark:border-white/5">
            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-8 text-center">
                Deja tus datos y accede a tu ahorro
            </h4>
            
            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-x-8 gap-y-6 max-w-4xl mx-auto">
                <div className="space-y-6">
                    <div className="group">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1 block">Nombre Completo</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                            <input 
                                type="text"
                                name="fullName"
                                required
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="Ej. Alejandro Pérez"
                                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white"
                            />
                        </div>
                    </div>
                    <div className="group">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1 block">Nombre de la Empresa</label>
                        <div className="relative">
                            <Buildings className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                            <input 
                                type="text"
                                name="companyName"
                                required
                                value={formData.companyName}
                                onChange={handleInputChange}
                                placeholder="Ej. And.inc"
                                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="group">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1 block">Correo Electrónico</label>
                        <div className="relative">
                            <Envelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                            <input 
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="alejandro@empresa.com"
                                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="group">
                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1 block">Teléfono</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                                <input 
                                    type="tel"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="+593..."
                                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all dark:text-white"
                                />
                            </div>
                        </div>
                         <div className="group">
                            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 ml-1 block">Pauta mensual</label>
                            <div className="relative">
                                <CurrencyDollar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                <input 
                                    type="text"
                                    value={`$${investment}`}
                                    readOnly
                                    className="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-sm outline-none cursor-not-allowed text-slate-500 font-medium"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 mt-4">
                    <button 
                        type="submit"
                        disabled={status === "submitting" || status === "success"}
                        className={`w-full font-bold py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 group ${
                            status === "success" 
                            ? "bg-emerald-100 text-emerald-700 cursor-default" 
                            : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20"
                        }`}
                    >
                        {status === "submitting" ? "Enviando..." : status === "success" ? "¡Datos enviados correctamente!" : "Quiero acceder a mi ahorro"}
                        {status === "idle" && <ArrowRight size={20} weight="bold" className="group-hover:translate-x-1 transition-transform" />}
                        {status === "success" && <CheckCircle size={20} weight="fill" />}
                    </button>
                    
                    {status === "error" && (
                        <p className="text-xs text-red-500 text-center mt-2 font-medium">
                            Hubo un error al enviar tus datos. Por favor intenta de nuevo.
                        </p>
                    )}

                    <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-4 uppercase tracking-widest">
                        Garantizamos la privacidad de tus datos profesionales
                    </p>
                </div>
            </form>
        </div>
      </div>
    </motion.div>
  );
}
