"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VideoCamera, Envelope, InstagramLogo, TiktokLogo, User } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { InputGroup } from "@/app/components/ui/InputGroup";
import { Checkbox } from "@/app/components/ui/Checkbox";
import { GradientButton } from "@/app/components/ui/GradientButton";
import { BackButton } from "@/app/components/ui/BackButton";

export default function InfluencerRegistro() {
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--background)] dark:bg-[#000B05] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--primary)]/10 dark:bg-[var(--primary)]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--accent)]/10 dark:bg-[var(--accent)]/20 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <BackButton />

        <div className="bg-[var(--surface)] dark:bg-[#011F10]/50 backdrop-blur-xl border border-slate-200 dark:border-[#04301C] rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E6F4EA] to-[#F2FBF5] dark:from-[#045932] dark:to-[#03A64A] flex items-center justify-center border border-slate-200 dark:border-[#045932]/30 text-[var(--primary)] dark:text-white">
              <VideoCamera size={24} weight="duotone" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-main)] dark:text-white">Registro de Creador</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Monetiza tu contenido legalmente</p>
            </div>
          </div>

          <div className="space-y-4">
            <InputGroup 
              label="Nombre Completo"
              icon={<User size={18} />}
              placeholder="Ej. Juan Pérez"
              theme="brand"
            />

            <InputGroup 
              label="Correo Electrónico"
              icon={<Envelope size={18} />}
              placeholder="hola@creador.com"
              theme="brand"
            />

            <InputGroup 
              label="Red Social Principal"
              icon={
                <>
                  <InstagramLogo size={16} />
                  <span className="text-[10px] text-slate-400 dark:text-slate-600">/</span>
                  <TiktokLogo size={16} />
                </>
              }
              placeholder="@usuario"
              theme="brand"
              className="pl-14"
            />

            <Checkbox 
              checked={accepted} 
              onChange={setAccepted}
              theme="brand"
            >
              Acepto los <span className="text-[var(--primary)] dark:text-[var(--accent)] hover:underline">Términos y Condiciones</span> y la <span className="text-[var(--primary)] dark:text-[var(--accent)] hover:underline">Política de Privacidad</span>.
            </Checkbox>

            <GradientButton 
              disabled={!accepted}
              onClick={() => router.push("/dashboard")}
              theme="brand"
            >
              Unirme como Creador
            </GradientButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
