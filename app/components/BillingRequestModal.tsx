"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Receipt, CheckCircle, Clock } from "@phosphor-icons/react";
import { 
  formatCurrency,
  canRequestBilling,
  isValidAmount
} from "@/lib/billing";
import { useUser } from "@/lib/context/UserContext";

interface BillingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function BillingRequestModal({ isOpen, onClose, onSuccess }: BillingRequestModalProps) {
  const { user } = useUser();
  const [step, setStep] = useState<"form" | "submitting" | "success">("form");
  const [amount, setAmount] = useState<string>("");
  const [platform, setPlatform] = useState<string>("");
  const [error, setError] = useState<string>("");

  const platforms = [
    { id: "Meta", name: "Meta (Facebook/Instagram)" },
    { id: "TikTok", name: "TikTok" },
    { id: "Google", name: "Google Ads" },
    { id: "LinkedIn", name: "LinkedIn" },
  ];

  const handleSubmit = async () => {
    if (!user) return;

    // Validación de usuario
    const userValidation = canRequestBilling(user);
    if (!userValidation.isValid) {
      setError(userValidation.error || "Error de validación");
      return;
    }

    // Validación de monto
    const numAmount = parseFloat(amount);
    if (!isValidAmount(numAmount)) {
      setError("Ingresa un monto válido (mayor a $0)");
      return;
    }

    // Validación de plataforma
    if (!platform) {
      setError("Selecciona una plataforma");
      return;
    }

    // Simular creación de solicitud
    setStep("submitting");
    setError("");

    setTimeout(() => {
      setStep("success");
      
      setTimeout(() => {
        onSuccess?.();
        onClose();
        resetForm();
      }, 2000);
    }, 1500);
  };

  const resetForm = () => {
    setStep("form");
    setAmount("");
    setPlatform("");
    setError("");
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetForm, 300);
  };

  if (!user) return null;

  const numAmount = parseFloat(amount) || 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full pointer-events-auto border border-slate-200 dark:border-slate-800"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Receipt size={20} weight="duotone" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Solicitar Facturación Local
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {step === "form" && (
                  <div className="space-y-4">
                    {/* Nota importante */}
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        <strong>Nota:</strong> Al enviar esta solicitud, nuestro equipo calculará el monto final y te enviará la factura para aprobación.
                      </p>
                    </div>

                    {/* Plataforma */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                        Plataforma de Pauta
                      </label>
                      <select
                        value={platform}
                        onChange={(e) => setPlatform(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      >
                        <option value="">Selecciona plataforma</option>
                        {platforms.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Monto */}
                    <div>
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                        Monto de Pauta (USD)
                      </label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      {numAmount > 0 && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Monto solicitado: {formatCurrency(numAmount)}
                        </p>
                      )}
                    </div>

                    {/* Información del proceso */}
                    <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg p-4 space-y-2 text-sm">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                        Proceso de Facturación
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400">1.</span>
                          <span className="text-slate-600 dark:text-slate-400">Envías tu solicitud</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400">2.</span>
                          <span className="text-slate-600 dark:text-slate-400">AND calcula el monto final</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400">3.</span>
                          <span className="text-slate-600 dark:text-slate-400">Apruebas el valor</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400">4.</span>
                          <span className="text-slate-600 dark:text-slate-400">AND emite la factura</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400">5.</span>
                          <span className="text-slate-600 dark:text-slate-400">Realizas el pago</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400">6.</span>
                          <span className="text-slate-600 dark:text-slate-400">AND ejecuta la recarga</span>
                        </div>
                      </div>
                    </div>

                    {/* Error */}
                    {error && (
                      <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={handleClose}
                        className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={!platform || !amount || parseFloat(amount) <= 0}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30"
                      >
                        Enviar Solicitud
                      </button>
                    </div>
                  </div>
                )}

                {step === "submitting" && (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Enviando solicitud...</p>
                  </div>
                )}

                {step === "success" && (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle size={32} weight="duotone" className="text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      ¡Solicitud Enviada!
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Nuestro equipo revisará tu solicitud y te enviará el cálculo para aprobación.
                    </p>
                    <div className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                      <Clock size={16} weight="duotone" />
                      <span>Estado: En revisión</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
