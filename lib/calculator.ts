export function calculateSavings(amount: number) {
  const iva = amount * 0.15;
  const isd = amount * 0.05;
  const nonDeductible = amount * 0.0025;

  const creditCardCost = iva + isd + nonDeductible;
  const localBillingCost = iva;

  return {
    creditCardCost,
    localBillingCost,
    savings: creditCardCost - localBillingCost,
  };
}
