export function calculateSavings(amount: number) {
  const IVA_RATE = 0.15;
  const ISD_RATE = 0.05;
  const COMMISSION_RATE = 0.10;

  // Escenario Informal (Total Cost = Base + ISD + IVA)
  const informalIsd = amount * ISD_RATE;
  const informalSubtotal = amount + informalIsd;
  const informalIva = informalSubtotal * IVA_RATE;
  const informalTotal = informalSubtotal + informalIva;

  // Escenario AND (Total Client Pays = Base + Commission + IVA)
  // Net Investment = Base + Commission (since IVA is deductible)
  const andCommission = amount * COMMISSION_RATE;
  const andSubtotal = amount + andCommission;
  const andIva = andSubtotal * IVA_RATE;
  const andTotal = andSubtotal + andIva;

  return {
    iva: andIva,
    isd: informalIsd,
    commission: andCommission,
    informalTotal,
    andTotal,
    andNetInvestment: andSubtotal,
    savings: informalTotal - andSubtotal,
  };
}
