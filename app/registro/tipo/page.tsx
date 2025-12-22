"use client";

import { useRouter } from "next/navigation";

export default function TipoUsuarioPage() {
  const router = useRouter();

  return (
    <main style={{ padding: 40, maxWidth: 600, margin: "0 auto" }}>
      <h2>¿Cómo quieres usar AND?</h2>

      <div style={{ marginTop: 24, display: "grid", gap: 16 }}>
        <button
          onClick={() => router.push("/registro/empresa")}
          style={{
            padding: 20,
            border: "1px solid var(--green)",
            borderRadius: 8,
            textAlign: "left"
          }}
        >
          <strong>🏢 Soy una marca / empresa</strong>
          <p style={{ color: "var(--gray)" }}>
            Quiero facturar mi pauta digital y ver mi dashboard
          </p>
        </button>

        <button
          onClick={() => router.push("/registro/influencer")}
          style={{
            padding: 20,
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            textAlign: "left"
          }}
        >
          <strong>📣 Soy influencer</strong>
          <p style={{ color: "var(--gray)" }}>
            Quiero dejar mis datos para colaborar con marcas
          </p>
        </button>
      </div>
    </main>
  );
}
