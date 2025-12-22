"use client";

import { useState } from "react";

export default function InfluencerRegistro() {
  const [accepted, setAccepted] = useState(false);

  return (
    <main style={{ padding: 40, maxWidth: 420, margin: "0 auto" }}>
      <h2>Registro de Influencer</h2>

      <input placeholder="Nombre" style={input} />
      <input placeholder="Email" style={input} />
      <input placeholder="Instagram / TikTok" style={input} />

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
        style={{
          marginTop: 16,
          width: "100%",
          padding: 10,
          background: accepted ? "var(--green)" : "#d1d5db",
          color: "white"
        }}
      >
        Enviar datos
      </button>
    </main>
  );
}

const input = {
  marginTop: 12,
  width: "100%",
  padding: 10
};
