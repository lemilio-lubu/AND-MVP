"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EmpresaRegistro() {
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  return (
    <main style={{ padding: 40, maxWidth: 420, margin: "0 auto" }}>
      <h2>Registro de Empresa</h2>

      <input placeholder="Nombre de la empresa" style={{ marginTop: 12, width: "100%", padding: 10 }} />
      <input placeholder="Email" style={{ marginTop: 12, width: "100%", padding: 10 }} />
      <input placeholder="RUC / Identificación" style={{ marginTop: 12, width: "100%", padding: 10 }} />

      <label style={{ marginTop: 16, display: "block", fontSize: 14 }}>
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
        />{" "}
        Acepto la política de protección de datos
      </label>

      <button
        disabled={!accepted}
        onClick={() => router.push("/dashboard")}
        style={{
          marginTop: 16,
          width: "100%",
          padding: 10,
          background: accepted ? "var(--green)" : "#d1d5db",
          color: "white"
        }}
      >
        Crear cuenta
      </button>
    </main>
  );
}
