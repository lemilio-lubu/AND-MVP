"use client";

import { VideoCamera, Envelope, InstagramLogo } from "@phosphor-icons/react";
import { GradientButton } from "@/app/components/ui/GradientButton";
import { InputGroup } from "@/app/components/ui/InputGroup";
import { BackButton } from "@/app/components/ui/BackButton";

export default function InfluencerPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] dark:bg-[#000B05] flex items-center justify-center p-4 transition-colors duration-500">
      <div className="w-full max-w-md">
        <BackButton />
        
        <div className="bg-[var(--surface)] dark:bg-[#011F10]/50 backdrop-blur-xl border border-slate-200 dark:border-[#04301C] rounded-2xl p-8 shadow-2xl">
            <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] mb-4">
                  <VideoCamera size={32} weight="duotone" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--text-main)] dark:text-white">Únete como creador</h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm">Déjanos tus datos</p>
            </div>

            <div className="space-y-4">
                <InputGroup label="Nombre" icon={<VideoCamera size={18} />} placeholder="Tu nombre" theme="brand" />
                <InputGroup label="Email" icon={<Envelope size={18} />} placeholder="tu@email.com" theme="brand" />
                <InputGroup label="Red social" icon={<InstagramLogo size={18} />} placeholder="@usuario" theme="brand" />
                <GradientButton theme="brand">Enviar Solicitud</GradientButton>
            </div>
        </div>
      </div>
    </div>
  );
}
