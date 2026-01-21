"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Key, Envelope, LockKey, User, ShieldCheck } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { InputGroup } from "@/app/components/ui/InputGroup";
import { GradientButton } from "@/app/components/ui/GradientButton";
import { BackButton } from "@/app/components/ui/BackButton";
import { useUser } from "@/lib/context/UserContext";
import { registerAdmin } from "@/lib/api/client";

export default function AdminRegistro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useUser();

  const handleRegister = async () => {
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!name || !email || !password || !accessCode) {
      setError("Completa todos los campos");
      return;
    }

    // Validación opcional en frontend, el backend es la autoridad final
    if (accessCode !== "AND_ADMIN_2026") {
       setError("Código de acceso inválido");
       return;
    }

    setLoading(true);

    try {
      // 1. Registrar usuario admin con endpoint específico
      const authResponse = await registerAdmin({
        fullName: name,
        email,
        adminSecret: accessCode,
        password,
      });

      // 2. Login automático
      await login(authResponse.access_token);

      // 3. Redirigir a admin dashboard
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Error al registrar administrador");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] dark:bg-[#000B05] flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[20%] w-[40%] h-[40%] bg-amber-500/10 dark:bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[20%] w-[40%] h-[40%] bg-[var(--primary)]/10 dark:bg-[var(--primary)]/20 rounded-full blur-[120px]" />
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
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center border border-amber-100 dark:border-amber-700/30 text-amber-600 dark:text-amber-400">
              <Key size={24} weight="duotone" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-main)] dark:text-white">Acceso Administrativo</h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Gestión interna de AND</p>
            </div>
          </div>

          <div className="space-y-4">
            <InputGroup 
              label="Nombre Completo"
              icon={<User size={18} />}
              placeholder="Admin Name"
              theme="brand"
              onChange={(e) => setName(e.target.value)}
            />

            <InputGroup 
              label="Correo Administrativo"
              icon={<Envelope size={18} />}
              placeholder="admin@and.com"
              theme="brand"
              onChange={(e) => setEmail(e.target.value)}
            />

            <InputGroup 
              label="Código de Acceso"
              icon={<ShieldCheck size={18} />}
              placeholder="Código autorizado"
              theme="brand"
              type="password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
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

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-xs text-red-800 dark:text-red-200">
                  {error}
                </p>
              </div>
            )}

            <GradientButton 
              disabled={loading}
              onClick={handleRegister}
              className="mt-4"
              // Usar un tema diferente o personalizado para admin si es necesario, 
              // por ahora 'brand' está bien o quizás algo con tonos amber si GradientButton lo soporta.
              // Como GradientButton tiene prop 'theme', veamos si soporta algo más.
              // Por defecto usa brand.
              theme="brand" 
            >
              {loading ? "Registrando..." : "Registrar Admin"}
            </GradientButton>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
