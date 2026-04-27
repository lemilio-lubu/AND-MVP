"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkle, ArrowRight } from "@phosphor-icons/react";
import { useUser } from "@/lib/context/UserContext";

export default function NuevaCapacidadPage() {
  const router = useRouter();
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (user.type === "admin") {
      router.push("/admin");
      return;
    }

    if (user.type !== "empresa") {
      router.push("/");
    }
  }, [loading, router, user]);

  if (loading || !user || user.type !== "empresa") {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <p className="text-slate-500">Cargando...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-[var(--surface)] border border-slate-200 dark:border-[#04301C] rounded-2xl p-8 md:p-10 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-4">
          <Sparkle size={16} weight="fill" />
          Prototipo MVP
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-main)] dark:text-white mb-3">
          Nueva capacidad habilitada para tu empresa
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mb-8">
          Esta pantalla valida el flujo de redirección post-auth para empresa.
          Es un placeholder funcional mientras se completa la definición de producto.
        </p>

        <button
          onClick={() => router.push("/wallet/nueva-capacidad")}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
        >
          Ir a wallet
          <ArrowRight size={18} weight="bold" />
        </button>
      </div>
    </main>
  );
}
