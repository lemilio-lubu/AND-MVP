import { CaretLeft } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  href?: string;
  label?: string;
}

export function BackButton({ href = "/landing", label = "Volver al inicio" }: BackButtonProps) {
  const router = useRouter();
  return (
    <button 
      onClick={() => router.push(href)}
      className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8 text-sm font-medium group"
    >
      <CaretLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      {label}
    </button>
  );
}