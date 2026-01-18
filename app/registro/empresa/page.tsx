"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Buildings, Envelope, IdentificationCard, LockKey } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { InputGroup } from "@/app/components/ui/InputGroup";
import { Checkbox } from "@/app/components/ui/Checkbox";
import { GradientButton } from "@/app/components/ui/GradientButton";
import { BackButton } from "@/app/components/ui/BackButton";
import { useUser } from "@/lib/context/UserContext";
import { User } from "@/lib/billing";

export default function EmpresaRegistro() {
  const [accepted, setAccepted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [ruc, setRuc] = useState("");
  const router = useRouter();
  const { login } = useUser();

  const handleRegister = () => {
    // Mock: crear usuario nuevo
    const newUser: User = {
      id: `new-user-${Date.now()}`,
      type: "empresa",
      isNew: true, // Usuario nuevo → verá gamificación
      email: email,
      name: companyName,
      rucConnected: !!ruc,
      hasEmittedFirstInvoice: false,
    };

    login(newUser);
    
    // Usuario nuevo → ve gamificación primero
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] dark:bg-[#000B05] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--primary)]/10 dark:bg-[var(--primary)]/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--accent)]/10 dark:bg-[var(--accent)]/20 rounded-full blur-[120px]" />
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
              <Buildings size={24} weight="duotone" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-main)] dark:text-white">Registro Corporativo</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Optimiza tu gestión financiera</p>
            </div>
          </div>

          <div className="space-y-4">
            <InputGroup 
              label="Nombre de la Empresa"
              icon={<Buildings size={18} />}
              placeholder="Ej. Tech Solutions S.A.C."
              theme="brand"
              onChange={(e) => setCompanyName(e.target.value)}
            />

            <InputGroup 
              label="Correo Corporativo"
              icon={<Envelope size={18} />}
              placeholder="contacto@empresa.com"
              theme="brand"
              onChange={(e) => setEmail(e.target.value)}
            />

            <InputGroup 
              label="RUC / Identificación Fiscal"
              icon={<IdentificationCard size={18} />}
              placeholder="20123456789"
              theme="brand"
              onChange={(e) => setRuc(e.target.value)}
            />

            <InputGroup 
              label="Contraseña"
              icon={<LockKey size={18} />}
              placeholder="••••••••"
              type="password"
              theme="brand"
              onChange={(e) => setPassword(e.target.value)}
            />

            <InputGroup 
              label="Confirmar Contraseña"
              icon={<LockKey size={18} />}
              placeholder="••••••••"
              type="password"
              theme="brand"
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              onClick={handleRegister}
              theme="brand"
            >
              Crear Cuenta Empresarial
            </GradientButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
