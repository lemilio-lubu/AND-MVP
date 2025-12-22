export default function LoginPage() {
  return (
    <main style={{
      padding: 40,
      maxWidth: 400,
      margin: "0 auto"
    }}>
      <h2>Accede a AND</h2>

      <input
        placeholder="Email"
        style={{
          marginTop: 12,
          width: "100%",
          padding: 10
        }}
      />

      <input
        placeholder="Contraseña"
        type="password"
        style={{
          marginTop: 12,
          width: "100%",
          padding: 10
        }}
      />

      <button
        style={{
          marginTop: 16,
          width: "100%",
          padding: 10,
          background: "var(--green)",
          color: "white"
        }}
      >
        Entrar
      </button>
    </main>
  );
}
