import { TaxCalculation } from "./types";

/**
 * Motor de cálculo de facturación local
 * Sigue el modelo de tres etapas:
 * 1. Cargos Directos (ISD 5% o Comisión 10%)
 * 2. Consolidación del Subtotal (Base + Cargos)
 * 3. Aplicación de IVA (15% sobre Subtotal)
 */
export function calculateBillingTax(amount: number): TaxCalculation {
  // Constantes tributarias Ecuador
  const IVA_RATE = 0.15;      // 15%
  const ISD_RATE = 0.05;      // 5%
  const COMMISSION_RATE = 0.10; // 10%

  // --- ESCENARIO AND ---
  const andIsd = 0; // Local no paga ISD
  const andCommission = amount * COMMISSION_RATE;
  const andSubtotal = amount + andCommission;
  const andIva = andSubtotal * IVA_RATE;
  const andTotal = andSubtotal + andIva;

  // --- ESCENARIO INFORMAL (Para comparación) ---
  const informalIsd = amount * ISD_RATE;
  const informalSubtotal = amount + informalIsd;
  const informalIva = informalSubtotal * IVA_RATE; // IVA sobre base + ISD
  const informalTotal = informalSubtotal + informalIva;

  // El ahorro real es la diferencia entre el costo informal (total)
  // y la inversión neta en AND (el subtotal, ya que el IVA es crédito fiscal)
  const savings = informalTotal - andSubtotal;

  return {
    baseAmount: amount,
    isd: andIsd,
    commission: andCommission,
    subtotal: andSubtotal,
    iva: andIva,
    total: andTotal,
    savings: savings,
  };
}

/**
 * Valida si un monto es válido para facturación
 */
export function isValidAmount(amount: number): boolean {
  return amount > 0 && amount < 1000000 && !isNaN(amount);
}

/**
 * Formatea montos a formato de moneda
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-EC", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
