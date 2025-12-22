import { Calculator } from "./components/Calculator";

export default function Home() {
  return (
    <main style={{ padding: "60px 40px" }}>
      <h1 style={{ fontSize: 32 }}>
        Facturación local para tu pauta digital
      </h1>

      <p style={{
        marginTop: 12,
        maxWidth: 600,
        color: "var(--gray)"
      }}>
        Con AND puedes facturar localmente tu inversión en publicidad,
        ahorrar impuestos y deducir gastos legalmente.
      </p>

      <Calculator />

      <a href="/login">
        <button
          style={{
            marginTop: 24,
            padding: "12px 20px",
            border: "1px solid var(--green)",
            color: "var(--green)",
            borderRadius: 6
          }}
        >
          Usar facturación local
        </button>
      </a>
    </main>
  );
}
