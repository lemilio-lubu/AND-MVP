import { CaretLeft } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();
  return (
    <button 
      onClick={() => router.push('/landing')}
      className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm font-medium group"
    >
      <CaretLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      Volver al inicio
    </button>
  );
}