"use client";

import { useState } from "react";
import { calculateSavings } from "@/lib/calculator";

export function Calculator() {
  const [amount, setAmount] = useState(0);
  const [result, setResult] = useState<null | ReturnType<typeof calculateSavings>>(null);

  const handleCalculate = () => {
    setResult(calculateSavings(amount));
  };

  return (
    <div style={{
      marginTop: 40,
      padding: 24,
      border: "1px solid #e5e7eb",
      borderRadius: 8,
      maxWidth: 420
    }}>
      <h3 style={{ marginBottom: 12 }}>
        Calcula tu ahorro
      </h3>

      <p style={{ color: "var(--gray)", fontSize: 14 }}>
        Ingresa cuánto planeas invertir en publicidad digital
      </p>

      <input
        type="number"
        placeholder="$800"
        style={{
          marginTop: 12,
          padding: 10,
          width: "100%",
          border: "1px solid #d1d5db",
          borderRadius: 6
        }}
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      <button
        onClick={handleCalculate}
        style={{
          marginTop: 12,
          width: "100%",
          padding: 10,
          background: "var(--green)",
          color: "white",
          borderRadius: 6
        }}
      >
        Ver ahorro
      </button>

      {result && (
        <div style={{
          marginTop: 16,
          padding: 12,
          background: "#f0fdf4",
          borderRadius: 6
        }}>
          <p>Pago con tarjeta: <strong>${result.creditCardCost.toFixed(2)}</strong></p>
          <p>Facturación local AND: <strong>${result.localBillingCost.toFixed(2)}</strong></p>
          <p style={{ color: "var(--green)", marginTop: 8 }}>
            Ahorras <strong>${result.savings.toFixed(2)}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
