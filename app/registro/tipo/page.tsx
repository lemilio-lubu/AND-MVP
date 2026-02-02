"use client";

import { useRouter } from "next/navigation";
import { Buildings, CaretRight } from "@phosphor-icons/react";
import { BackButton } from "@/app/components/ui/BackButton";

export default function TipoUsuarioPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--background)] dark:bg-[#000B05] flex items-center justify-center p-4 transition-colors duration-500">
      <div className="w-full max-w-lg">
        <BackButton />
        
        <h2 className="text-3xl font-bold text-[var(--text-main)] dark:text-white mb-2 text-center">¿Cómo quieres usar AND?</h2>
        <p className="text-slate-600 dark:text-slate-400 text-center mb-10">Selecciona tu perfil para comenzar</p>

        <div className="grid gap-4">
          <button
            onClick={() => router.push("/registro/empresa")}
            className="group flex items-center justify-between gap-4 p-6 rounded-2xl border-2 border-[var(--primary)]/20 hover:border-[var(--primary)] bg-white dark:bg-[#011F10]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[var(--primary)]/10 text-left"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shrink-0 group-hover:scale-110 transition-transform">
                <Buildings size={28} weight="duotone" />
              </div>
              <div>
                <strong className="block text-lg font-semibold text-[var(--text-main)] dark:text-white mb-1">Soy una Marca / Empresa</strong>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Quiero facturar mi pauta digital, optimizar impuestos y ver mi dashboard financiero.
                </p>
              </div>
            </div>
            <CaretRight size={24} className="text-[var(--primary)] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
}
