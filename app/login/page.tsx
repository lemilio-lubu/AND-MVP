import Link from "next/link";

export default function LoginPage() {
  return (
    <main style={{ padding: 40, maxWidth: 400, margin: "0 auto" }}>
      <h2>Accede a AND</h2>

      <input placeholder="Email" style={input} />
      <input placeholder="Contraseña" type="password" style={input} />

      <Link href="/dashboard">
        <button style={primaryBtn}>Entrar</button>
      </Link>

      <div style={{ marginTop: 20, fontSize: 14 }}>
        <p>
          ¿Tu empresa aún no tiene cuenta?{" "}
          <Link href="/registro/empresa">Regístrate aquí</Link>
        </p>

        <p style={{ marginTop: 8 }}>
          ¿Eres influencer?{" "}
          <Link href="/registro/influencer">Regístrate aquí</Link>
        </p>
      </div>
    </main>
  );
}

const input = {
  marginTop: 12,
  width: "100%",
  padding: 10
};

const primaryBtn = {
  marginTop: 16,
  width: "100%",
  padding: 10,
  background: "var(--green)",
  color: "white"
};
