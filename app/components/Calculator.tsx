"use client";

import { useState } from "react";
import { calculateSavings } from "@/lib/calculator";

export function Calculator() {
  const [amount, setAmount] = useState<number>(800);
  const [result, setResult] = useState<ReturnType<typeof calculateSavings> | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;
    setResult(calculateSavings(amount));
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        marginTop: 40,
        padding: 32,
        border: "1px solid #eaeaea",
        borderRadius: 12,
        maxWidth: 720,
        background: "#fff",
      }}
    >
      <h3 style={{ marginBottom: 16 }}>Calcula tu ahorro</h3>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Monto a invertir (USD)"
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          border: "1px solid #ccc",
          marginBottom: 20,
        }}
      />

      <button
        type="submit"
        style={{
          width: "100%",
          padding: 14,
          background: "var(--green)",
          color: "white",
          border: "none",
          borderRadius: 8,
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        Calcular ahorro
      </button>

      {result && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
              marginTop: 32,
            }}
          >
            {/* Escenario A */}
            <div
              style={{
                padding: 20,
                borderRadius: 8,
                background: "#f7f7f7",
              }}
            >
              <h4>Pago con tarjeta</h4>
              <p style={{ marginTop: 8 }}>
                Total a pagar:
                <br />
                <b>${result.informalTotal.toFixed(2)}</b>
              </p>
              <small>Incluye ISD + IVA No Deducible</small>
            </div>

            {/* Escenario B */}
            <div
              style={{
                padding: 20,
                borderRadius: 8,
                background: "#ecfdf3",
                border: "1px solid var(--green)",
              }}
            >
              <h4 style={{ color: "var(--green)" }}>Con AND</h4>
              <p style={{ marginTop: 8 }}>
                Total a pagar:
                <br />
                <b>${result.andTotal.toFixed(2)}</b>
              </p>
              <small>IVA deducible (Inversión Neta: ${result.andNetInvestment.toFixed(2)})</small>
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <h3 style={{ color: "var(--green)" }}>
              Ahorro anual estimado: ${(result.savings * 12).toFixed(2)}
            </h3>
            <p style={{ fontSize: 14, color: "#666" }}>
              Ahorro mensual: ${result.savings.toFixed(2)}
            </p>
          </div>
        </>
      )}
    </form>
  );
}
