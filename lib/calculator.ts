export function calculateSavings(amount: number) {
  const iva = amount * 0.15;
  const isd = amount * 0.05;
  const nonDeductible = amount * 0.0025;

  const creditCardTotal = amount + iva + isd + nonDeductible;
  const localBillingTotal = amount + iva - nonDeductible;

  return {
    iva,
    isd,
    nonDeductible,
    creditCardTotal,
    localBillingTotal,
    savings: creditCardTotal - localBillingTotal,
  };
}
