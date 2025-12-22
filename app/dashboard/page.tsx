export default function DashboardPage() {
  return (
    <main style={{ padding: 40 }}>
      <h2>Dashboard</h2>

      <div style={{
        marginTop: 24,
        padding: 20,
        border: "1px dashed #d1d5db",
        borderRadius: 8
      }}>
        <p><strong>Estado:</strong> Cuenta creada</p>
        <p><strong>Facturación local:</strong> No iniciada</p>
        <p><strong>Ahorro estimado:</strong> Disponible</p>
      </div>

      <button
        style={{
          marginTop: 20,
          padding: 12,
          background: "var(--green)",
          color: "white"
        }}
      >
        Iniciar facturación local
      </button>
    </main>
  );
}
