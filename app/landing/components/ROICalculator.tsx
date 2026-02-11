"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { 
  Warning, 
  CheckCircle, 
  TrendUp,
  CurrencyDollar,
  ArrowRight,
  ShieldCheck,
  User, 
  Buildings, 
  Envelope, 
  Phone,
  X
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
  const [showModal, setShowModal] = useState(false);

  // Logic from prompt - Exact Match with Excel
  const pauta = investment;
  const isd = pauta * 0.05;
  
  // Escenario SIN Factura (Informal)
  const base_iva_sin = pauta + isd;
  const iva_sin = base_iva_sin * 0.15;
  const total_gasto_sin = pauta + isd + iva_sin; // Salida Caja
  const impuesto_renta_oculto = total_gasto_sin * 0.25; // Multa por no deducible
  const gasto_real_sin = total_gasto_sin + impuesto_renta_oculto;
  
  // Escenario CON Factura (AND)
  const comision_agencia = pauta * 0.10;
  const base_iva_con = pauta + isd + comision_agencia;
  const iva_con = base_iva_con * 0.15;
  const gasto_real_con = pauta + isd + comision_agencia + iva_con;

  
  // Totales
  const ahorro_mensual = gasto_real_sin - gasto_real_con;
  const ahorro_anual = ahorro_mensual * 12;
  
  // Equivalence calculation
  const meses_gratis = gasto_real_sin > 0 ? (ahorro_anual / gasto_real_sin).toFixed(2) : "0.00";
  const savingsPercent = gasto_real_sin > 0 ? (ahorro_mensual / gasto_real_sin) * 100 : 0;
  
  // Reuse old vars for display compatibility without breaking UI
  const total_visible_sin = total_gasto_sin;
  const comision = comision_agencia;
  // ✅ NUEVO: Disparar evento de Facebook Pixel cuando aparece el modal
useEffect(() => {
  if (showModal && typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('trackCustom', 'ModalConfirmation', {
      content_name: 'Modal - La mejor decisión mostrado',
      content_category: 'Lead Confirmation',
      monthly_investment: investment,
      annual_savings: ahorro_anual
    });
  }
}, [showModal, investment, ahorro_anual]);

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
          annualSavings: ahorro_anual,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setStatus("success");
        setShowModal(true);
        setFormData({ fullName: "", companyName: "", email: "", phone: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("error");
    }
  };

  const handleInvestmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInvestment(Number(e.target.value));
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);


  return (
    <>
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      className="max-w-5xl mx-auto mb-32 px-4"
    >
      <div className="bg-white dark:bg-[#011F10]/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-2xl">
        
        <div className="text-center mb-10">
          <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-main)] dark:text-white mb-2">Calculadora de Ahorro Real</h3>
          <p className="text-slate-600 dark:text-slate-400">Descubre cuánto estás perdiendo por no nacionalizar tu pauta</p>
        </div>

        {/* Input Section */}
        <div className="mb-12 max-w-xl mx-auto">
            <label className="block text-sm font-medium text-[var(--text-main)] dark:text-slate-300 mb-4 text-center uppercase tracking-wider">
              Inversión Mensual en Pauta ($)
            </label>
            <div className="relative flex items-center justify-center mb-6">
              <input
                type="number"
                min="0"
                step="100"
                value={investment}
                onChange={handleInvestmentChange}
                className="w-48 bg-transparent border-b-2 border-[var(--primary)] text-center text-3xl sm:text-4xl font-bold text-[var(--text-main)] dark:text-white focus:outline-none focus:border-[var(--accent)] transition-colors py-2"
              />
            </div>
            <input 
              type="range" 
              min="100" 
              max="10000" 
              step="100" 
              value={investment} 
              onChange={handleInvestmentChange}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[var(--primary)]"
            />
             <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
              <span>$100</span>
              <span>$10,000+</span>
            </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8 relative">
          
          {/* Card Informal (Izquierda - Alerta) */}
          <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border-2 border-red-100 dark:border-red-900/30 relative overflow-hidden transition-all hover:shadow-lg hover:shadow-red-500/5">
            <div className="absolute top-4 right-4 text-red-500/20">
              <Warning size={64} weight="fill" />
            </div>
            
            <h4 className="text-lg sm:text-xl font-bold text-red-600 dark:text-red-400 mb-6 flex items-center gap-2">
              <Warning size={24} weight="duotone" />
              Sin Factura Nacional
            </h4>

            <div className="space-y-3 mb-6">
              <Row label="Inversión en Pauta" value={pauta} />
              <Row label="ISD (5%)" value={isd} />
              <Row label="IVA (15%)" value={iva_sin} subtitle="(No recuperable)" />
              <div className="h-px bg-red-200 dark:bg-red-900/30 my-2" />
              <Row label="Costo Visible" value={total_visible_sin} />
              
              <div className="bg-red-100 dark:bg-red-900/40 p-3 rounded-lg border border-red-200 dark:border-red-800 mt-2">
                <div className="flex justify-between items-center text-red-700 dark:text-red-300 font-bold text-sm mb-1">
                  <span>Gasto No Deducible (25%)</span>
                  <span>{formatCurrency(impuesto_renta_oculto)}</span>
                </div>
                <p className="text-xs text-red-600/80 dark:text-red-400/80">
                  Multa oculta del 25% sobre el gasto total
                </p>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-red-200 dark:border-red-900/30">
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium text-red-600/70 dark:text-red-400/70">Gasto Real Total</span>
                <span className="text-3xl font-bold text-red-600 dark:text-red-400">{formatCurrency(gasto_real_sin)}</span>
              </div>
            </div>
          </div>

          {/* Card Legal (Derecha - Éxito) */}
          <div className="bg-emerald-50 dark:bg-[#04301C] rounded-2xl p-6 border-2 border-[var(--primary)] relative overflow-hidden transition-all hover:shadow-xl hover:shadow-[var(--primary)]/10 ring-4 ring-[var(--primary)]/5">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-[var(--primary)] text-white text-[10px] uppercase font-bold rounded-bl-xl shadow-lg z-10">
              Recomendado
            </div>
            
            <div className="absolute top-10 right-4 text-[var(--primary)]/5 dark:text-[var(--primary)]/10 pointer-events-none">
              <ShieldCheck size={80} weight="fill" />
            </div>

            <h4 className="relative z-10 text-lg sm:text-xl font-bold text-[var(--primary)] dark:text-emerald-400 mb-6 flex items-start gap-2 pr-8">
              <CheckCircle size={24} weight="duotone" className="shrink-0 mt-0.5" />
              <span>Con Factura Nacional</span>
            </h4>

            <div className="space-y-3 mb-6">
              <Row label="Inversión en Pauta" value={pauta} />
              <Row label="ISD (5%)" value={isd} />
              <Row label="Comisión AND (10%)" value={comision} highlight />
              <div className="h-px bg-emerald-200 dark:bg-emerald-800/30 my-2" />
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-300">IVA (15%)</span>
                <div className="text-right">
                  <span className="block font-medium dark:text-emerald-200">{formatCurrency(iva_con)}</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-100 dark:bg-emerald-900/50 px-1.5 py-0.5 rounded ml-auto w-fit mt-0.5">
                    (Crédito Tributario)
                  </span>
                </div>
              </div>

               <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800 mt-2">
                <div className="flex justify-between items-center text-emerald-800 dark:text-emerald-200 font-bold text-sm mb-1">
                  <span>Impuesto a la Renta (Deducible)</span>
                  <span>$0.00</span>
                </div>
                <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80">
                  Gasto 100% legal y deducible
                </p>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-emerald-200 dark:border-emerald-800/30">
              <div className="flex justify-between items-end">
                <span className="text-sm font-medium text-emerald-600/70 dark:text-emerald-400/70">Gasto Real Total</span>
                <span className="text-3xl font-bold text-[var(--primary)] dark:text-white">{formatCurrency(gasto_real_con)}</span>
              </div>
            </div>
          </div>
          
        </div>

        {/* Sección de Impacto Final */}
        <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg transform hover:scale-[1.01] transition-transform">
            <div className="absolute top-0 right-0 opacity-10">
                <TrendUp size={150} weight="fill" />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                    <h5 className="text-emerald-100 text-sm font-semibold uppercase tracking-wider mb-1">Ahorro Mensual</h5>
                    <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{formatCurrency(ahorro_mensual)}</div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 inline-block text-sm font-medium">
                        {pauta > 0 ? (
                            <span>Ahorras {savingsPercent.toFixed(1)}% vs informal</span>
                        ) : "0%"}
                    </div>
                </div>

                <div className="h-12 w-px bg-white/30 hidden md:block"></div>

                <div className="text-center md:text-left">
                    <h5 className="text-emerald-100 text-sm font-semibold uppercase tracking-wider mb-1">Ahorro Anual Total</h5>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2 leading-none">
                        {formatCurrency(ahorro_anual)}
                    </div>
                </div>

                <div className="bg-white/10 rounded-xl p-4 max-w-xs backdrop-blur-md border border-white/20">
                    <div className="flex items-start gap-3">
                        <CurrencyDollar size={32} className="shrink-0 text-emerald-200" weight="duotone" />
                        <p className="text-sm leading-snug font-medium text-emerald-50">
                            ¡Eso equivale a <span className="text-white font-bold text-base border-b border-white/40">{meses_gratis} meses</span> de pauta GRATIS al año!
                        </p>
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

    <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => window.location.reload()}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full relative shadow-2xl border border-white/10"
            >
              <button 
                onClick={() => window.location.reload()}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                type="button"
              >
                <X size={24} />
              </button>
              
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle size={40} weight="fill" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  ¡La mejor decisión!
                </h3>
                
                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  Gracias por dar el primer paso hacia el ahorro inteligente. Nuestro equipo experto te contactará muy pronto para nacionalizar tus facturas.
                </p>

                <button 
                  onClick={() => window.location.reload()}
                  className="w-full py-3.5 rounded-xl bg-[var(--primary)] text-white font-bold hover:bg-[var(--primary)]/90 transition-colors"
                  type="button"
                >
                  Entendido
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function Row({ label, value, subtitle, highlight = false }: { label: string, value: number, subtitle?: string, highlight?: boolean }) {
  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  
  return (
    <div className={`flex justify-between items-start text-sm ${highlight ? 'font-semibold text-[var(--accent)] dark:text-emerald-300' : 'text-slate-600 dark:text-slate-300'}`}>
      <div className="flex flex-col">
        <span>{label}</span>
        {subtitle && <span className="text-[10px] text-slate-400">{subtitle}</span>}
      </div>
      <span>{formatCurrency(value)}</span>
    </div>
  );
}
