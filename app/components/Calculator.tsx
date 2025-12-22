"use client";

import { useState } from "react";
import { calculateSavings } from "@/lib/calculator";

export function Calculator() {
  const [amount, setAmount] = useState(0);
  const [result, setResult] = useState<null | number>(null);

  const handleCalculate = () => {
    const data = calculateSavings(amount);
    setResult(data.savings);
  };

  return (
    <div style={{ marginTop: 20 }}>
      <input
        type="number"
        placeholder="Monto a invertir"
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <button onClick={handleCalculate}>
        Calcular
      </button>

      {result !== null && (
        <p>Ahorro estimado: ${result.toFixed(2)}</p>
      )}
    </div>
  );
}
