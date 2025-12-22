import { Calculator } from "./components/Calculator";

export default function Home() {
  return (
    <main style={{ padding: 40 }}>
      <h1>AND – Facturación local</h1>
      <p>
        Visualiza cuánto ahorras usando facturación local.
      </p>

      <Calculator />

      <button style={{ marginTop: 20 }}>
        Usar facturación local
      </button>
    </main>
  );
}
