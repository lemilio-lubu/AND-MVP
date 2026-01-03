import { TaxCalculation } from "./types";

/**
 * Motor de cálculo de facturación local
 * Calcula IVA, ISD, no deducible y ahorro real
 */
export function calculateBillingTax(amount: number): TaxCalculation {
  // Constantes tributarias Ecuador
  const IVA_RATE = 0.15; // 15%
  const ISD_RATE = 0.05; // 5%
  const NON_DEDUCTIBLE_RATE = 0.0025; // 0.25%

  const iva = amount * IVA_RATE;
  const isd = amount * ISD_RATE;
  const nonDeductible = amount * NON_DEDUCTIBLE_RATE;

  // Tarjeta de crédito internacional
  const creditCardTotal = amount + iva + isd + nonDeductible;

  // Facturación local (sin ISD)
  const localBillingTotal = amount + iva - nonDeductible;

  const savings = creditCardTotal - localBillingTotal;

  return {
    iva,
    isd,
    nonDeductible,
    creditCardTotal,
    localBillingTotal,
    savings,
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
