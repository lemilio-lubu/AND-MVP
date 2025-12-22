import { calculateSavings } from "@/lib/calculator";
import Image from "next/image";

export default function Home() {
  return (
    <main style={{ padding: 40 }}>
      <h1>AND – Facturación local para pauta digital</h1>
      <p>
        Ahorra impuestos y deduce tu inversión en publicidad digital usando
        facturación local.
      </p>

      <button>
        Calcular ahorro
      </button>
    </main>
  );
}
