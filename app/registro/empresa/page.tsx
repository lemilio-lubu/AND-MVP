"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Buildings, Envelope, IdentificationCard } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { InputGroup } from "@/app/components/ui/InputGroup";
import { Checkbox } from "@/app/components/ui/Checkbox";
import { GradientButton } from "@/app/components/ui/GradientButton";
import { BackButton } from "@/app/components/ui/BackButton";

export default function EmpresaRegistro() {
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/40 dark:bg-blue-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-200/40 dark:bg-cyan-900/20 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <BackButton />

        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400">
              <Buildings size={24} weight="duotone" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Registro Corporativo</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Optimiza tu gestión financiera</p>
            </div>
          </div>

          <div className="space-y-4">
            <InputGroup 
              label="Nombre de la Empresa"
              icon={<Buildings size={18} />}
              placeholder="Ej. Tech Solutions S.A.C."
              theme="blue"
            />

            <InputGroup 
              label="Correo Corporativo"
              icon={<Envelope size={18} />}
              placeholder="contacto@empresa.com"
              theme="blue"
            />

            <InputGroup 
              label="RUC / Identificación Fiscal"
              icon={<IdentificationCard size={18} />}
              placeholder="20123456789"
              theme="blue"
            />

            <Checkbox 
              checked={accepted} 
              onChange={setAccepted}
              theme="blue"
            >
              Acepto los <span className="text-blue-600 dark:text-blue-400 hover:underline">Términos y Condiciones</span> y la <span className="text-blue-600 dark:text-blue-400 hover:underline">Política de Privacidad</span>.
            </Checkbox>

            <GradientButton 
              disabled={!accepted}
              onClick={() => router.push("/dashboard")}
              theme="blue"
            >
              Crear Cuenta Empresarial
            </GradientButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
